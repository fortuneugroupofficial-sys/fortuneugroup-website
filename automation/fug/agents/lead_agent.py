"""LEAD/CRM AGENT.

Responsibilities:
* Capture website leads
* Validate lead information
* Normalise phone numbers
* Deduplicate leads (never overwrite history)
* Create/update NocoDB (or local) records
* Assign status / source / priority, record timestamps & follow-up history
* Detect duplicate enquiries and return the existing record + a note
"""
from __future__ import annotations

import time
from typing import Any, Dict, List, Optional, Tuple

from .. import normalizers
from ..constants import DEFAULT_LEAD_STATUS, DEFAULT_PRIORITY
from ..models import Lead


class LeadAgent:
    def __init__(self, crm, observability):
        self.crm = crm
        self.obs = observability

    def ingest(self, payload: Dict[str, Any], execution_id: str) -> Dict[str, Any]:
        """Validate, normalise, dedupe and persist a new lead.

        Returns a structured result including any duplicate detection and
        validation problems.
        """
        source = str(payload.get("source") or "WEBSITE_CONTACT").upper()
        goal = payload.get("goal") or payload.get("service") or ""
        phone = normalizers.normalize_phone(payload.get("mobile") or payload.get("phone"))
        email = normalizers.normalize_email(payload.get("email"))
        name = (payload.get("name") or "").strip()

        problems = []
        if not normalizers.is_valid_name(name):
            problems.append("invalid_name")
        if not phone:
            problems.append("invalid_phone")
        if email and not email:
            problems.append("invalid_email")

        dedup = normalizers.dedup_key(phone, email, name)
        duplicate = self.crm.find_by_dedup(dedup) if dedup else None

        if duplicate and not problems:
            # Do not overwrite history: append a note and return existing.
            duplicate.add_note(f"Duplicate enquiry detected from source={source}")
            duplicate.source = duplicate.source or source
            self.crm.upsert_lead(duplicate)
            self.obs.log_event(
                "WF-01 Website Lead Intake",
                "LEAD_DUPLICATE",
                execution_id,
                "DUPLICATE",
                lead_id=duplicate.lead_id,
                result={"lead_id": duplicate.lead_id, "duplicate": True},
            )
            return {
                "status": "duplicate",
                "lead_id": duplicate.lead_id,
                "duplicate": True,
                "problems": [],
                "lead": duplicate.to_dict(),
            }

        lead = Lead(
            name=name,
            phone=phone,
            email=email,
            city=(payload.get("city") or "").strip(),
            source=source,
            service=normalizers.guess_service(goal),
            message=normalizers.sanitize_message(payload.get("message")),
            status=DEFAULT_LEAD_STATUS,
            priority=self._assign_priority(payload, problems),
            assigned_to="",
            created_at=int(time.time()),
            updated_at=int(time.time()),
            dedup_key=dedup,
        )
        if problems:
            lead.status = "NEW"
            lead.add_note(f"Validation problems on intake: {', '.join(problems)}")

        self.crm.upsert_lead(lead)
        self.obs.log_event(
            "WF-01 Website Lead Intake",
            "LEAD_CAPTURED",
            execution_id,
            "NEW" if not problems else "INVALID",
            lead_id=lead.lead_id,
            result={"lead_id": lead.lead_id, "problems": problems},
        )
        return {
            "status": "invalid" if problems else "new",
            "lead_id": lead.lead_id,
            "duplicate": False,
            "problems": problems,
            "lead": lead.to_dict(),
        }

    def _assign_priority(self, payload: Dict[str, Any], problems: List[str]) -> str:
        if problems:
            return DEFAULT_PRIORITY
        goal = str(payload.get("goal") or "").lower()
        if any(k in goal for k in ("health", "term", "life")):
            return "HIGH"
        return DEFAULT_PRIORITY

    def set_status(self, lead_id: str, status: str) -> Optional[Lead]:
        lead = self.crm.get_lead(lead_id)
        if not lead:
            return None
        lead.status = status
        lead.touch()
        self.crm.upsert_lead(lead)
        return lead

    def set_priority(self, lead_id: str, priority: str) -> Optional[Lead]:
        lead = self.crm.get_lead(lead_id)
        if not lead:
            return None
        lead.priority = priority
        lead.touch()
        self.crm.upsert_lead(lead)
        return lead

    def opt_out(self, lead_id: str) -> Optional[Lead]:
        lead = self.crm.get_lead(lead_id)
        if not lead:
            return None
        lead.opted_out = True
        lead.whatsapp_status = "OPTED_OUT"
        lead.add_note("Lead opted out of messaging")
        self.crm.upsert_lead(lead)
        return lead

    def mark_human_handoff(self, lead_id: str, reason: str) -> Optional[Lead]:
        lead = self.crm.get_lead(lead_id)
        if not lead:
            return None
        lead.status = "HUMAN_HANDOFF"
        lead.human_handoff = reason
        lead.add_note(f"Human handoff: {reason}")
        self.crm.upsert_lead(lead)
        return lead
