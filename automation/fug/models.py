"""Data models for the Fortune U Group automation system.

The Lead model mirrors the NocoDB ``Leads`` table so records can round-trip
between the built-in JSON store and NocoDB without data loss.
"""
from __future__ import annotations

import time
import uuid
from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Optional

from . import normalizers
from .constants import DEFAULT_LEAD_STATUS, DEFAULT_PRIORITY, LEAD_STATUS, PRIORITY

_LEAD_FIELDS = (
    "lead_id",
    "name",
    "phone",
    "email",
    "city",
    "source",
    "service",
    "message",
    "status",
    "priority",
    "assigned_to",
    "created_at",
    "updated_at",
    "last_contacted_at",
    "next_followup_at",
    "notes",
    "whatsapp_status",
    "conversion_status",
    "followup_count",
    "opted_out",
    "dedup_key",
    "human_handoff",
)


def _now() -> int:
    return int(time.time())


@dataclass
class Lead:
    lead_id: str = field(default_factory=lambda: uuid.uuid4().hex[:16])
    name: str = ""
    phone: Optional[str] = None
    email: Optional[str] = None
    city: str = ""
    source: str = "WEBSITE_CONTACT"
    service: str = "OTHER"
    message: str = ""
    status: str = DEFAULT_LEAD_STATUS
    priority: str = DEFAULT_PRIORITY
    assigned_to: str = ""
    created_at: int = field(default_factory=_now)
    updated_at: int = field(default_factory=_now)
    last_contacted_at: Optional[int] = None
    next_followup_at: Optional[int] = None
    notes: List[str] = field(default_factory=list)
    whatsapp_status: str = "NONE"
    conversion_status: str = ""
    followup_count: int = 0
    opted_out: bool = False
    dedup_key: Optional[str] = None
    human_handoff: Optional[str] = None

    # --- lifecycle ---------------------------------------------------------
    def touch(self) -> None:
        self.updated_at = int(time.time())

    def add_note(self, note: str) -> None:
        self.notes.append(note)
        self.touch()

    def is_valid_phone(self) -> bool:
        return bool(normalizers.normalize_phone(self.phone))

    def validate(self) -> List[str]:
        """Return a list of validation problems (empty means valid)."""
        problems = []
        if not normalizers.is_valid_name(self.name):
            problems.append("invalid_name")
        if not self.is_valid_phone():
            problems.append("invalid_phone")
        if self.email and not normalizers.normalize_email(self.email):
            problems.append("invalid_email")
        if self.status not in LEAD_STATUS:
            problems.append(f"unknown_status:{self.status}")
        if self.priority not in PRIORITY:
            problems.append(f"unknown_priority:{self.priority}")
        return problems

    # --- serialisation -----------------------------------------------------
    def to_dict(self) -> Dict[str, Any]:
        data = asdict(self)
        return data

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Lead":
        data = dict(data or {})
        notes = data.get("notes") or []
        if isinstance(notes, str):
            notes = [notes]
        allowed = set(_LEAD_FIELDS)
        cleaned = {k: v for k, v in data.items() if k in allowed}
        cleaned["notes"] = list(notes)
        lead = cls(**cleaned)
        # Recompute dedup key only if not supplied.
        if not lead.dedup_key:
            lead.dedup_key = normalizers.dedup_key(lead.phone, lead.email, lead.name)
        return lead

    @staticmethod
    def field_names() -> tuple:
        return _LEAD_FIELDS
