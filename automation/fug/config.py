"""Environment-based configuration for the Fortune U Group automation system.

ALL secrets must be supplied through environment variables (or an ``.env``
file). This module never hard-codes a secret. Missing integrations are
represented by ``None`` and are reported as BLOCKED by the orchestrator
instead of silently failing.
"""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

# --------------------------------------------------------------------------
# Minimal .env parser (no third-party dependency). Skips commented/blank
# lines and lines without ``=``. Never echoes values.
# --------------------------------------------------------------------------
def load_dotenv(path: Optional[os.PathLike] = None) -> dict:
    env_file = Path(path) if path is not None else Path(__file__).resolve().parents[2] / ".env"
    loaded: dict = {}
    if not env_file.exists():
        return loaded
    for raw in env_file.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip("'\"")
        if key:
            loaded[key] = value
            os.environ.setdefault(key, value)
    return loaded


def _env(key: str, default: Optional[str] = None) -> Optional[str]:
    return os.environ.get(key, default)


def _env_bool(key: str, default: bool = False) -> bool:
    raw = os.environ.get(key)
    if raw is None:
        return default
    return raw.strip().lower() in ("1", "true", "yes", "on")


def _env_int(key: str, default: int) -> int:
    raw = os.environ.get(key)
    if raw is None or not raw.strip().isdigit():
        return default
    return int(raw.strip())


@dataclass
class Settings:
    """Central configuration object. Reads everything from the environment."""

    # --- Behaviour flags -------------------------------------------------
    auto_publish: bool = field(default_factory=lambda: _env_bool("AUTO_PUBLISH", False))
    debug: bool = field(default_factory=lambda: _env_bool("FUG_DEBUG", False))
    dry_run: bool = field(default_factory=lambda: _env_bool("FUG_DRY_RUN", True))
    max_followups: int = field(default_factory=lambda: _env_int("MAX_FOLLOWUPS", 3))
    inactivity_days: int = field(default_factory=lambda: _env_int("INACTIVITY_DAYS", 14))

    # --- Storage ----------------------------------------------------------
    # Data directory for the built-in JSON store (fallback when NocoDB is
    # not configured). Never a secret.
    data_dir: str = field(
        default_factory=lambda: _env("FUG_DATA_DIR", str(Path(__file__).resolve().parents[1] / "data"))
    )

    # --- NocoDB ------------------------------------------------------------
    nocodb_url: Optional[str] = field(default_factory=lambda: _env("NOCODB_URL"))
    nocodb_api_token: Optional[str] = field(default_factory=lambda: _env("NOCODB_API_TOKEN"))
    nocodb_db_name: Optional[str] = field(default_factory=lambda: _env("NOCODB_DB_NAME", "fug_crm"))

    # --- WhatsApp Cloud API -----------------------------------------------
    whatsapp_token: Optional[str] = field(default_factory=lambda: _env("WHATSAPP_ACCESS_TOKEN"))
    whatsapp_phone_id: Optional[str] = field(default_factory=lambda: _env("WHATSAPP_PHONE_NUMBER_ID"))
    whatsapp_verify_token: Optional[str] = field(default_factory=lambda: _env("WHATSAPP_VERIFY_TOKEN"))
    whatsapp_business_number: Optional[str] = field(
        default_factory=lambda: _env("WHATSAPP_BUSINESS_NUMBER", "")
    )

    # --- Meta Graph API (Instagram / Facebook) ----------------------------
    meta_access_token: Optional[str] = field(default_factory=lambda: _env("META_ACCESS_TOKEN"))
    fb_page_id: Optional[str] = field(default_factory=lambda: _env("FB_PAGE_ID"))
    ig_user_id: Optional[str] = field(default_factory=lambda: _env("IG_USER_ID"))

    # --- YouTube ------------------------------------------------------------
    youtube_client_id: Optional[str] = field(default_factory=lambda: _env("YOUTUBE_CLIENT_ID"))
    youtube_client_secret: Optional[str] = field(default_factory=lambda: _env("YOUTUBE_CLIENT_SECRET"))
    youtube_refresh_token: Optional[str] = field(default_factory=lambda: _env("YOUTUBE_REFRESH_TOKEN"))
    youtube_api_key: Optional[str] = field(default_factory=lambda: _env("YOUTUBE_API_KEY"))

    # --- LLM (Gemini) -------------------------------------------------------
    gemini_api_key: Optional[str] = field(default_factory=lambda: _env("GEMINI_API_KEY"))
    gemini_model: str = field(default_factory=lambda: _env("GEMINI_MODEL", "gemini-2.0-flash"))

    # --- Website lead intake -----------------------------------------------
    intake_secret: Optional[str] = field(default_factory=lambda: _env("INTAKE_SECRET"))
    intake_port: int = field(default_factory=lambda: _env_int("FUG_INTAKE_PORT", 8080))

    # Root of the static website for the SEO agent's read-only audit.
    seo_site_root: str = field(
        default_factory=lambda: _env(
            "FUG_SITE_ROOT", str(Path(__file__).resolve().parents[2])
        )
    )

    # ----------------------------------------------------------------------
    def nocodb_configured(self) -> bool:
        return bool(self.nocodb_url and self.nocodb_api_token)

    def whatsapp_configured(self) -> bool:
        return bool(self.whatsapp_token and self.whatsapp_phone_id)

    def meta_configured(self) -> bool:
        return bool(self.meta_access_token)

    def youtube_configured(self) -> bool:
        return bool(
            self.youtube_client_id
            and self.youtube_client_secret
            and self.youtube_refresh_token
        )

    def llm_configured(self) -> bool:
        return bool(self.gemini_api_key)

    def blockers(self) -> list:
        """Return a list of (integration, reason) pairs that cannot run."""
        blockers = []
        if not self.nocodb_configured():
            blockers.append(("NocoDB", "NOCODB_URL / NOCODB_API_TOKEN missing — using local JSON store"))
        if not self.whatsapp_configured():
            blockers.append(("WhatsApp", "WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID missing"))
        if not self.meta_configured():
            blockers.append(("Meta (IG/FB)", "META_ACCESS_TOKEN missing"))
        if not self.youtube_configured():
            blockers.append(("YouTube", "YouTube OAuth credentials missing"))
        if not self.llm_configured():
            blockers.append(("LLM", "GEMINI_API_KEY missing — deterministic templates used"))
        return blockers


def get_settings() -> Settings:
    load_dotenv()
    return Settings()
