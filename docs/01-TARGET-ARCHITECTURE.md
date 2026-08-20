# Fortune U Group — Target Architecture

The goal is **one central AI Agent ("Fortune U Group Master AI Agent")** that orchestrates a set of
specialist agents, executed through modular n8n workflows, with NocoDB as the system-of-record and a
human approval gate for irreversible actions.

---

## 1. High-level topology

```
                 ┌─────────────────────────────────────────────────────────────┐
   Users /       │                       FORTUNE U GROUP MASTER AI AGENT         │
   Website /     │   (intent → route → execute → validate → log → escalate)      │
   Social        └──────────────┬───────────────────────────────┬────────────────┘
                                │                               │
                     ┌──────────▼──────────┐          ┌─────────▼──────────┐
                     │   n8n (automation)  │          │  NocoDB (CRM/data) │
                     │  modular workflows  │◄────────►│  Leads, Contacts,  │
                     └──────────┬──────────┘          │  FollowUps, …      │
                                │                     └────────────────────┘
          ┌──────────┬──────────┼──────────┬──────────────┐
          ▼          ▼          ▼          ▼              ▼
      WhatsApp    Meta IG    Meta FB    YouTube       LLM (Gemini/
      Cloud API   Graph API  Graph API  Data API       configured)
```

Specialist agents are **logical** constructs — each maps to one or more n8n workflows and a slice of
the NocoDB schema. They do not each need a separate process; they share one orchestration layer.

---

## 2. Specialist agents → workflow mapping

| Agent | Primary workflows | Data tables | Approval-gated? |
|-------|------------------|-------------|-----------------|
| **Lead/CRM Agent** | WF-01, WF-02, WF-03, WF-04 | `Leads`, `Contacts`, `Interactions` | No (CRUD) |
| **WhatsApp Agent** | WF-05, WF-06 | `Interactions`, `FollowUps`, `Leads.whatsapp_status` | **Yes** (outbound), rate-limited |
| **Content Agent** | WF-07 | `Content`, `Approvals` | Output always goes to `Approvals` first |
| **YouTube Agent** | WF-08 | `Content`, `PublishingQueue`, `SocialPosts` | **Yes** (publish) |
| **Instagram Agent** | WF-09 | `PublishingQueue`, `SocialPosts` | **Yes** (publish) |
| **Facebook Agent** | WF-10 | `PublishingQueue`, `SocialPosts` | **Yes** (publish) |
| **Website/SEO Agent** | WF-01 (monitor), WF-11 (audit) | `AutomationLogs`, `Errors` | High-impact SEO changes: **Yes** |
| **Follow-up Agent** | WF-06 (scheduler) | `FollowUps`, `Leads.next_followup_at` | Outbound: **Yes** |
| **Analytics Agent** | WF-12 | reads all tables | No (read-only) |
| **Error Monitoring Agent** | WF-13 | `Errors`, `AutomationLogs` | Retry: safe-only |
| **Master Orchestrator** | WF-14 | `AutomationLogs`, routes to above | N/A (router) |
| **Human Approval Queue** | WF-15 | `Approvals` | N/A (the gate itself) |

### Workflow catalogue (modular, importable)

| ID | Name | Trigger | Notes |
|----|------|---------|-------|
| WF-01 | Website Lead Intake | Webhook `POST /lead-intake` | Normalize → upsert → ack → route |
| WF-02 | Lead Validation | sub-workflow / Code node | Phone/email validation, required-field checks |
| WF-03 | Lead Deduplication | sub-workflow / query | Match on normalized phone/email |
| WF-04 | NocoDB CRM Sync | HTTP Request → NocoDB | Create/update `Leads`, `Interactions` |
| WF-05 | WhatsApp New Lead Ack | HTTP Request → WA Cloud API | Template send; **rate-limited** |
| WF-06 | WhatsApp / Follow-up Scheduler | Cron / queue | Interval logic, opt-out respect |
| WF-07 | Content Generation | Webhook / LLM | Idea → draft → `Approvals` |
| WF-08 | YouTube Publishing | Approval → YouTube API | Upload/schedule, track video IDs |
| WF-09 | Instagram Publishing | Approval → Meta Graph | Reel metadata + publish, track IDs |
| WF-10 | Facebook Publishing | Approval → Meta Graph | Post/Reel publish, track IDs |
| WF-11 | SEO Audit | Cron | Titles, meta, headings, links, sitemap, schema |
| WF-12 | Analytics / Reports | Cron | Daily/weekly/monthly rollups |
| WF-13 | Error Monitoring | n8n Error Trigger | Log, classify, safe retry, notify |
| WF-14 | Master AI Orchestrator | Webhook `POST /master` | Intent → route → validate → log |
| WF-15 | Human Approval Queue | Webhook / poll | `DRAFT→…→APPROVED/REJECTED` |

Every workflow follows the same skeleton: **Trigger → Validation → Processing → Action → Logging →
Error Handling**.

---

## 3. Master Agent decision logic

For every incoming event (website lead, inbound WhatsApp, scheduled task, error):

```
1. identify event type           →  source + payload shape
2. identify user/lead            →  normalize phone/email, look up CRM
3. check CRM                     →  dedup, fetch history
4. determine intent              →  classification (LLM only when needed)
5. select specialist agent       →  WF-01..WF-13
6. execute workflow              →  n8n sub-workflow call
7. validate result               →  check NocoDB write / API response
8. update CRM + logs             →  Leads, Interactions, AutomationLogs
9. determine next action         →  follow-up schedule, escalation
10. escalate to human if needed  →  HUMAN_HANDOFF
```

**Approval gate rule:** actions in `{delete data, bulk send, publish sensitive content, website
settings change, spend money, infra change}` are always routed through WF-15 unless an explicit
`AUTO_PUBLISH=true` + per-action approval flag is set. Default is **`AUTO_PUBLISH=false`**.

---

## 4. NocoDB schema (system-of-record)

Full SQL DDL lives in `automation/nocodb/schema.sql`. Tables:

- **Leads** — canonical lead record (status, priority, source, service, `whatsapp_status`,
  `conversion_status`, timestamps, `next_followup_at`). Status values:
  `NEW, CONTACTED, INTERESTED, FOLLOW-UP, QUALIFIED, CONVERTED, NOT_INTERESTED, LOST, HUMAN_HANDOFF`.
- **Contacts** — merged person identity (normalized phone/email) shared across leads.
- **Interactions** — every message/call/email (append-only; never overwrite history).
- **FollowUps** — scheduled follow-up tasks with interval + attempt count + opt-out flag.
- **Content** — content items (platform, type, idea, draft, fact-check status).
- **PublishingQueue** — items pending/approved/scheduled for publish.
- **SocialPosts** — published post/reel/video metadata (platform post IDs + URLs).
- **Campaigns** — groupings for reporting.
- **Tasks** — internal to-dos.
- **Approvals** — the approval queue (states: `DRAFT, AI_REVIEW, HUMAN_REVIEW, APPROVED, REJECTED,
  SCHEDULED, PUBLISHED, FAILED`).
- **AutomationLogs** — observability (workflow_name, execution_id, timestamp, event_type, lead_id,
  status, error_message, retry_count, duration, result).
- **Errors** — error register with classification + retry policy.
- **Settings** — key/value config (e.g. `AUTO_PUBLISH`, follow-up intervals, rate limits).

Relationships use foreign keys where NocoDB/Postgres supports them; otherwise linked-record fields.

---

## 5. Content pipeline

```
IDEA → AI RESEARCH → DRAFT → FACT CHECK → APPROVAL → CONTENT GENERATION
     → PUBLISHING QUEUE → PUBLISH → ANALYTICS → AI PERFORMANCE ANALYSIS
     → NEXT CONTENT RECOMMENDATION
```

- Every generated item lands in `Content` (status `DRAFT`) → `Approvals` (`HUMAN_REVIEW`).
- **Fact-check gate:** anything that looks like a financial/insurance/legal/regulatory claim is flagged
  for human review and is **never auto-published**.
- `AUTO_PUBLISH` is a `Settings` flag; default `false`.

---

## 6. Security model

- All secrets in **n8n credentials** or **environment variables** — never in code/workflows/Git.
- Inbound webhooks protected by a **shared secret header** (`x-fug-webhook-secret`).
- Least-privilege scopes per integration (see credential checklist).
- Rate limits + opt-out handling on all outbound messaging.
- Approval gate on irreversible actions (WF-15).
- Audit logging on every important action (`AutomationLogs`).

---

## 7. Deployment target (production)

```
Internet → Cloud/VPS → Reverse Proxy (Caddy/Nginx + HTTPS)
        → n8n (Community) → NocoDB → AI/API integrations
```

- `automation/docker-compose.yml` provides the canonical stack (n8n + NocoDB + Postgres + reverse
  proxy) for a VPS. The existing `n8n.fortuneugroup.in` can be kept and simply have these workflows
  imported into it.
- Frontend (static site), automation (n8n), and database (NocoDB) stay **separate**.
- Workflows are versioned in Git under `automation/n8n/workflows/`.

---

## 8. Build order (matches implementation strategy)

| Phase | Scope | This session status |
|-------|-------|---------------------|
| 1 | Audit + target architecture + credential checklist | **COMPLETED** |
| 2 | NocoDB CRM + Website Lead Intake | **IN PROGRESS** (scaffold committed) |
| 3 | Lead validation + dedup + follow-up | Queued |
| 4 | WhatsApp automation | Queued (BLOCKED on credentials) |
| 5 | Master AI Orchestrator | Scaffold present |
| 6 | Content Agent | Queued (BLOCKED on LLM key) |
| 7 | YouTube / IG / FB publishing | Queued (BLOCKED on credentials) |
| 8 | SEO Agent | Queued |
| 9 | Analytics | Queued |
| 10 | Error monitoring + optimization | Queued |

Detailed, per-phase steps and acceptance criteria: `03-IMPLEMENTATION-PLAN.md`.
