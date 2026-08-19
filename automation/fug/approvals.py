"""Central human-approval queue.

Publishing and other sensitive actions are gated behind an approval record
unless ``AUTO_PUBLISH`` is explicitly enabled. State machine:

DRAFT -> AI_REVIEW -> HUMAN_REVIEW -> APPROVED -> SCHEDULED -> PUBLISHED
                          \-> REJECTED                 \-> FAILED
"""
from __future__ import annotations

import time
import uuid
from typing import Dict, List, Optional

from .constants import APPROVAL_STATES


class ApprovalService:
    def __init__(self, crm, auto_publish: bool = False):
        self.crm = crm
        self.auto_publish = auto_publish

    # ------------------------------------------------------------------
    def create_request(
        self,
        item_type: str,
        item_ref: str,
        summary: str,
        payload: dict,
        requires_human: Optional[bool] = None,
    ) -> dict:
        """Create an approval request. If auto_publish is enabled and the item
        type is auto-approvable, skip human review."""
        req_id = uuid.uuid4().hex[:16]
        state = "APPROVED" if (self.auto_publish and (requires_human in (None, False))) else "DRAFT"
        record = {
            "approval_id": req_id,
            "item_type": item_type,
            "item_ref": item_ref,
            "summary": summary,
            "payload": payload,
            "state": state,
            "requires_human": bool(requires_human) if requires_human is not None else True,
            "created_at": int(time.time()),
            "decided_at": None,
            "decided_by": "auto" if state == "APPROVED" else None,
            "decision": "AUTO_APPROVED" if state == "APPROVED" else "PENDING",
        }
        self.crm.add_row("Approvals", req_id, record)
        return record

    def submit_for_review(self, approval_id: str) -> Optional[dict]:
        return self.crm.patch_row(
            "Approvals", approval_id, {"state": "HUMAN_REVIEW", "decision": "PENDING"}
        )

    def decide(self, approval_id: str, approved: bool, decided_by: str = "human") -> Optional[dict]:
        state = "APPROVED" if approved else "REJECTED"
        return self.crm.patch_row(
            "Approvals",
            approval_id,
            {
                "state": state,
                "decision": "APPROVED" if approved else "REJECTED",
                "decided_at": int(time.time()),
                "decided_by": decided_by,
            },
        )

    def mark_scheduled(self, approval_id: str, schedule_ts: int) -> Optional[dict]:
        return self.crm.patch_row(
            "Approvals",
            approval_id,
            {"state": "SCHEDULED", "scheduled_at": schedule_ts},
        )

    def mark_published(self, approval_id: str, external_ref: str = "") -> Optional[dict]:
        return self.crm.patch_row(
            "Approvals",
            approval_id,
            {"state": "PUBLISHED", "external_ref": external_ref},
        )

    def mark_failed(self, approval_id: str, error: str) -> Optional[dict]:
        return self.crm.patch_row(
            "Approvals",
            approval_id,
            {"state": "FAILED", "error": error},
        )

    def pending(self) -> List[dict]:
        return [
            r
            for r in self.crm.list_rows("Approvals")
            if r.get("state") in ("DRAFT", "AI_REVIEW", "HUMAN_REVIEW", "SCHEDULED")
        ]
