"""FORTUNE U GROUP MASTER AI AGENT (orchestrator).

Central router that receives events, understands intent, selects the correct
specialist agent, executes the workflow, validates the result, updates the
CRM/logs and decides the next action.

Approval-gating: destructive/irreversible actions (delete, bulk send,
publish, spend, infra changes) require an explicit approval flag or a human
decision before execution.
"""
from __future__ import annotations

import json
import time
import uuid
from typing import Any, Dict, List, Optional

from . import constants
from .agents.analytics_agent import AnalyticsAgent
from .agents.content_agent import ContentAgent
from .agents.error_agent import ErrorAgent
from .agents.followup_agent import FollowUpAgent
from .agents.lead_agent import LeadAgent
from .agents.seo_agent import SEOAgent
from .agents.social_agent import SocialAgent
from .agents.whatsapp_agent import WhatsAppAgent
from .agents.website_agent import WebsiteAgent
from .approvals import ApprovalService
from .crm import Crm
from .llm import LLMClient
from .observability import Observability, new_execution_id
from .secrets import redact


class Orchestrator:
    """Composes all agents and routes events between them."""

    def __init__(self, settings, crm: Optional[Crm] = None):
        self.settings = settings
        self.crm = crm or Crm(settings)
        self.obs = Observability(self.crm)
        self.llm = LLMClient(api_key=settings.gemini_api_key, model=settings.gemini_model)
        self.approvals = ApprovalService(self.crm, auto_publish=settings.auto_publish)

        # Agents
        self.lead_agent = LeadAgent(self.crm, self.obs)
        self.whatsapp_agent = WhatsAppAgent(self.crm, self.obs, settings)
        self.website_agent = WebsiteAgent(self.crm, self.obs, self.lead_agent, self.whatsapp_agent)
        self.content_agent = ContentAgent(self.crm, self.obs, self.llm, self.approvals)
        self.social_agent = SocialAgent(self.crm, self.obs, settings, self.approvals)
        self.followup_agent = FollowUpAgent(self.crm, self.obs, self.whatsapp_agent)
        self.analytics_agent = AnalyticsAgent(self.crm, self.obs)
        self.error_agent = ErrorAgent(self.crm, self.obs)
        self.seo_agent = SEOAgent(self.crm, self.obs, settings.seo_site_root)

    # ------------------------------------------------------------------
    def route(self, event: Dict[str, Any]) -> Dict[str, Any]:
        """Entry point. ``event`` must contain ``type`` and a ``payload``."""
        event_type = str(event.get("type") or "").upper()
        payload = event.get("payload") or {}
        execution_id = event.get("execution_id") or new_execution_id()

        if event_type not in constants.EVENT_TYPES:
            self.obs.log_event("WF-14 Master Orchestrator", "UNKNOWN_EVENT", execution_id,
                               "ERROR", error_message=f"unknown event type {event_type}")
            return {"status": "error", "reason": f"unknown event type: {event_type}"}

        handler = getattr(self, f"_on_{event_type.lower()}", None)
        if not handler:
            return {"status": "error", "reason": f"no handler for {event_type}"}

        try:
            result = handler(payload, execution_id)
            return {"status": "ok", "execution_id": execution_id, "result": result}
        except Exception as e:
            self.obs.record_error("WF-14 Master Orchestrator", str(e),
                                  trace=__import__("traceback").format_exc())
            self.obs.log_event("WF-14 Master Orchestrator", event_type, execution_id,
                               "ERROR", error_message=str(e))
            return {"status": "error", "execution_id": execution_id, "reason": str(e)}

    # -- Event handlers -------------------------------------------------
    def _on_lead_captured(self, payload, execution_id):
        return self.website_agent.intake(payload, execution_id)

    def _on_inbound_message(self, payload, execution_id):
        lead = self.crm.get_lead(payload.get("lead_id") or "")
        if not lead:
            lead = self.lead_agent.ingest(payload, execution_id)["lead"] and self.crm.get_lead(
                self.lead_agent.ingest(payload, execution_id)["lead_id"]
            )
        decision = self.whatsapp_agent.handle_inbound(lead, payload.get("text", ""), execution_id)
        if decision.get("status") == "human_handoff":
            self.whatsapp_agent.hand_over_to_human(lead, execution_id)
        return decision

    def _on_followup_due(self, payload, execution_id):
        return self.followup_agent.process_due(execution_id)

    def _on_content_request(self, payload, execution_id):
        platform = payload.get("platform", "website")
        topic = payload.get("topic", "")
        return self.content_agent.generate_package(platform, topic, execution_id)

    def _on_publish_request(self, payload, execution_id):
        platform = payload.get("platform", "")
        topic = payload.get("topic", "")
        approval_id = payload.get("approval_id", "")
        package = payload.get("package") or self.content_agent.generate_package(platform, topic, execution_id)
        # Approval-gated.
        if not approval_id:
            approval = self.approvals.create_request(
                "publish", topic, f"Publish {platform}: {topic}", package, requires_human=True
            )
            return {"status": "blocked", "reason": "requires_human_approval",
                    "approval_id": approval["approval_id"]}
        return self.social_agent.publish(platform, package, approval_id, execution_id)

    def _on_approval_decided(self, payload, execution_id):
        approval_id = payload.get("approval_id", "")
        approved = bool(payload.get("approved"))
        decided_by = payload.get("decided_by", "human")
        return self.approvals.decide(approval_id, approved, decided_by)

    def _on_report_request(self, payload, execution_id):
        kind = str(payload.get("kind") or "daily").lower()
        if kind == "weekly":
            return self.analytics_agent.weekly_report(execution_id)
        return self.analytics_agent.daily_report(execution_id)

    def _on_workflow_failure(self, payload, execution_id):
        return self.error_agent.retry_error(payload.get("error_id", ""))

    def _on_scheduled_task(self, payload, execution_id):
        task = payload.get("task", "")
        if task == "followups":
            return self.followup_agent.process_due(execution_id)
        if task == "seo":
            return self.seo_agent.audit(execution_id)
        if task == "report":
            return self.analytics_agent.daily_report(execution_id)
        return {"status": "unknown_task", "task": task}

    # ------------------------------------------------------------------
    def status_report(self) -> Dict[str, Any]:
        """High-level system status including BLOCKED integrations."""
        return {
            "agent": constants.BRAND + " Master AI Agent",
            "crm_backend": self.crm.backend_name,
            "auto_publish": self.settings.auto_publish,
            "blockers": self.crm.blockers(),
            "credentials": self.social_agent.credentials_summary(),
            "leads": len(self.crm.all_leads()),
            "errors_open": len(self.error_agent.open_errors()),
        }
