"""LLM client for the Master AI Agent.

Uses the Gemini REST API when ``GEMINI_API_KEY`` is configured. When no key
is present the agent runs in **deterministic mode**: prompts are answered by
template/rule logic so the whole system remains functional and testable
without an LLM (that integration is reported BLOCKED).

The API key is read from the environment and only sent as a query param /
header by urllib — it is never logged. If a value looks like a key it is
redacted by :func:`fug.secrets.redact` before any output.
"""
from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional

from .secrets import redact, register_secret_value


class LLMClient:
    def __init__(self, api_key: Optional[str] = None, model: str = "gemini-2.0-flash"):
        self.api_key = api_key
        self.model = model
        if api_key:
            register_secret_value(api_key)

    @property
    def available(self) -> bool:
        return bool(self.api_key)

    def generate(self, prompt: str, system: Optional[str] = None, temperature: float = 0.4) -> str:
        """Return model text. Raises LLMUnavailableError if no key."""
        if not self.available:
            raise LLMUnavailableError("GEMINI_API_KEY not set (BLOCKED)")
        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            + urllib.parse.quote(self.model)
            + ":generateContent"
        )
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": temperature},
        }
        if system:
            payload["systemInstruction"] = {"parts": [{"text": system}]}
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": self.api_key,
        }
        body = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=body, method="POST", headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            detail = e.read().decode("utf-8", errors="replace")[:300]
            raise LLMError(f"Gemini HTTP {e.code}: {detail}") from e
        except urllib.error.URLError as e:
            raise LLMError(f"Gemini unreachable: {e.reason}") from e
        try:
            return data["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError, TypeError) as e:
            raise LLMError("Unexpected Gemini response shape") from e


class LLMUnavailableError(RuntimeError):
    pass


class LLMError(RuntimeError):
    pass


# Deterministic fallback generation used when no API key is configured.
def deterministic_reply(kind: str, **ctx: Any) -> str:
    """Rule-based generation so tests and demos work without an LLM."""
    if kind == "content_topic":
        return "Health insurance basics: what family size affects your premium"
    if kind == "lead_ack":
        return (
            f"Thank you {ctx.get('name', '')}. We have received your enquiry about "
            f"{ctx.get('service', 'our services')}. A Fortune U Group advisor will "
            "contact you shortly."
        )
    if kind == "handoff":
        return "Routing to a human advisor now."
    return "OK"
