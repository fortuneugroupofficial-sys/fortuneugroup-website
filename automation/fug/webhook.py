"""Lead intake webhook (stdlib http.server).

The static website's contact form can POST JSON here to capture leads. In
production the n8n webhook (``/webhook/book-consultation``) should be the
primary intake; this server provides a self-hosted fallback / dev endpoint.

If ``INTAKE_SECRET`` is set, requests must send it in the ``X-Intake-Secret``
header, otherwise they are rejected (401). Never logs secrets.
"""
from __future__ import annotations

import json
import logging
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Optional
from urllib.parse import urlparse

from .orchestrator import Orchestrator
from .secrets import redact, register_secret_value

log = logging.getLogger("fug.webhook")


def make_handler(orchestrator: Orchestrator, intake_secret: Optional[str] = None):
    if intake_secret:
        register_secret_value(intake_secret)

    class Handler(BaseHTTPRequestHandler):
        def _reply(self, code: int, obj: dict):
            body = json.dumps(obj).encode("utf-8")
            self.send_response(code)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def _authorized(self) -> bool:
            if not intake_secret:
                return True
            return self.headers.get("X-Intake-Secret") == intake_secret

        def do_POST(self):
            path = urlparse(self.path).path
            if path not in ("/webhook/lead", "/webhook/book-consultation", "/api/leads"):
                self._reply(404, {"error": "not_found"})
                return
            if not self._authorized():
                self._reply(401, {"error": "unauthorized"})
                return
            try:
                length = int(self.headers.get("Content-Length") or 0)
                raw = self.rfile.read(length).decode("utf-8") if length else "{}"
                payload = json.loads(raw)
            except (ValueError, json.JSONDecodeError):
                self._reply(400, {"error": "invalid_json"})
                return
            result = orchestrator.route(
                {"type": "LEAD_CAPTURED", "payload": payload,
                 "execution_id": __import__("fug.observability", fromlist=["new_execution_id"]).new_execution_id()}
            )
            status = 201 if result.get("status") == "ok" else 400
            self._reply(status, result)

        def do_GET(self):
            # Simple health check (does not reveal configuration).
            if urlparse(self.path).path == "/health":
                self._reply(200, {"status": "ok", "service": "fug-intake"})
            else:
                self._reply(404, {"error": "not_found"})

        def log_message(self, fmt, *args):
            # Redact any headers/query accidentally included in logs.
            log.info("webhook: " + redact(fmt % args))

    return Handler


def run_server(host: str = "0.0.0.0", port: int = 8080, orchestrator: Optional[Orchestrator] = None,
               intake_secret: Optional[str] = None):
    settings = __import__("fug.config", fromlist=["get_settings"]).get_settings()
    orchestrator = orchestrator or Orchestrator(settings)
    handler = make_handler(orchestrator, intake_secret or settings.intake_secret)
    httpd = ThreadingHTTPServer((host, port), handler)
    log.info("FUG intake listening on %s:%s (crm=%s)", host, port, orchestrator.crm.backend_name)
    httpd.serve_forever()
