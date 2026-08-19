"""Built-in JSON-file store for the CRM.

This is the zero-config fallback used when NocoDB is not reachable (BLOCKED).
It persists the same tables that NocoDB would hold, so data can later be
migrated. It is intentionally simple and dependency-free; production uses the
NocoDB-backed client (see :mod:`fug.nocodb`).
"""
from __future__ import annotations

import json
import os
import threading
from pathlib import Path
from typing import Any, Dict, List, Optional

from .models import Lead
from .secrets import redact_mapping

_LOCK = threading.RLock()


class JsonStore:
    """Thread-safe JSON document store keyed by collection."""

    def __init__(self, data_dir: str):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self._collections: Dict[str, Dict[str, dict]] = {}
        self._load_all()

    def _path(self, collection: str) -> Path:
        safe = "".join(c for c in collection if c.isalnum() or c in "_-")
        return self.data_dir / f"{safe}.json"

    def _load_all(self) -> None:
        for f in self.data_dir.glob("*.json"):
            name = f.stem
            try:
                self._collections[name] = json.loads(f.read_text(encoding="utf-8"))
            except (json.JSONDecodeError, OSError):
                self._collections[name] = {}

    def _flush(self, collection: str) -> None:
        with _LOCK:
            path = self._path(collection)
            path.write_text(
                json.dumps(self._collections.get(collection, {}), indent=2, default=str),
                encoding="utf-8",
            )

    def insert(self, collection: str, doc_id: str, doc: dict) -> None:
        with _LOCK:
            self._collections.setdefault(collection, {})[doc_id] = doc
            self._flush(collection)

    def update(self, collection: str, doc_id: str, patch: dict) -> Optional[dict]:
        with _LOCK:
            docs = self._collections.setdefault(collection, {})
            if doc_id not in docs:
                return None
            docs[doc_id].update(patch)
            self._flush(collection)
            return docs[doc_id]

    def get(self, collection: str, doc_id: str) -> Optional[dict]:
        return self._collections.get(collection, {}).get(doc_id)

    def all(self, collection: str) -> List[dict]:
        return list(self._collections.get(collection, {}).values())

    def find(self, collection: str, predicate) -> List[dict]:
        return [d for d in self.all(collection) if predicate(d)]

    def delete(self, collection: str, doc_id: str) -> bool:
        with _LOCK:
            docs = self._collections.get(collection, {})
            if doc_id not in docs:
                return False
            del docs[doc_id]
            self._flush(collection)
            return True


class CrmStore:
    """High-level CRUD for Leads plus generic tables on top of JsonStore.

    Table names match the recommended NocoDB schema so the same business
    logic runs against either backend.
    """

    TABLES = (
        "Leads",
        "Contacts",
        "Interactions",
        "FollowUps",
        "Content",
        "PublishingQueue",
        "SocialPosts",
        "Campaigns",
        "Tasks",
        "Approvals",
        "AutomationLogs",
        "Errors",
        "Settings",
    )

    def __init__(self, data_dir: str):
        self.store = JsonStore(data_dir)
        self.leads: Dict[str, Lead] = {}

    # -- Leads ---------------------------------------------------------------
    def upsert_lead(self, lead: Lead) -> Lead:
        lead.touch()
        self.store.insert("Leads", lead.lead_id, lead.to_dict())
        return lead

    def get_lead(self, lead_id: str) -> Optional[Lead]:
        raw = self.store.get("Leads", lead_id)
        return Lead.from_dict(raw) if raw else None

    def all_leads(self) -> List[Lead]:
        return [Lead.from_dict(d) for d in self.store.all("Leads")]

    def find_leads(self, predicate=None) -> List[Lead]:
        pred = predicate or (lambda l: True)
        return [l for l in self.all_leads() if pred(l)]

    def find_by_dedup(self, dedup_key: str) -> Optional[Lead]:
        for lead in self.all_leads():
            if lead.dedup_key == dedup_key:
                return lead
        return None

    def delete_lead(self, lead_id: str) -> bool:
        return self.store.delete("Leads", lead_id)

    # -- Generic tables --------------------------------------------------------
    def add(self, table: str, doc_id: str, doc: dict) -> None:
        self.store.insert(table, doc_id, doc)

    def patch(self, table: str, doc_id: str, patch: dict) -> Optional[dict]:
        return self.store.update(table, doc_id, patch)

    def list_table(self, table: str) -> List[dict]:
        return self.store.all(table)

    def reset(self) -> None:
        for t in self.TABLES:
            self.store.delete(t, "*")

    def redacted_dump(self, table: str) -> list:
        """Dump a table with sensitive fields redacted (for reports/logs)."""
        return [redact_mapping(d) for d in self.list_table(table)]
