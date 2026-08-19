"""Observability: structured automation logging + error capture.

Every event is written to the ``AutomationLogs`` table with the fields the
spec requires (workflow_name, execution_id, timestamp, event_type, lead_id,
status, error_message, retry_count, duration, result). Errors are written to
``Errors`` and surface through the Error Monitoring agent.
"""
from __future__ import annotations

import time
import traceback
import uuid
from typing import Optional

from .secrets import redact


def new_execution_id() -> str:
    return uuid.uuid4().hex[:16]


class Observability:
    def __init__(self, crm):
        self.crm = crm

    def log_event(
        self,
        workflow_name: str,
        event_type: str,
        execution_id: str,
        status: str,
        lead_id: Optional[str] = None,
        error_message: Optional[str] = None,
        retry_count: int = 0,
        result: Optional[dict] = None,
        extra: Optional[dict] = None,
    ) -> str:
        log_id = uuid.uuid4().hex[:16]
        doc = {
            "log_id": log_id,
            "workflow_name": workflow_name,
            "execution_id": execution_id,
            "timestamp": int(time.time()),
            "event_type": event_type,
            "lead_id": lead_id,
            "status": status,
            "error_message": redact(error_message) if error_message else None,
            "retry_count": retry_count,
            "result": redact(str(result)) if result else None,
            "extra": redact(str(extra)) if extra else None,
        }
        self.crm.log_automation(log_id, doc)
        return log_id

    def record_error(
        self,
        workflow_name: str,
        error_message: str,
        lead_id: Optional[str] = None,
        retry_count: int = 0,
        trace: Optional[str] = None,
    ) -> str:
        error_id = uuid.uuid4().hex[:16]
        self.crm.log_error(
            error_id,
            {
                "error_id": error_id,
                "workflow_name": workflow_name,
                "lead_id": lead_id,
                "timestamp": int(time.time()),
                "error_message": redact(error_message),
                "trace": redact(trace or ""),
                "retry_count": retry_count,
                "resolved": False,
                "resolved_at": None,
            },
        )
        return error_id

    def resolve_error(self, error_id: str) -> None:
        self.crm.patch_row("Errors", error_id, {"resolved": True, "resolved_at": int(time.time())})


# Simple decorator to time and log a workflow step.
def timed(observability: Observability, workflow_name: str):
    def deco(fn):
        def wrapper(*args, **kwargs):
            execution_id = new_execution_id()
            start = time.time()
            try:
                result = fn(*args, **kwargs)
                observability.log_event(
                    workflow_name,
                    "STEP_OK",
                    execution_id,
                    "SUCCESS",
                    result=result,
                    duration=round(time.time() - start, 3),
                )
                return result
            except Exception as e:
                observability.record_error(workflow_name, str(e), trace=traceback.format_exc())
                observability.log_event(
                    workflow_name,
                    "STEP_ERROR",
                    execution_id,
                    "ERROR",
                    error_message=str(e),
                    duration=round(time.time() - start, 3),
                )
                raise

        return wrapper

    return deco
