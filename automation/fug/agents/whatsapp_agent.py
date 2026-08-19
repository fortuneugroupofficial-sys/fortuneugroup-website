"""WHATSAPP AGENT.

Responsibilities:
* Send approved template messages (respecting opt-out + rate limits)
* Send lead acknowledgement, follow-ups, reminders, human handover
* Update CRM after conversations
* Detect opt-out and hand-off triggers
* Route complex / sensitive conversations to human staff

Never sends uncontrolled bulk spam. Uses the WhatsApp Cloud API template
channel only. In dry-run mode nothing is transmitted.
"""
from __future__ import annotations

import time
from typing import Any, Dict, Optional

from .. import templates
from ..constants import HUMAN_HANDOFF_REASONS, MAX_FOLLOWUPS, OPT_OUT_KEYWORDS
from ..models import Lead
from ..notifiers import WhatsAppClient


class WhatsAppAgent:
    def __init__(self, crm, observability, settings):
        self.crm = crm
        self.obs = observability

        def log_sink(**kw):
            crm.add_row(
                "Interactions",
                f"wa-{int(time.time()*1000)}",
                {
                    "type": "whatsapp",
                    "timestamp": int(time.time()),
                    "template": kw.get("template"),
                    "to": kw.get("to"),
                    "status": kw.get("status"),
                    "detail": kw.get("detail"),
                },
            )

        self.client = WhatsAppClient(
            access_token=settings.whatsapp_token,
            phone_number_id=settings.whatsapp_phone_id,
            business_number=settings.whatsapp_business_number,
            dry_run=settings.dry_run,
            log_sink=log_sink,
        )

    # ------------------------------------------------------------------
    def acknowledge(self, lead: Lead, execution_id: str) -> Dict[str, Any]:
        if self._cannot_send(lead):
            return {"status": "skipped", "reason": "opted_out_or_missing_phone"}
        self._send(lead, "new_lead_acknowledgement", execution_id, ["acknowledgement"])
        lead.whatsapp_status = "ACKNOWLEDGED"
        lead.add_note("Acknowledgement sent")
        self.crm.upsert_lead(lead)
        return {"status": "sent", "template": "new_lead_acknowledgement"}

    def follow_up(self, lead: Lead, execution_id: str) -> Dict[str, Any]:
        if lead.opted_out:
            return {"status": "skipped", "reason": "opted_out"}
        if lead.followup_count >= MAX_FOLLOWUPS:
            return {"status": "skipped", "reason": "max_followups_reached"}
        step = lead.followup_count + 1
        name = templates.resolve_sequence(step)
        if not name:
            return {"status": "skipped", "reason": "no_template"}
        self._send(lead, name, execution_id, [str(step)])
        lead.followup_count = step
        lead.whatsapp_status = f"FOLLOWUP_{step}"
        lead.last_contacted_at = int(time.time())
        lead.add_note(f"Follow-up {step} sent")
        self.crm.upsert_lead(lead)
        return {"status": "sent", "template": name, "step": step}

    def send_reminder(self, lead: Lead, template_name: str, execution_id: str) -> Dict[str, Any]:
        if lead.opted_out:
            return {"status": "skipped", "reason": "opted_out"}
        self._send(lead, template_name, execution_id, [template_name])
        lead.whatsapp_status = template_name.upper()
        lead.last_contacted_at = int(time.time())
        lead.add_note(f"Sent {template_name}")
        self.crm.upsert_lead(lead)
        return {"status": "sent", "template": template_name}

    def hand_over_to_human(self, lead: Lead, execution_id: str) -> Dict[str, Any]:
        self._send(lead, "human_handover", execution_id, [])
        lead.status = "HUMAN_HANDOFF"
        lead.add_note("Routed to human advisor")
        self.crm.upsert_lead(lead)
        return {"status": "handed_over"}

    # ------------------------------------------------------------------
    def handle_inbound(self, lead: Lead, text: str, execution_id: str) -> Dict[str, Any]:
        """Process an inbound WhatsApp text. Returns a routing decision."""
        low = (text or "").lower()
        # Opt-out detection.
        if any(k in low for k in OPT_OUT_KEYWORDS):
            lead.opted_out = True
            lead.whatsapp_status = "OPTED_OUT"
            lead.add_note("User opted out via inbound message")
            self.crm.upsert_lead(lead)
            return {"status": "opted_out"}
        # Human hand-off triggers.
        trigger = self._handoff_trigger(low)
        if trigger:
            lead.status = "HUMAN_HANDOFF"
            lead.human_handoff = trigger
            lead.add_note(f"Human handoff via inbound: {trigger}")
            self.crm.upsert_lead(lead)
            return {"status": "human_handoff", "reason": trigger}
        # Confidence gate for anything question-heavy.
        if self._low_confidence(low):
            lead.status = "HUMAN_HANDOFF"
            lead.human_handoff = "LOW_CONFIDENCE"
            lead.add_note("Low confidence — routed to human")
            self.crm.upsert_lead(lead)
            return {"status": "human_handoff", "reason": "LOW_CONFIDENCE"}
        return {"status": "noted"}

    # ------------------------------------------------------------------
    def _cannot_send(self, lead: Lead) -> bool:
        return lead.opted_out or not lead.phone

    def _send(self, lead: Lead, template_name: str, execution_id: str, params) -> Dict[str, Any]:
        try:
            result = self.client.send_template(
                to=lead.phone, template_name=template_name, params=params
            )
        except Exception as e:
            self.obs.record_error(
                "WF-05 WhatsApp New Lead",
                str(e),
                lead_id=lead.lead_id,
                retry_count=lead.followup_count,
            )
            raise
        self.obs.log_event(
            "WF-05 WhatsApp New Lead",
            "WHATSAPP_SENT",
            execution_id,
            result.get("status", "sent"),
            lead_id=lead.lead_id,
            result={"template": template_name},
        )
        return result

    def _handoff_trigger(self, low: str) -> Optional[str]:
        table = {
            "complaint": "COMPLAINT",
            "refund": "PAYMENT_ISSUE",
            "payment": "PAYMENT_ISSUE",
            "legal": "LEGAL_REGULATORY",
            "regulatory": "LEGAL_REGULATORY",
            "sue": "LEGAL_REGULATORY",
            "agent": "REQUESTED_HUMAN",
            "human": "REQUESTED_HUMAN",
            "manager": "REQUESTED_HUMAN",
            "angry": "ANGRY_CUSTOMER",
        }
        for key, reason in table.items():
            if key in low:
                return reason
        return None

    def _low_confidence(self, low: str) -> bool:
        # Deep/complex insurance or medical questions → human.
        complex_markers = ("term insurance", "critical illness", "rider", "sum assured",
                           "exclusion", "waiting period", "medical", "claim")
        return sum(1 for m in complex_markers if m in low) >= 2
