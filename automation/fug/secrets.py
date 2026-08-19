"""Secret handling utilities.

Guarantees:
* Never print, log or expose credential values.
* Provides a redaction helper for any string (used before logging payloads).
* Lists which env vars are set WITHOUT revealing their values.
"""
from __future__ import annotations

import re
from typing import Dict, List, Optional

# Env var names that hold secrets. If any of these appear inside a string we
# redact them before writing to logs / output.
_SECRET_KEYS = (
    "API_KEY",
    "ACCESS_TOKEN",
    "TOKEN",
    "SECRET",
    "PASSWORD",
    "PASS",
    "CREDENTIAL",
    "PRIVATE_KEY",
    "REFRESH_TOKEN",
    "CLIENT_SECRET",
    "VERIFY_TOKEN",
)

_REDACT = "***REDACTED***"

# Registry of known secrets discovered in the environment (names only).
_known_secret_values: set = set()


def register_secret_value(value: Optional[str]) -> None:
    """Register a raw secret value so it can be redacted from free text."""
    if value and len(value) >= 6:
        _known_secret_values.add(value)


def discover_secrets(env=None) -> None:
    """Scan the environment and register any value whose key looks secret."""
    env = env if env is not None else __import__("os").environ
    for key, value in env.items():
        upper = key.upper()
        if any(tok in upper for tok in _SECRET_KEYS) and value:
            register_secret_value(value)


def redact(text: str) -> str:
    """Replace any known secret values (and common patterns) in ``text``."""
    if not text:
        return text
    for value in list(_known_secret_values):
        if value:
            text = text.replace(value, _REDACT)
    # Generic fallback: Bearer / Basic header values.
    text = re.sub(r"Bearer\s+\S+", "Bearer " + _REDACT, text, flags=re.I)
    text = re.sub(r"Basic\s+\S+", "Basic " + _REDACT, text, flags=re.I)
    # Avoid leaking Google OAuth tokens in query strings.
    text = re.sub(r"([?&]key=)[^&\s]+", r"\1" + _REDACT, text)
    return text


def redact_mapping(data: dict, keys_to_redact: Optional[List[str]] = None) -> dict:
    """Return a copy of ``data`` with sensitive fields redacted."""
    keys_to_redact = keys_to_redact or [
        "token",
        "access_token",
        "api_key",
        "password",
        "secret",
        "refresh_token",
        "client_secret",
        "verify_token",
    ]
    out: dict = {}
    for k, v in data.items():
        if k in keys_to_redact:
            out[k] = _REDACT
        elif isinstance(v, dict):
            out[k] = redact_mapping(v, keys_to_redact)
        elif isinstance(v, str):
            out[k] = redact(v)
        else:
            out[k] = v
    return out


def env_status(env=None) -> Dict[str, bool]:
    """Report which secret env vars are present (bool), not their values."""
    env = env if env is not None else __import__("os").environ
    keys = (
        "NOCODB_URL",
        "NOCODB_API_TOKEN",
        "WHATSAPP_ACCESS_TOKEN",
        "WHATSAPP_PHONE_NUMBER_ID",
        "WHATSAPP_VERIFY_TOKEN",
        "META_ACCESS_TOKEN",
        "FB_PAGE_ID",
        "IG_USER_ID",
        "YOUTUBE_CLIENT_ID",
        "YOUTUBE_CLIENT_SECRET",
        "YOUTUBE_REFRESH_TOKEN",
        "GEMINI_API_KEY",
        "INTAKE_SECRET",
    )
    return {k: bool(env.get(k)) for k in keys}


discover_secrets()
