"""NocoDB REST client.

Used when ``NOCODB_URL`` and ``NOCODB_API_TOKEN`` are configured. The token
is read from the environment and sent only as an ``xc-token`` header — it is
never logged or persisted by this module.

The client maps the JSON store's table names to NocoDB tables. If NocoDB is
not configured, :class:`CrmBackend` raises a clear BLOCKED signal so the
orchestrator falls back to the local store.
"""
from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional

from .secrets import redact_mapping

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


class NocoDBClient:
    def __init__(self, base_url: str, api_token: str, db_name: str = "fug_crm"):
        self.base_url = base_url.rstrip("/")
        self.api_token = api_token
        self.db_name = db_name

    def _table(self, table: str) -> str:
        mapped = TABLE_MAP.get(table, table)
        return urllib.parse.quote(mapped)

    def _request(self, method: str, path: str, payload: Optional[dict] = None) -> dict:
        url = f"{self.base_url}/api/v1/db/data/noco/{self.db_name}/{path}"
        headers = {
            "xc-token": self.api_token,
            "Content-Type": "application/json",
        }
        body = json.dumps(payload).encode("utf-8") if payload is not None else None
        req = urllib.request.Request(url, data=body, method=method, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                raw = resp.read().decode("utf-8")
                return json.loads(raw) if raw else {}
        except urllib.error.HTTPError as e:
            detail = e.read().decode("utf-8", errors="replace")[:300]
            raise NocoDBError(f"NocoDB HTTP {e.code} on {method} {path}: {detail}") from e
        except urllib.error.URLError as e:
            raise NocoDBError(f"NocoDB unreachable ({method} {path}): {e.reason}") from e

    def row_by_pk(self, table: str, pk: str) -> Optional[dict]:
        return self._request("GET", f"{self._table(table)}/rows/{pk}")

    def list_rows(self, table: str, limit: int = 100, where: Optional[str] = None) -> List[dict]:
        q = f"?limit={limit}"
        if where:
            q += "&where=" + urllib.parse.quote(where)
        return self._request("GET", f"{self._table(table)}/rows{q}").get("list", [])

    def create_row(self, table: str, data: dict) -> dict:
        return self._request("POST", f"{self._table(table)}/rows", data)

    def update_row(self, table: str, pk: int, data: dict) -> dict:
        return self._request("PATCH", f"{self._table(table)}/rows/{pk}", data)

    def delete_row(self, table: str, pk: int) -> None:
        self._request("DELETE", f"{self._table(table)}/rows/{pk}")

    def health(self) -> bool:
        try:
            self._request("GET", "meta/tables")
            return True
        except NocoDBError:
            return False
