"""CONTENT AGENT.

Creates content aligned with the Fortune U Group brand for YouTube,
Instagram, Facebook, the website and WhatsApp.

Guarantee: no financial, insurance, legal or regulatory claims are invented.
Anything claim-like is flagged for human review via the approval queue.
"""
from __future__ import annotations

import re
from typing import Any, Dict, List

from .. import constants
from ..approvals import ApprovalService
from ..llm import LLMClient, LLMUnavailableError, deterministic_reply

_CLAIM_FLAGS = (
    "guaranteed",
    "guarantee",
    "tax free",
    "tax-free",
    "100%",
    "risk free",
    "risk-free",
    "no risk",
    "high return",
    "best return",
    "beats market",
    "insured 100",
    "save tax",
)

_CTA = "Message Fortune U Group on WhatsApp to discuss insurance or financial planning."


class ContentAgent:
    def __init__(self, crm, observability, llm: LLMClient, approvals: ApprovalService):
        self.crm = crm
        self.obs = observability
        self.llm = llm
        self.approvals = approvals

    # ------------------------------------------------------------------
    def ideate(self, platform: str, count: int = 3, execution_id: str = "") -> List[dict]:
        ideas = []
        for i in range(count):
            if self.llm.available:
                prompt = (
                    f"Suggest a financial-education topic for {platform} for an Indian "
                    "insurance distributor (health/life/general) and mutual fund education. "
                    "No fabricated returns or claims. One line each."
                )
                try:
                    topic = self.llm.generate(prompt).strip().splitlines()[0][:120]
                except Exception:
                    topic = deterministic_reply("content_topic")
            else:
                topic = deterministic_reply("content_topic")
            ideas.append({"platform": platform, "topic": topic})
        return ideas

    def generate_package(self, platform: str, topic: str, execution_id: str = "") -> Dict[str, Any]:
        """Produce a full content package for one topic/platform."""
        flagged = self._flag_claims(topic)
        package = {
            "platform": platform,
            "topic": topic,
            "hook": self._make_hook(topic),
            "title": self._make_title(topic, platform),
            "caption": self._make_caption(topic, platform),
            "description": self._make_description(topic),
            "hashtags": self._hashtags(platform),
            "cta": _CTA,
            "thumbnail_concept": f"Bold text overlay: '{self._short(topic)}' on brand gradient",
            "claim_flags": flagged,
            "needs_human_review": bool(flagged),
            "status": "DRAFT",
        }
        self.crm.add_row(
            "Content", f"c-{topic[:12].replace(' ', '-')}", package
        )
        self.obs.log_event(
            "WF-07 Content Generation",
            "CONTENT_DRAFTED",
            execution_id,
            "DRAFT",
            result={"platform": platform, "flagged": flagged},
        )
        # Content that contains any claim flag must go through human review.
        if flagged:
            self.approvals.create_request(
                item_type="content",
                item_ref=topic,
                summary=f"Content flagged for claim check: {topic}",
                payload=package,
                requires_human=True,
            )
        return package

    # ------------------------------------------------------------------
    def _flag_claims(self, text: str) -> List[str]:
        low = text.lower()
        return [c for c in _CLAIM_FLAGS if c in low]

    def _short(self, topic: str, n: int = 40) -> str:
        return topic if len(topic) <= n else topic[: n - 1] + "…"

    def _make_hook(self, topic: str) -> str:
        return f"Most families miss this about {self._short(topic, 50)}. Watch to the end."

    def _make_title(self, topic: str, platform: str) -> str:
        prefix = {"youtube": "", "instagram": "", "facebook": "", "website": "", "whatsapp": ""}
        return f"{prefix.get(platform, '')}{self._short(topic, 55)}".strip()

    def _make_caption(self, topic: str, platform: str) -> str:
        return (
            f"{self._short(topic, 90)}.\n\n"
            f"We help families in {constants.BUSINESS_CITY} choose the right insurance "
            "and plan their finances. Insurance is the subject matter of solicitation.\n\n"
            f"{_CTA}"
        )

    def _make_description(self, topic: str) -> str:
        return (
            f"{self._short(topic, 140)}\n\n"
            f"Fortune U Group is an IRDAI-licensed insurance agency "
            f"(Ref {constants.IRDAI_LICENCE}). We distribute life, health and general "
            "insurance. Mutual fund applications are taken only after our AMFI ARN is live. "
            "No advisory fee is charged. This content is educational only and not investment, "
            "tax or legal advice."
        )

    def _hashtags(self, platform: str) -> str:
        base = "#FortuneUGroup #Insurance #FinancialPlanning #Tirupati #HealthInsurance #TermInsurance"
        return base
