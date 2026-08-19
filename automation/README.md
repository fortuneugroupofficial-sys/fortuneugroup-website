# Fortune U Group — Master AI Agent Automation System

A **production-oriented, modular** automation system for [fortuneugroup.in](https://www.fortuneugroup.in).
It implements the **Fortune U Group Master AI Agent** — one central orchestrator that routes
tasks to specialised agents (Leads/CRM, WhatsApp, Content, YouTube, Instagram, Facebook,
Website/SEO, Follow-up, Analytics, Error Monitoring) through n8n and NocoDB, with human
approval where required.

> **Status of external integrations:** the core orchestration engine runs **now** (dependency-free
> Python, fully tested). Live integrations (NocoDB, WhatsApp Cloud API, Meta Graph API, YouTube,
> Gemini) are **BLOCKED until real credentials are provided** — see `docs/CREDENTIALS.md`. Until
> then everything runs in local/dry-run mode so the whole pipeline stays verifiable.

## Architecture

```
Website lead forms
        │  POST (n8n webhook / intake webhook)
        ▼
MASTER AI AGENT (fug/orchestrator.py)          ── n8n WF-14
        │  routes by intent
        ├── Lead/CRM Agent      (capture, validate, dedupe, NocoDB sync)
        ├── WhatsApp Agent      (templates, follow-ups, opt-out, hand-off)
        ├── Content Agent       (topics, hooks, scripts, captions, hashtags, CTAs)
        ├── Social Agent        (YouTube / Instagram / Facebook — approval-gated)
        ├── Website/SEO Agent   (intake + read-only SEO audit)
        ├── Follow-up Agent     (NEW→ack→follow-ups→inactive)
        ├── Analytics Agent     (daily/weekly reports)
        └── Error Monitoring    (capture, classify, bounded retry, notify)
        │
        ▼
NocoDB CRM (production)  /  local JSON store (fallback, dev)
```

## Layout

```
automation/
  fug/               Python package (stdlib only)
    orchestrator.py  Master AI Agent (routing + approval gating)
    agents/          lead, whatsapp, content, social, website, seo, followup, analytics, error
    crm.py           unified CRM facade (NocoDB or JSON store)
    nocodb.py        NocoDB REST client
    approvals.py     human-approval queue
    webhook.py       lead-intake webhook server
    cli.py           command-line interface
    templates.py     WhatsApp template messages
  n8n/               generator for importable n8n workflows (WF-01..15)
  workflows/n8n/     generated n8n workflow JSON
  nocodb/            NocoDB schema (JSON) + reference DDL
  docs/              AUDIT.md, ARCHITECTURE.md, CREDENTIALS.md, RUNBOOK.md, PHASES.md
  tests/             unittest suite (30 tests)
```

## Quick start (no credentials required)

```bash
cd automation

# 1. System status + BLOCKED integrations
python3 -m fug.cli status

# 2. Capture a website lead (dry-run WhatsApp acknowledgement)
python3 -m fug.cli ingest --name "Ravi" --phone 9490237465 --goal "Health insurance" --message "Family cover"

# 3. Daily management report
python3 -m fug.cli report daily

# 4. Process due follow-ups
python3 -m fug.cli followups

# 5. Generate a content package
python3 -m fug.cli content --platform youtube --topic "Term insurance basics"

# 6. Read-only SEO audit of the live site files
python3 -m fug.cli seo

# 7. Serve the intake webhook
python3 -m fug.cli serve --port 8080
```

## Tests

```bash
cd automation
python3 -m unittest discover -s tests -v   # 30 tests, all pass
```

## Configuration & security

All secrets live in environment variables or `automation/.env` (see `.env.example`).
**Never** commit secrets. `fug/secrets.py` redacts known secrets from logs and output.
`FUG_DRY_RUN=true` (default) simulates all outbound sends.

## Approvals & publishing

Publishing is **approval-gated** by default (`AUTO_PUBLISH=false`). Content and social posts
move through `DRAFT → AI_REVIEW → HUMAN_REVIEW → APPROVED → SCHEDULED → PUBLISHED`, and any
content containing financial/insurance claim language is auto-flagged for human review.
