"""WEBSITE AGENT.

Responsibilities:
* Validate incoming website enquiries
* Send leads to the CRM (via the Lead agent)
* Trigger WhatsApp acknowledgement
* Trigger the follow-up workflow
* Monitor website errors / SEO basics when monitoring access is available

Website error/analytics monitoring is gated on website monitoring credentials
which are currently BLOCKED (no CMS access token is provided).
"""
from __future__ import annotations

from typing import Any, Dict

from .lead_agent import LeadAgent
from .whatsapp_agent import WhatsAppAgent


class WebsiteAgent:
    def __init__(self, crm, observability, lead_agent: LeadAgent, whatsapp_agent: WhatsAppAgent):
        self.crm = crm
        self.obs = observability
        self.lead_agent = lead_agent
        self.wa = whatsapp_agent

    def intake(self, payload: Dict[str, Any], execution_id: str = "") -> Dict[str, Any]:
        """Handle a website lead submission end-to-end (capture + ack)."""
        result = self.lead_agent.ingest(payload, execution_id)
        if result["status"] == "new":
            lead = self.crm.get_lead(result["lead_id"])
            if lead and lead.phone:
                self.wa.acknowledge(lead, execution_id)
        return result

    def website_monitoring_available(self) -> bool:
        # No CMS/website-access token is configured → BLOCKED.
        return False

    def health_check(self) -> Dict[str, str]:
        return {
            "status": "ok",
            "monitoring": "blocked" if not self.website_monitoring_available() else "enabled",
        }
