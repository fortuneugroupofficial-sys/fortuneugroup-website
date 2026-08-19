"""FOLLOW-UP AGENT.

NEW LEAD -> acknowledgement -> human notification -> follow-up 1 -> follow-up 2
        -> final follow-up -> mark inactive if no response.

Considers lead status, previous messages, response history, service requested,
previous follow-up count and ``next_followup_at``. Never messages opted-out
users. Uses the WhatsApp agent for the actual send.
"""
from __future__ import annotations

import time
from datetime import datetime, timedelta
from typing import Dict, List

from ..constants import INACTIVE_AFTER_DAYS, MAX_FOLLOWUPS
from ..models import Lead


class FollowUpAgent:
    def __init__(self, crm, observability, whatsapp_agent):
        self.crm = crm
        self.obs = observability
        self.wa = whatsapp_agent

    # ------------------------------------------------------------------
    def due_followups(self, now_ts: int | None = None) -> List[Lead]:
        now = now_ts or int(time.time())
        results = []
        for lead in self.crm.all_leads():
            if lead.opted_out:
                continue
            if lead.status in ("CONVERTED", "LOST", "NOT_INTERESTED", "HUMAN_HANDOFF"):
                continue
            if lead.followup_count >= MAX_FOLLOWUPS:
                continue
            if lead.next_followup_at and lead.next_followup_at > now:
                continue
            results.append(lead)
        return results

    def schedule_next_followup(self, lead: Lead, delay_hours: int) -> Lead:
        lead.next_followup_at = int(time.time()) + int(delay_hours * 3600)
        self.crm.upsert_lead(lead)
        return lead

    def process_due(self, execution_id: str) -> Dict[str, List[dict]]:
        """Process all due follow-ups. Returns a summary of outcomes."""
        due = self.due_followups()
        results = []
        for lead in due:
            outcome = self._followup_step(lead, execution_id)
            results.append({"lead_id": lead.lead_id, **outcome})
        return {"processed": results, "count": len(results)}

    def _followup_step(self, lead: Lead, execution_id: str) -> Dict:
        if lead.followup_count >= MAX_FOLLOWUPS:
            # Mark inactive.
            lead.status = "NOT_INTERESTED"
            lead.add_note("No response after max follow-ups — marked inactive")
            self.crm.upsert_lead(lead)
            return {"action": "marked_inactive"}
        try:
            outcome = self.wa.follow_up(lead, execution_id)
        except Exception as e:
            self.obs.record_error("WF-06 WhatsApp Follow-up", str(e), lead_id=lead.lead_id)
            return {"action": "error", "detail": str(e)}
        # After sending, schedule the next interval.
        if outcome.get("status") == "sent":
            delay = {1: 24, 2: 72, 3: 120}.get(lead.followup_count, 120)
            lead = self.schedule_next_followup(lead, delay)
            self.obs.log_event(
                "WF-06 WhatsApp Follow-up",
                "FOLLOWUP_SCHEDULED",
                execution_id,
                "SCHEDULED",
                lead_id=lead.lead_id,
                result={"step": lead.followup_count, "next_at": lead.next_followup_at},
            )
        return outcome

    # ------------------------------------------------------------------
    def mark_inactive(self, lead: Lead, days: int = INACTIVE_AFTER_DAYS) -> Lead:
        if lead.followup_count >= MAX_FOLLOWUPS:
            lead.status = "NOT_INTERESTED"
            lead.add_note("Marked inactive (no response)")
            self.crm.upsert_lead(lead)
        return lead
