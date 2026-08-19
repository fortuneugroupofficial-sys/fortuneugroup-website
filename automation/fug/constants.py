"""Shared constants, enums and canonical values for the Fortune U Group
Master AI Agent system.

Nothing in this module is secret. All credentials live in environment
variables and are loaded by :mod:`fug.config`.
"""

# --------------------------------------------------------------------------
# Lead lifecycle statuses
# --------------------------------------------------------------------------
LEAD_STATUS = (
    "NEW",
    "CONTACTED",
    "INTERESTED",
    "FOLLOW_UP",
    "QUALIFIED",
    "CONVERTED",
    "NOT_INTERESTED",
    "LOST",
)

# Default status assigned to a freshly captured lead.
DEFAULT_LEAD_STATUS = "NEW"

# Lead sources captured by the website / intake webhook.
LEAD_SOURCES = (
    "WEBSITE_CONTACT",
    "WEBSITE_HEALTH",
    "WHATSAPP",
    "INSTAGRAM",
    "FACEBOOK",
    "YOUTUBE",
    "REFERRAL",
    "MANUAL",
    "OTHER",
)

# Priority levels.
PRIORITY = ("LOW", "MEDIUM", "HIGH", "URGENT")
DEFAULT_PRIORITY = "MEDIUM"

# --------------------------------------------------------------------------
# Human hand-off / interaction outcomes
# --------------------------------------------------------------------------
HUMAN_HANDOFF_STATUS = "HUMAN_HANDOFF"
HUMAN_HANDOFF_REASONS = (
    "COMPLAINT",
    "SENSITIVE_CUSTOMER_ISSUE",
    "LEGAL_REGULATORY",
    "COMPLEX_INSURANCE",
    "PAYMENT_ISSUE",
    "ANGRY_CUSTOMER",
    "REQUESTED_HUMAN",
    "LOW_CONFIDENCE",
)

# --------------------------------------------------------------------------
# Approval workflow states (content / publishing)
# --------------------------------------------------------------------------
APPROVAL_STATES = (
    "DRAFT",
    "AI_REVIEW",
    "HUMAN_REVIEW",
    "APPROVED",
    "REJECTED",
    "SCHEDULED",
    "PUBLISHED",
    "FAILED",
)

# Publishing is approval-gated by default.
AUTO_PUBLISH_DEFAULT = False

# --------------------------------------------------------------------------
# Agent routing
# --------------------------------------------------------------------------
AGENT_NAMES = (
    "lead",
    "whatsapp",
    "content",
    "youtube",
    "instagram",
    "facebook",
    "website",
    "seo",
    "followup",
    "analytics",
    "error",
)

# Event types the Master Agent understands.
EVENT_TYPES = (
    "LEAD_CAPTURED",
    "LEAD_VALIDATED",
    "INBOUND_MESSAGE",
    "FOLLOWUP_DUE",
    "APPROVAL_REQUESTED",
    "APPROVAL_DECIDED",
    "CONTENT_REQUEST",
    "PUBLISH_REQUEST",
    "REPORT_REQUEST",
    "WORKFLOW_FAILURE",
    "SCHEDULED_TASK",
)

# --------------------------------------------------------------------------
# Opt-out handling
# --------------------------------------------------------------------------
OPT_OUT_KEYWORDS = ("stop", "unsubscribe", "opt out", "opt-out", "block", "do not message")
# After N follow-ups with no response the lead is marked inactive.
MAX_FOLLOWUPS = 3
INACTIVE_AFTER_DAYS = 14

# --------------------------------------------------------------------------
# Business identity (non-secret, from the public website config)
# --------------------------------------------------------------------------
BRAND = "Fortune U Group"
BUSINESS_PHONE = "9490237465"
BUSINESS_EMAIL = "fortuneugroupofficial@gmail.com"
BUSINESS_CITY = "Tirupati, Andhra Pradesh, India"
IRDAI_LICENCE = "LIC0159665T"
