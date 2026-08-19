"""ANALYTICS / REPORTING AGENT.

Produces daily/weekly/monthly management reports from the CRM. Tracks leads,
sources, conversions, WhatsApp activity, follow-ups, content, publishing and
automation errors.
"""
from __future__ import annotations

import time
from collections import Counter
from datetime import datetime, timezone
from typing import Dict, List

from ..constants import AGENT_NAMES, EVENT_TYPES


def _fmt(ts: int) -> str:
    return datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")


class AnalyticsAgent:
    def __init__(self, crm, observability):
        self.crm = crm
        self.obs = observability

    def _logs(self):
        return self.crm.list_rows("AutomationLogs")

    def daily_report(self, execution_id: str = "") -> Dict[str, object]:
        leads = self.crm.all_leads()
        today = _fmt(int(time.time()))
        logs = self._logs()

        status_counts = Counter(l.status for l in leads)
        source_counts = Counter(l.source for l in leads)
        followups_due = [
            l
            for l in leads
            if not l.opted_out
            and l.status not in ("CONVERTED", "LOST", "NOT_INTERESTED", "HUMAN_HANDOFF")
            and l.followup_count < 3
            and (not l.next_followup_at or l.next_followup_at <= int(time.time()))
        ]

        report = {
            "report_type": "DAILY",
            "date": today,
            "New Leads": len(leads),
            "Qualified": status_counts.get("QUALIFIED", 0),
            "Follow-ups Due": len(followups_due),
            "Conversions": status_counts.get("CONVERTED", 0),
            "WhatsApp Messages": sum(
                1 for l in logs if l.get("event_type") == "WHATSAPP_SENT"
            ),
            "Content Items": len(self.crm.list_rows("Content")),
            "PublishingQueue": len(self.crm.list_rows("PublishingQueue")),
            "Automation Errors": len(
                [e for e in self.crm.list_rows("Errors") if not e.get("resolved")]
            ),
            "By Status": dict(status_counts),
            "By Source": dict(source_counts),
            "Priority Actions": self._priority_actions(leads, followups_due),
        }
        return report

    def weekly_report(self, execution_id: str = "") -> Dict[str, object]:
        report = self.daily_report(execution_id)
        report["report_type"] = "WEEKLY"
        return report

    def _priority_actions(self, leads, followups_due) -> List[str]:
        actions = []
        urgent = [l for l in leads if l.priority == "URGENT" and l.status not in ("CONVERTED", "LOST")]
        for l in urgent[:3]:
            actions.append(f"Follow up on {l.name} ({l.service}) — URGENT")
        if followups_due:
            actions.append(f"{len(followups_due)} follow-up(s) are due now")
        errors = [e for e in self.crm.list_rows("Errors") if not e.get("resolved")]
        if errors:
            actions.append(f"{len(errors)} unresolved automation error(s) — review Error Agent")
        return actions or ["None"]
