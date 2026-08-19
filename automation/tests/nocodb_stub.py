"""A minimal NocoDB REST API *contract stub* for offline verification.

It implements exactly the NocoDB v2 REST endpoints that :class:`fug.nocodb
.NocoDBClient` calls, so the integration layer (auth header, request format,
row CRUD, meta/table provisioning) can be genuinely exercised WITHOUT a live
NocoDB — which is BLOCKED in this sandbox (no credentials and the native
sqlite3 build dependencies are not reachable).

This is a test double, clearly labelled. It is NOT a substitute for a real
NocoDB connection test; that requires real NOCODB_URL / NOCODB_API_TOKEN.
"""
from __future__ import annotations

import json
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

DATA_PREFIX = "/api/v1/db/data/noco/"
META_PREFIX = "/api/v1/meta/"


def _filter_where(rows, where):
    """Support the simple NocoDB predicate (col,eq,value)."""
    import re

    m = re.match(r"\(([^,]+),eq,([^)]+)\)", where)
    if not m:
        return rows
    col, val = m.group(1), m.group(2)
    return [r for r in rows if str(r.get(col)) == str(val)]


class NocoDBStub:
    def __init__(self, expected_token: str, db_name: str = "fug_crm"):
        self.expected_token = expected_token
        self.db_name = db_name
        self.tables = {}          # name -> {"columns":[...]}
        self.rows = {}            # table -> {pk: row}
        self._seq = 0
        self.lock = threading.RLock()
        self.httpd = None

    def _next_pk(self):
        with self.lock:
            self._seq += 1
            return self._seq

    def start(self, host="127.0.0.1", port=0):
        stub = self

        class Handler(BaseHTTPRequestHandler):
            def _auth_ok(self) -> bool:
                hdr = self.headers.get("xc-token") or self.headers.get("xc-auth")
                return hdr == stub.expected_token

            def _json(self, code: int, obj: dict):
                body = json.dumps(obj).encode("utf-8")
                self.send_response(code)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)

            def _read(self):
                n = int(self.headers.get("Content-Length") or 0)
                return json.loads(self.rfile.read(n).decode("utf-8")) if n else {}

            def do_GET(self):
                if not self._auth_ok():
                    return self._json(401, {"msg": "unauthorized"})
                path = urlparse(self.path).path
                if path == META_PREFIX + "tables":
                    return self._json(200, {"tables": [{"title": t} for t in stub.tables]})
                if path.startswith(DATA_PREFIX):
                    rel = path[len(DATA_PREFIX):].split("/")
                    if len(rel) == 3 and rel[0] == stub.db_name and rel[2] == "rows":
                        table = rel[1]
                        query = parse_qs(urlparse(self.path).query)
                        rows = list(stub.rows.get(table, {}).values())
                        where = (query.get("where") or [""])[0]
                        if where:
                            rows = _filter_where(rows, where)
                        return self._json(200, {"list": rows})
                    if len(rel) == 4 and rel[2] == "rows":
                        table, pk = rel[1], int(rel[3])
                        with stub.lock:
                            row = stub.rows.get(table, {}).get(pk)
                        return self._json(200, row or {})
                return self._json(404, {"msg": "not found"})

            def do_POST(self):
                if not self._auth_ok():
                    return self._json(401, {"msg": "unauthorized"})
                path = urlparse(self.path).path
                if path == META_PREFIX + "tables":
                    data = self._read()
                    name = data.get("table_name") or data.get("name")
                    with stub.lock:
                        stub.tables[name] = {"columns": data.get("columns", [])}
                    return self._json(200, {"title": name, "id": len(stub.tables)})
                if path.startswith(DATA_PREFIX):
                    rel = path[len(DATA_PREFIX):].split("/")
                    if len(rel) == 3 and rel[0] == stub.db_name and rel[2] == "rows":
                        table = rel[1]
                        data = self._read()
                        pk = stub._next_pk()
                        data["Id"] = pk
                        with stub.lock:
                            stub.rows.setdefault(table, {})[pk] = data
                        return self._json(200, {"Id": pk})
                return self._json(404, {"msg": "not found"})

            def do_PATCH(self):
                if not self._auth_ok():
                    return self._json(401, {"msg": "unauthorized"})
                path = urlparse(self.path).path
                if path.startswith(DATA_PREFIX):
                    rel = path[len(DATA_PREFIX):].split("/")
                    if len(rel) == 4 and rel[2] == "rows":
                        table, pk = rel[1], int(rel[3])
                        data = self._read()
                        with stub.lock:
                            if pk not in stub.rows.get(table, {}):
                                return self._json(404, {"msg": "not found"})
                            stub.rows[table][pk].update(data)
                            return self._json(200, stub.rows[table][pk])
                return self._json(404, {"msg": "not found"})

            def log_message(self, *args):
                pass

        self.httpd = ThreadingHTTPServer((host, port), Handler)
        port = self.httpd.server_address[1]
        return port

    def serve(self):
        threading.Thread(target=self.httpd.serve_forever, daemon=True).start()

    def stop(self):
        if self.httpd:
            self.httpd.shutdown()
            self.httpd.server_close()
