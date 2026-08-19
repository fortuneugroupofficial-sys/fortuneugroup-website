"""Outbound messaging adapters.

WhatsApp Cloud API client — used only when ``WHATSAPP_ACCESS_TOKEN`` and
``WHATSAPP_PHONE_NUMBER_ID`` are configured. Message *templates* are the
only message type WhatsApp Cloud API permits for business-initiated messages,
so this client sends templates by name. In dry-run mode (the default) nothing
is actually transmitted and the intended payload is recorded to the CRM log.

Rate limiting and opt-out handling are enforced in the WhatsApp agent before
this layer is reached.
"""
from __future__ import annotations

import json
import urllib.error
import urllib.request
from typing import Dict, List, Optional

from .secrets import redact, register_secret_value

GRAPH_URL = "https://graph.facebook.com/v19.0"


class WhatsAppUnavailableError(RuntimeError):
    pass


class WhatsAppError(RuntimeError):
    pass


class WhatsAppClient:
    def __init__(
        self,
        access_token: Optional[str] = None,
        phone_number_id: Optional[str] = None,
        business_number: str = "",
        dry_run: bool = True,
        log_sink=None,
    ):
        self.access_token = access_token
        self.phone_number_id = phone_number_id
        self.business_number = business_number
        self.dry_run = dry_run
        self.log_sink = log_sink
        if access_token:
            register_secret_value(access_token)

    @property
    def available(self) -> bool:
        return bool(self.access_token and self.phone_number_id)

    def send_template(
        self, to: str, template_name: str, language: str = "en", params: Optional[List[str]] = None
    ) -> Dict:
        """Send an approved template message. Business-initiated messages MUST
        use an approved template per WhatsApp/Meta policy."""
        components = []
        if params:
            components.append(
                {
                    "type": "body",
                    "parameters": [{"type": "text", "text": p} for p in params],
                }
            )
        payload = {
            "messaging_product": "whatsapp",
            "to": to,
            "type": "template",
            "template": {"name": template_name, "language": {"code": language}},
        }
        if components:
            payload["components"] = components

        # Dry-run takes precedence: operate fully without real credentials.
        if self.dry_run:
            self._log("dry_run", to, template_name, payload)
            return {"status": "dry_run", "template": template_name, "to": to}

        if not self.available:
            raise WhatsAppUnavailableError("WhatsApp credentials missing (BLOCKED)")

        url = f"{GRAPH_URL}/{self.phone_number_id}/messages"
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
        }
        req = urllib.request.Request(
            url, data=json.dumps(payload).encode("utf-8"), method="POST", headers=headers
        )
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            detail = e.read().decode("utf-8", errors="replace")[:400]
            raise WhatsAppError(f"WhatsApp HTTP {e.code}: {detail}") from e
        except urllib.error.URLError as e:
            raise WhatsAppError(f"WhatsApp unreachable: {e.reason}") from e

    def _log(self, status, to, template, payload) -> None:
        if not self.log_sink:
            return
        safe = redact(json.dumps(payload, default=str))
        self.log_sink(status=status, to=to, template=template, detail=safe)
