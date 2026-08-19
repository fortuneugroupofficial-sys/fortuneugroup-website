# Fortune U Group — Master Agent Architecture

## 1. Overview

One **Master Agent** coordinates eleven specialized **sub-agents**, orchestrated primarily through **n8n** (execution engine) with **NocoDB** as the central lead/CRM database. All integration points (YouTube, Instagram, Facebook, WhatsApp, Website, Google Services) are reached through their authorized APIs behind a single, secret-safe configuration.

```
                        ┌─────────────────────────┐
                        │      MASTER AGENT       │
                        │  plan · delegate · audit│
                        └───────────┬─────────────┘
                                    │
        ┌───────────────┬───────────┴────────────┬────────────────┐
        ▼               ▼                        ▼                ▼
  ┌──────────┐   ┌──────────────┐        ┌──────────────┐  ┌──────────────┐
  │ CONTENT  │   │  TECHNICAL/  │        │  ANALYTICS   │  │     SEO      │
  │  AGENT   │   │ CODING AGENT │        │    AGENT     │  │    AGENT     │
  └────┬─────┘   └──────────────┘        └──────────────┘  └──────────────┘
       │  (content plan → distribution agents)
       ▼
  ┌──────────┐ ┌───────────┐ ┌────────────┐
  │ YOUTUBE  │ │ INSTAGRAM │ │  FACEBOOK  │
  │  AGENT   │ │   AGENT   │ │   AGENT    │
  └────┬─────┘ └─────┬─────┘ └─────┬──────┘
       └──────────────┴────────────┘
                     │
        ┌────────────┴─────────────┐
        ▼                          ▼
  ┌──────────┐             ┌──────────────┐
  │  LEAD    │────────────▶│  CRM AGENT   │
  │  AGENT   │             │  (NocoDB)    │
  └────┬─────┘             └──────┬───────┘
       │                          │
       ▼                          ▼
  ┌──────────────┐         ┌──────────────┐
  │  WHATSAPP    │         │  WEBSITE     │
  │   AGENT      │         │   AGENT      │
  └──────────────┘         └──────────────┘

        ──── n8n AUTOMATION ENGINE (shared bus) ────
        ──── NocoDB (single source of truth) ──────
```

## 2. The Agents

| # | Agent | Responsibility | Primary tools/workflows |
|---|-------|----------------|-------------------------|
| 1 | **Master** | Plan, decompose, delegate, approve, monitor, avoid duplicates | n8n orchestration, this docs/ + config/ |
| 2 | **Content** | Topics, research, scripts, captions, titles, descriptions, hashtags, calendars; EN/TE localization | Content workflow + Gemini/LLM |
| 3 | **YouTube** | Shorts/content metadata, upload/publish, status tracking | YouTube Data API, Content workflow |
| 4 | **Instagram** | Reels/posts, captions/hashtags, publish, results | Meta Graph API, Content workflow |
| 5 | **Facebook** | Posts/Reels, Page management, status | Meta Graph API, Content workflow |
| 6 | **Website** | Monitor forms/leads, update approved content, SEO content, link/basic SEO checks | Website webhooks, GitHub |
| 7 | **Lead** | Capture, validate, normalize, dedupe, status, priority, route follow-ups | Lead Ingest workflow |
| 8 | **WhatsApp** | Template-compliant messages, follow-ups, opt-outs | WhatsApp Cloud API |
| 9 | **CRM** | NocoDB as central DB; create/update/search; source/status/follow-up/assigned/notes/outcome | NocoDB API |
| 10 | **SEO** | Site SEO analysis, keywords, meta, blog plans, internal linking, technical issues | Website + search tools |
| 11 | **Analytics** | Metrics, daily/weekly reports, performance & failure analysis, recommendations | GA4 + logs |
| 12 | **Technical/Coding** | Inspect codebase, build/modify/test, Git/GitHub, backups | GitHub, terminal |

## 3. Design Principles

1. **Single source of truth** — NocoDB `Leads` table; every lead-capture surface writes here.
2. **Idempotent & restart-safe** — every workflow has a dedupe key and can re-run safely.
3. **Approval gates** — publishing, mass messaging, purchases, deletions, and infra changes pause for human approval by default (see `config/fortuneugroup.config.json → approval_rules`).
4. **Secret-safe** — credentials live in n8n's credential store / env vars; never in code or logs.
5. **Modular** — each agent maps to replaceable n8n workflows; no agent's failure blocks the others.
6. **Observable** — every important run logs to a `WorkflowRuns` table + n8n execution history.

## 4. Data Model (NocoDB)

Full schema documented in [`nocodb-schema.md`](./nocodb-schema.md). Core tables:

- **Leads** — the central CRM table.
- **ContentPosts** — content calendar + publishing status.
- **Conversations** — WhatsApp/chat thread state.
- **WorkflowRuns** — execution logs & failure tracking.

## 5. Security & Policy Compliance

- Normalize + validate PII before storage; store only what is needed.
- Respect opt-outs everywhere; WhatsApp = template-approved messages only.
- Financial content always carries risk disclaimers (see config licenses).
- No fabricated results: publishing status and metrics come only from verified API responses.
