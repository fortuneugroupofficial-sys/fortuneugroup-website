# Fortune U Group — Credential & Dependency Checklist

**Rule:** never paste secrets into code, prompts, or this repo. Each item below states **exactly** the
credential name, where to store it, required scopes, where it is used, and how to test it. Items without
credentials are **BLOCKED** but the architecture is already built around them as clean swappable points.

Legend: ✅ available / 🔶 partial / ⛔ BLOCKED (not provided).

---

## 1. n8n access — 🔶 (instance exists, access not granted to this repo)

| Field | Value |
|-------|-------|
| Credential / access | n8n editor login (owner/admin) at `n8n.fortuneugroup.in` |
| Where stored | n8n user account (not in repo) |
| Required | Read/export existing workflows; import the versioned workflows in `automation/n8n/workflows/` |
| Used by | Every workflow (WF-01 … WF-15) |
| How to test | Log in → open an existing workflow → confirm the 4 webhooks (`book-consultation`, `insurance`, `sip`, `ai-chat`) and export them for version control |

> **Immediate ask:** export the existing n8n workflows and commit them under
> `automation/n8n/workflows/` so the live automation is no longer un-versioned.

---

## 2. NocoDB — ⛔ BLOCKED

| Field | Value |
|-------|-------|
| Credential name | `NocoDB API Token` (n8n credential type: **Header Auth**, or env `NOCODB_API_TOKEN`) |
| Where stored | n8n credential + `.env` (server side) |
| Required | A NocoDB instance (self-hosted via `automation/docker-compose.yml` or cloud), project URL, and an API token with **table create/read/update** permission |
| Used by | WF-04 (CRM Sync), Lead/CRM Agent, Analytics |
| How to test | `GET {NOCODB_URL}/api/v2/meta/tables` with header `xc-token: {token}` returns HTTP 200 and a table list |

---

## 3. WhatsApp Cloud API — ⛔ BLOCKED

| Field | Value |
|-------|-------|
| Credential name | `WhatsApp Cloud API` (n8n credential / env: `WA_TOKEN`, `WA_PHONE_NUMBER_ID`, `WA_WABA_ID`) |
| Where stored | n8n credential + `.env` |
| Required | Meta app with `whatsapp_business_messaging` + `whatsapp_business_management`; a phone number; approved **message templates** (New Lead Ack, Follow-up 1/2, Appointment Reminder, Document Reminder, Thank You, Human Handover) |
| Used by | WF-05 (New Lead Ack), WF-06 (Follow-ups) |
| How to test | Send a template message to the business's own test number via the Cloud API `/messages` endpoint → HTTP 200 + `message_id` |

> **Policy:** outbound is approval-gated + rate-limited; never uncontrolled bulk send; respect opt-outs
> (mark `Contacts`/`Leads` as opted-out and skip).

---

## 4. Meta Graph API (Facebook + Instagram) — ⛔ BLOCKED

| Field | Value |
|-------|-------|
| Credential name | `Meta Graph API` (n8n credential / env: `META_ACCESS_TOKEN`, `META_PAGE_ID`, `META_IG_ACCOUNT_ID`) |
| Where stored | n8n credential + `.env` |
| Required scopes | `pages_manage_posts`, `pages_read_engagement`, `instagram_basic`, `instagram_content_publish`, `business_management` |
| Used by | WF-09 (Instagram), WF-10 (Facebook) |
| How to test | `GET https://graph.facebook.com/v19.0/me/accounts` with token → returns linked pages/IG accounts |

> Only official Meta APIs are used. No unofficial scraping/automation.

---

## 5. YouTube Data API — ⛔ BLOCKED

| Field | Value |
|-------|-------|
| Credential name | `YouTube OAuth2` (n8n credential type **OAuth2**, or env `YT_CLIENT_ID`, `YT_CLIENT_SECRET`, `YT_REFRESH_TOKEN`) |
| Where stored | n8n OAuth credential (refresh token) |
| Required scopes | `youtube.upload`, `youtube.readonly` (optionally `youtube.force-ssl`) |
| Used by | WF-08 (YouTube publishing + metrics) |
| How to test | `GET https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true` with token → HTTP 200 |

> Publishing defaults to **approval-gated** (`AUTO_PUBLISH=false`).

---

## 6. LLM (Gemini or configured provider) — 🔶 partial

| Field | Value |
|-------|-------|
| Credential name | `Gemini API` (n8n credential / env `GEMINI_API_KEY` or `LLM_API_KEY` + `LLM_BASE_URL`/model) |
| Where stored | n8n credential + `.env` |
| Required | A key for Gemini (or any OpenAI-compatible endpoint) |
| Used by | WF-07 (Content), WF-14 (intent routing — optional), AI Chat |
| How to test | Minimal generation call returns a response |

> `@google/generative-ai` is already a repo dependency. LLM calls are kept minimal and cached to
> control cost (see Cost Control in the plan).

---

## 7. Inbound webhook secret (recommended) — 🔶

| Field | Value |
|-------|-------|
| Credential name | env `FUG_WEBHOOK_SECRET` |
| Where stored | `.env` + n8n (compare in WF-01/WF-14) |
| Used by | WF-01, WF-14 (reject requests with wrong/missing `x-fug-webhook-secret`) |
| How to test | POST with wrong secret → rejected; with correct secret → accepted |

---

## 8. Admin notifications (email/SMTP or WhatsApp-to-admin) — ⛔ BLOCKED

| Field | Value |
|-------|-------|
| Credential name | `SMTP` (n8n credential) or reuse WhatsApp-to-owner |
| Where stored | n8n credential + `.env` |
| Used by | WF-13 (error alerts), WF-12 (report delivery), human-handoff alerts |
| How to test | Trigger a test alert → arrives in admin inbox/WhatsApp |

---

## Quick unblocking order (minimum to proceed)

1. **n8n login** (export existing workflows) → unblocks version control + Phase 4/5 routing.
2. **NocoDB URL + token** → unblocks Phase 2/3 (real CRM persistence).
3. **WhatsApp Cloud API + templates** → unblocks Phase 4.
4. **LLM key** → unblocks content + intent routing.
5. **Meta + YouTube** → unblocks Phase 7.
