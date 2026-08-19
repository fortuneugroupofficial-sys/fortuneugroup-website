"""Content pipeline state machine.

IDEA -> AI RESEARCH -> DRAFT -> FACT CHECK -> APPROVAL -> CONTENT GENERATION
     -> PUBLISHING QUEUE -> PUBLISH -> ANALYTICS -> PERFORMANCE ANALYSIS
     -> NEXT CONTENT RECOMMENDATION

This module orchestrates the flow across the Content agent and the approval
service and publishes through the appropriate social adapter.
"""
from __future__ import annotations

import time
import uuid
from typing import Any, Dict, Optional

from .agents.content_agent import ContentAgent
from .approvals import ApprovalService


class ContentPipeline:
    STAGES = (
        "IDEA",
        "RESEARCH",
        "DRAFT",
        "FACT_CHECK",
        "APPROVAL",
        "GENERATION",
        "QUEUE",
        "PUBLISH",
        "ANALYTICS",
        "RECOMMENDATION",
    )

    def __init__(self, crm, content: ContentAgent, approvals: ApprovalService, social_adapter=None):
        self.crm = crm
        self.content = content
        self.approvals = approvals
        self.social_adapter = social_adapter

    def create(self, platform: str, topic: str, execution_id: str = "") -> Dict[str, Any]:
        state = {
            "pipeline_id": uuid.uuid4().hex[:16],
            "platform": platform,
            "topic": topic,
            "stage": "IDEA",
            "timeline": [{"stage": "IDEA", "at": int(time.time())}],
            "status": "IDEA",
        }
        self.crm.add_row("PublishingQueue", state["pipeline_id"], state)
        return state

    def advance(self, pipeline_id: str, stage: str, note: str = "") -> Optional[Dict[str, Any]]:
        state = self.crm.patch_row(
            "PublishingQueue",
            pipeline_id,
            {"stage": stage, "status": stage, "note": note},
        )
        return state

    def run_to_approval(self, platform: str, topic: str, execution_id: str = "") -> Dict[str, Any]:
        """Create a package, push through draft/fact-check to approval."""
        pipeline = self.create(platform, topic, execution_id)
        package = self.content.generate_package(platform, topic, execution_id)
        pid = pipeline["pipeline_id"]
        self.advance(pid, "DRAFT", note="package drafted")
        self.advance(pid, "FACT_CHECK", note="claim-flagged review")
        # Create/reuse approval
        if package.get("needs_human_review"):
            approval = self.approvals.create_request(
                item_type="content",
                item_ref=topic,
                summary=f"Publish {platform} content: {topic}",
                payload=package,
                requires_human=True,
            )
            self.approvals.submit_for_review(approval["approval_id"])
            self.advance(pid, "APPROVAL", note=f"waiting human review {approval['approval_id']}")
        else:
            approval = self.approvals.create_request(
                item_type="content",
                item_ref=topic,
                summary=f"Publish {platform} content: {topic}",
                payload=package,
                requires_human=False,
            )
            self.advance(pid, "APPROVAL", note="auto-approvable")
        return {"pipeline_id": pid, "package": package, "approval": approval}
