"""ERROR MONITORING AGENT.

On workflow failure:
1. Capture error   2. Identify workflow   3. Probable cause   4. Retry when safe
5. Record retry count   6. Notify administrator if unresolved   7. No infinite loops.

Retry is capped (``max_retries``) and never loops forever.
"""
from __future__ import annotations

import time
from typing import Dict, List, Optional

from ..constants import EVENT_TYPES


class ErrorAgent:
    def __init__(self, crm, observability, max_retries: int = 3):
        self.crm = crm
        self.obs = observability
        self.max_retries = max_retries

    def open_errors(self) -> List[dict]:
        return [e for e in self.crm.list_rows("Errors") if not e.get("resolved")]

    def capture(self, workflow_name: str, message: str, lead_id=None) -> str:
        return self.obs.record_error(workflow_name, message, lead_id=lead_id)

    def classify_cause(self, error: dict) -> str:
        msg = (error.get("error_message") or "").lower()
        if "unreachable" in msg or "connect" in msg or "timeout" in msg:
            return "NETWORK"
        if "credential" in msg or "401" in msg or "token" in msg or "key" in msg:
            return "AUTHENTICATION"
        if "402" in msg or "quota" in msg or "rate" in msg:
            return "RATE_LIMIT_QUOTA"
        if "invalid" in msg or "400" in msg or "422" in msg:
            return "INVALID_DATA"
        return "UNKNOWN"

    def should_retry(self, cause: str) -> bool:
        # Only safe to auto-retry transient causes.
        return cause in ("NETWORK", "RATE_LIMIT_QUOTA")

    def resolve(self, error_id: str) -> None:
        self.obs.resolve_error(error_id)

    def retry_error(self, error_id: str) -> Dict[str, object]:
        error = self.crm.patch_row("Errors", error_id, {})  # ensure exists
        if not error:
            return {"status": "not_found"}
        if error.get("retry_count", 0) >= self.max_retries:
            self.obs.log_event(
                "WF-13 Error Monitoring", "RETRY_EXHAUSTED", "err", "ERROR",
                error_message="max retries reached; admin notified",
            )
            return {"status": "exhausted", "action": "notify_admin"}
        cause = self.classify_cause(error)
        if not self.should_retry(cause):
            return {"status": "no_retry", "cause": cause, "action": "notify_admin"}
        new_count = error.get("retry_count", 0) + 1
        self.crm.patch_row(
            "Errors", error_id, {"retry_count": new_count, "last_retried_at": int(time.time())}
        )
        return {"status": "retried", "retry_count": new_count, "cause": cause}
