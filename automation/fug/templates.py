"""Reusable WhatsApp message templates.

These mirror approved template names in the WhatsApp Business Manager. The
Python strings are the *local* renderings used for preview/approval and for
the JSON-store logs; the actual outbound send uses the template *name* via the
Cloud API (see :mod:`fug.notifiers`).

Every template renders a plain, non-deceptive message. No financial/insurance
claims are invented — anything claim-like is flagged for human review.
"""
from __future__ import annotations

from typing import Callable, Dict, Optional

from . import constants

# template_name -> (function(lead_ctx) -> str)
_TEMPLATES: Dict[str, Callable[[dict], str]] = {}


def _register(name: str):
    def deco(fn):
        _TEMPLATES[name] = fn
        return fn

    return deco


@_register("new_lead_acknowledgement")
def _ack(ctx: dict) -> str:
    return (
        f"Hello {ctx.get('name', 'there')}, thank you for contacting Fortune U Group. "
        f"We received your enquiry about {ctx.get('service', 'our services')}. An advisor "
        "will contact you shortly to help."
    )


@_register("followup_1")
def _f1(ctx: dict) -> str:
    return (
        f"Hi {ctx.get('name', 'there')}, this is a friendly follow-up from Fortune U Group "
        f"about your enquiry on {ctx.get('service', 'our services')}. Would you like more "
        "details or a call-back?"
    )


@_register("followup_2")
def _f2(ctx: dict) -> str:
    return (
        f"Hi {ctx.get('name', 'there')}, checking in again about your enquiry with "
        "Fortune U Group. If you are still interested, reply YES and an advisor will call."
    )


@_register("final_followup")
def _f3(ctx: dict) -> str:
    return (
        f"Hi {ctx.get('name', 'there')}, this is our final note about your Fortune U Group "
        "enquiry. If you are no longer interested, no action is needed. Otherwise reply YES. "
        "Text STOP to opt out of messages."
    )


@_register("appointment_reminder")
def _appt(ctx: dict) -> str:
    return (
        f"Reminder: your discussion with Fortune U Group is scheduled. "
        "Reply CONFIRM to keep it, or RESCHEDULE to pick another time."
    )


@_register("document_reminder")
def _doc(ctx: dict) -> str:
    return (
        f"Hi {ctx.get('name', 'there')}, to move forward we still need the documents we "
        "discussed (ID and income proof). Share them here or call us when ready."
    )


@_register("thank_you")
def _thanks(ctx: dict) -> str:
    return "Thank you for speaking with Fortune U Group. Do not hesitate to reach out anytime."


@_register("human_handover")
def _handover(ctx: dict) -> str:
    return "A senior advisor from Fortune U Group will contact you shortly to assist further."


def render(template_name: str, ctx: dict) -> Optional[str]:
    fn = _TEMPLATES.get(template_name)
    return fn(ctx) if fn else None


def all_template_names() -> list:
    return list(_TEMPLATES.keys())


def resolve_sequence(index: int) -> Optional[str]:
    """Return the template for the (1-based) follow-up step, or None beyond end."""
    names = ["followup_1", "followup_2", "final_followup"]
    if index < 1 or index > len(names):
        return None
    return names[index - 1]
