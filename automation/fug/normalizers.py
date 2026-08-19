"""Data normalisation helpers: phone numbers, email and deduplication keys.

Rules:
* Phone numbers are normalised to E.164 ``91XXXXXXXXXX`` (India).
* A stable, low-collision dedup key is produced from phone / email so the
  CRM can detect duplicate enquiries without comparing raw free text.
"""
from __future__ import annotations

import re
from typing import Optional

_DIGITS = re.compile(r"\+?\d[\d\s\-()]*")


def normalize_phone(raw: Optional[str], country: str = "91") -> Optional[str]:
    """Normalise an Indian phone number to E.164 ``<country><10 digits>``.

    Returns ``None`` for clearly invalid input.
    """
    if not raw:
        return None
    digits = re.sub(r"\D", "", raw)
    if not digits:
        return None
    if digits.startswith("00"):
        digits = digits[2:]
    if len(digits) == 10 and digits.startswith(("6", "7", "8", "9")):
        return country + digits
    if len(digits) == 11 and digits.startswith("0"):
        return country + digits[1:]
    if len(digits) == 12 and digits.startswith("91"):
        return digits
    if len(digits) == 13 and digits.startswith("+91"):
        return digits[1:]
    if len(digits) == 13 and digits.startswith("0091"):
        return digits[2:]
    # Anything else is not a confidently valid Indian mobile number.
    return None


def normalize_email(raw: Optional[str]) -> Optional[str]:
    if not raw:
        return None
    value = raw.strip().lower()
    if re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", value):
        return value
    return None


def dedup_key(
    phone: Optional[str] = None, email: Optional[str] = None, name: Optional[str] = None
) -> Optional[str]:
    """Build a stable dedup key preferring phone, then email, then name."""
    phone_n = normalize_phone(phone)
    if phone_n:
        return "phone:" + phone_n
    email_n = normalize_email(email)
    if email_n:
        return "email:" + email_n
    if name:
        return "name:" + re.sub(r"\s+", " ", name.strip().lower())
    return None


def is_valid_name(raw: Optional[str]) -> bool:
    if not raw or not raw.strip():
        return False
    value = raw.strip()
    if len(value) < 2:
        return False
    if re.search(r"[0-9{}[\]|@<>]", value):
        return False
    return True


def guess_service(goal: Optional[str]) -> str:
    """Map a free-text goal to a canonical service label (best effort)."""
    if not goal:
        return "OTHER"
    g = goal.lower()
    if "health" in g:
        return "HEALTH_INSURANCE"
    if "term" in g or "life" in g:
        return "LIFE_INSURANCE"
    if "motor" in g or "car" in g or "vehicle" in g:
        return "MOTOR_INSURANCE"
    if "sip" in g or "mutual" in g or "investment" in g:
        return "SIP_MUTUAL_FUNDS"
    if "general" in g:
        return "GENERAL_INSURANCE"
    return "OTHER"


def sanitize_message(raw: Optional[str], max_len: int = 2000) -> str:
    if not raw:
        return ""
    value = " ".join(raw.split())
    return value[:max_len]
