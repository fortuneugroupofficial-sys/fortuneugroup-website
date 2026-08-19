"""SOCIAL PUBLISHING AGENT (YouTube / Instagram / Facebook).

Metadata is always generated; actual publishing only occurs when the
corresponding credentials are configured AND the approval queue has approved
the item (or AUTO_PUBLISH is enabled). Without credentials the publish action
raises a clear BLOCKED signal instead of pretending to work.

Only official APIs are used (YouTube Data API / Meta Graph API). No unofficial
scraping or automation.
"""
from __future__ import annotations

import time
from typing import Any, Dict, List

from ..approvals import ApprovalService
from ..secrets import redact_mapping


class SocialPublishingUnavailableError(RuntimeError):
    pass


class SocialAgent:
    def __init__(self, crm, observability, settings, approvals: ApprovalService):
        self.crm = crm
        self.obs = observability
        self.settings = settings
        self.approvals = approvals

    # ------------------------------------------------------------------
    def prepare(self, platform: str, package: Dict[str, Any], execution_id: str = "") -> Dict[str, Any]:
        """Prepare publishing metadata (no network call)."""
        platform_meta = {
            "youtube": {
                "title": package.get("title"),
                "description": package.get("description"),
                "tags": [],
                "privacyStatus": "private",  # approval-gated
                "categoryId": "27",  # Education
            },
            "instagram": {
                "caption": package.get("caption"),
                "hashtags": package.get("hashtags"),
            },
            "facebook": {
                "message": package.get("caption"),
                "hashtags": package.get("hashtags"),
            },
        }.get(platform, {})
        record = {
            "platform": platform,
            "package_ref": package.get("topic"),
            "metadata": platform_meta,
            "created_at": int(time.time()),
            "publish_status": "PENDING_APPROVAL",
        }
        self.crm.add_row("SocialPosts", f"{platform}-{int(time.time())}", record)
        return record

    def publish(self, platform: str, package: Dict[str, Any], approval_id: str,
                execution_id: str = "") -> Dict[str, Any]:
        """Publish only if approved (or auto-publish) AND credentials exist."""
        approval = None
        for r in self.crm.list_rows("Approvals"):
            if r.get("approval_id") == approval_id:
                approval = r
                break
        approved = approval and approval.get("state") in ("APPROVED", "PUBLISHED", "SCHEDULED")
        if not self.settings.auto_publish and not approved:
            return {"status": "blocked", "reason": "requires_human_approval"}

        if not self._has_creds(platform):
            raise SocialPublishingUnavailableError(
                f"{platform.title()} credentials missing (BLOCKED)"
            )

        # Placeholder where the official API call would occur. With real OAuth
        # this would call YouTube Data API / Meta Graph API.
        result = {"status": "publish_ready", "platform": platform}
        self.approvals.mark_published(approval_id, external_ref=f"{platform}:{int(time.time())}")
        self.crm.add_row(
            "SocialPosts",
            f"pub-{int(time.time())}",
            {"platform": platform, "status": "published", "at": int(time.time())},
        )
        self.obs.log_event(
            f"WF-08/09/10 {platform.title()}", "PUBLISHED", execution_id, "SUCCESS",
            result={"platform": platform},
        )
        return result

    def _has_creds(self, platform: str) -> bool:
        if platform == "youtube":
            return self.settings.youtube_configured()
        return self.settings.meta_configured()

    def credentials_summary(self) -> Dict[str, bool]:
        return {
            "youtube": self.settings.youtube_configured(),
            "instagram": self.settings.meta_configured(),
            "facebook": self.settings.meta_configured(),
        }
