"""NocoDB REST client.

Used when ``NOCODB_URL`` and ``NOCODB_API_TOKEN`` are configured. The token is
read from the environment and sent only as an auth header (``xc-auth`` for a
JWT, ``xc-token`` for an API token) — it is never logged or persisted.

The client maps the JSON store's table names to NocoDB tables. If NocoDB is
not configured, the CRM facade falls back to the local JSON store and reports
the integration as BLOCKED.
"""
from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional

from .secrets import redact, redact_mapping

TABLE_MAP = {
    "Leads": "Leads",
    "Contacts": "Contacts",
    "Interactions": "Interactions",
    "FollowUps": "FollowUps",
    "Content": "Content",
    "PublishingQueue": "PublishingQueue",
    "SocialPosts": "SocialPosts",
    "Campaigns": "Campaigns",
    "Tasks": "Tasks",
    "Approvals": "Approvals",
    "AutomationLogs": "AutomationLogs",
    "Errors": "Errors",
    "Settings": "Settings",
}


class NocoDBError(RuntimeError):
    pass


def _is_jwt(token: str) -> bool:
    """NocoDB sign-in returns a JWT (three dot-separated parts); UI-generated
    API tokens are not JWTs."""
    return token.count(".") >= 2 and len(token) > 40


class NocoDBClient:
    def __init__(self, base_url: str, api_token: str, db_name: str = "fug_crm"):
        self.base_url = base_url.rstrip("/")
        self.api_token = api_token
        self.db_name = db_name
        # JWT (from sign-in) -> xc-auth; API token -> xc-token
        self._auth_header = "xc-auth" if _is_jwt(api_token) else "xc-token"

    # ------------------------------------------------------------------ auth
    def _headers(self) -> dict:
        return {
            self._auth_header: self.api_token,
            "Content-Type": "application/json",
        }

    # ------------------------------------------------------------------ low level
    def _data(self, method: str, path: str, payload: Optional[dict] = None) -> dict:
        """Call the NocoDB v2 data REST API under this base/db."""
        url = f"{self.base_url}/api/v1/db/data/noco/{self.db_name}/{path}"
        return self._request(url, method, payload)

    def _meta(self, method: str, path: str, payload: Optional[dict] = None) -> dict:
        url = f"{self.base_url}/api/v1/meta/{path}"
        return self._request(url, method, payload)

    def _request(self, url: str, method: str, payload: Optional[dict] = None) -> dict:
        body = json.dumps(payload).encode("utf-8") if payload is not None else None
        req = urllib.request.Request(url, data=body, method=method, headers=self._headers())
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                raw = resp.read().decode("utf-8")
                return json.loads(raw) if raw else {}
        except urllib.error.HTTPError as e:
            detail = e.read().decode("utf-8", errors="replace")[:300]
            raise NocoDBError(f"NocoDB HTTP {e.code} on {method} {url}: {redact(detail)}") from e
        except urllib.error.URLError as e:
            raise NocoDBError(f"NocoDB unreachable ({method} {url}): {e.reason}") from e

    # ------------------------------------------------------------------ rows
    def _table(self, table: str) -> str:
        return urllib.parse.quote(TABLE_MAP.get(table, table))

    def list_rows(self, table: str, limit: int = 100, where: Optional[str] = None) -> List[dict]:
        q = f"?limit={limit}"
        if where:
            q += "&where=" + urllib.parse.quote(where)
        return self._data("GET", f"{self._table(table)}/rows{q}").get("list", [])

    def create_row(self, table: str, data: dict) -> dict:
        return self._data("POST", f"{self._table(table)}/rows", data)

    def update_row(self, table: str, pk: int, data: dict) -> dict:
        return self._data("PATCH", f"{self._table(table)}/rows/{pk}", data)

    def delete_row(self, table: str, pk: int) -> None:
        self._data("DELETE", f"{self._table(table)}/rows/{pk}")

    # ------------------------------------------------------------------ meta / provisioning
    def check_connection(self) -> dict:
        """READ-ONLY connectivity + auth check. Returns a status dict."""
        try:
            self._meta("GET", "tables")
            return {"connected": True, "base": self.db_name, "auth": self._auth_header}
        except NocoDBError as e:
            return {"connected": False, "error": str(e)}

    def list_tables(self) -> List[str]:
        resp = self._meta("GET", "tables")
        items = resp.get("tables") or resp.get("list") or resp.get("items") or []
        names = []
        for it in items:
            names.append(it.get("title") or it.get("name") or it.get("table_name"))
        return [n for n in names if n]

    def create_table(self, table_name: str, columns: List[dict]) -> dict:
        """Create a table with the given columns via the NocoDB meta API.
        ``columns`` is a list of {name, type, ...} as in the schema JSON."""
        return self._meta(
            "POST",
            "tables",
            {
                "baseId": self.db_name,
                "table_name": table_name,
                "columns": columns,
            },
        )

    def ensure_tables(self, schema: Dict[str, Any]) -> dict:
        """Create any schema tables that don't already exist (idempotent).

        ``schema`` is the parsed ``automation/nocodb/schema.json`` object whose
        ``tables`` maps table-name -> {columns: [...]}.
        """
        required = list(schema["tables"].keys())
        existing = set(self.list_tables())
        created, present = [], [t for t in required if t in existing]
        for name in required:
            if name in existing:
                continue
            cols = schema["tables"][name].get("columns", [])
            self.create_table(name, cols)
            created.append(name)
        return {"required": required, "present": present, "created": created}
