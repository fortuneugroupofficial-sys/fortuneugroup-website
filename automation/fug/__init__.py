"""Fortune U Group — Master AI Agent automation system.

A self-contained, dependency-free (Python stdlib) implementation of the
central orchestrator and its specialist agents. Designed to run against
NocoDB in production and a local JSON store in development, and to be driven
through n8n (importable workflows) or directly via the CLI / webhook.
"""
from .config import Settings, get_settings
from .orchestrator import Orchestrator
from .crm import Crm

__all__ = ["Settings", "get_settings", "Orchestrator", "Crm"]
__version__ = "0.1.0"
