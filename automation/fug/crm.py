"""Unified CRM facade.

Selects the backend automatically:
* NocoDB client when configured (production), else
* built-in JSON store (local fallback / development).

All business logic talks to :class:`Crm` and never cares which backend is
active. The active backend is recorded in ``backend_name`` for observability.
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional

from .models import Lead
from .nocodb import NocoDBClient
from .storage import CrmStore


class Crm:
    def __init__(self, settings):
        self.settings = settings
        self.nocodb = None
        self.store = CrmStore(settings.data_dir)
        if settings.nocodb_configured():
            self.nocodb = NocoDBClient(
                settings.nocodb_url, settings.nocodb_api_token, settings.nocodb_db_name
            )
        self.backend_name = "nocodb" if self.nocodb else "local_json"

    # -- Leads ----------------------------------------------------------------
    def upsert_lead(self, lead: Lead) -> Lead:
        lead.touch()
        if self.nocodb:
            try:
                self._nocodb_upsert_lead(lead)
            except Exception as exc:  # surface for error agent, fallback safe
                self._record_error("Leads", lead.lead_id, str(exc))
                raise
        self.store.upsert_lead(lead)
        return lead

    def _nocodb_upsert_lead(self, lead: Lead) -> None:
        """True upsert: update the existing NocoDB row for this lead_id, or
        create one. Prevents duplicate rows when a lead is written multiple
        times (e.g. create + acknowledgement)."""
        existing = self.nocodb.list_rows(
            "Leads", where=f"(lead_id,eq,{lead.lead_id})", limit=1
        )
        if existing:
            row_id = existing[0].get("Id")
            self.nocodb.update_row("Leads", row_id, lead.to_dict())
        else:
            self.nocodb.create_row("Leads", lead.to_dict())

    def get_lead(self, lead_id: str) -> Optional[Lead]:
        return self.store.get_lead(lead_id)

    def all_leads(self) -> List[Lead]:
        return self.store.all_leads()

    def find_by_dedup(self, dedup_key: str) -> Optional[Lead]:
        return self.store.find_by_dedup(dedup_key)

    def update_lead(self, lead_id: str, patch: dict) -> Optional[Lead]:
        lead = self.store.get_lead(lead_id)
        if not lead:
            return None
        for k, v in patch.items():
            if hasattr(lead, k):
                setattr(lead, k, v)
        lead.touch()
        self.store.upsert_lead(lead)
        return lead

    # -- Generic tables --------------------------------------------------------
    def add_row(self, table: str, doc_id: str, doc: dict) -> None:
        self.store.add(table, doc_id, doc)

    def patch_row(self, table: str, doc_id: str, patch: dict) -> Optional[dict]:
        return self.store.patch(table, doc_id, patch)

    def list_rows(self, table: str) -> List[dict]:
        return self.store.list_table(table)

    def log_automation(self, doc_id: str, doc: dict) -> None:
        self.add_row("AutomationLogs", doc_id, doc)

    def log_error(self, doc_id: str, doc: dict) -> None:
        self.add_row("Errors", doc_id, doc)

    def _record_error(self, context: str, ref: str, message: str) -> None:
        import time
        import uuid

        self.log_error(
            uuid.uuid4().hex[:16],
            {
                "error_id": uuid.uuid4().hex[:16],
                "workflow": context,
                "ref": ref,
                "message": message,
                "timestamp": int(time.time()),
                "retry_count": 0,
                "resolved": False,
            },
        )

    def blockers(self) -> List[str]:
        return self.settings.blockers()
