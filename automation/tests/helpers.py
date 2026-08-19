"""Shared test helpers."""
import tempfile
from pathlib import Path

from fug.config import Settings

REPO_ROOT = Path(__file__).resolve().parents[2]  # /home/user/fortuneugroup-website


def make_settings():
    tmp = tempfile.mkdtemp(prefix="fug-test-")
    return Settings(
        data_dir=tmp,
        dry_run=True,
        auto_publish=False,
        seo_site_root=str(REPO_ROOT),
    )
