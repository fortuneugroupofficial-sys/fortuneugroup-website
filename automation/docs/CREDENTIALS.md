# Credentials & Integration Checklist

> **Never paste secrets here or into any source file.** Use the environment / n8n credential
> store. This page tells you the **name**, **where to store it**, **scopes**, **where it's used**
> and **how to test** each integration. Everything is currently **BLOCKED** until these exist.

`python3 -m fug.cli status` lists the live BLOCKED set at any time.

---

## 1. NocoDB

| Item | Value |
|---|---|
| Env vars | `NOCODB_URL`, `NOCODB_API_TOKEN`, `NOCODB_DB_NAME=fug_crm` |
| Store | `.env` (server-side) or n8n credential "NocoDB" |
| Permissions | Read/write on the `fug_crm` database tables |
| Used by | `fug/crm.py`, `fug/nocodb.py`, WF-04 |
| Test | `curl -H "xc-token: $NOCODB_API_TOKEN" $NOCODB_URL/api/v1/meta/tables` → 200 |

## 2. WhatsApp Cloud API

| Item | Value |
|---|---|
| Env vars | `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_BUSINESS_NUMBER` |
| Store | n8n credential "WhatsApp Cloud API" (OAuth) or `.env` |
| Scopes | `whatsapp_business_messaging`, `whatsapp_business_management`; template approval in Meta Business Manager |
| Used by | `fug/notifiers.py`, `fug/agents/whatsapp_agent.py`, WF-05/WF-06 |
| Test | Send the `new_lead_acknowledgement` template to a test number via Graph API debugger |

## 3. Meta Graph API (Instagram / Facebook)

| Item | Value |
|---|---|
| Env vars | `META_ACCESS_TOKEN`, `FB_PAGE_ID`, `IG_USER_ID` |
| Store | n8n credential "Meta Graph API (OAuth)" or `.env` |
| Scopes | `pages_manage_posts`, `business_management`, `instagram_basic`, `instagram_content_publish`, `pages_read_engagement` |
| Used by | `fug/agents/social_agent.py`, WF-09/WF-10 |
| Test | `curl -H "Authorization: Bearer $META_ACCESS_TOKEN" "https://graph.facebook.com/v19.0/me/accounts"` |

## 4. YouTube Data API / OAuth

| Item | Value |
|---|---|
| Env vars | `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REFRESH_TOKEN`, `YOUTUBE_API_KEY` |
| Store | n8n credential "YouTube (OAuth2)" or `.env` |
| Scopes | `https://www.googleapis.com/auth/youtube.upload`, `youtube.readonly` |
| Used by | `fug/agents/social_agent.py`, WF-08 |
| Test | `curl "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true" -H "Authorization: Bearer $YOUTUBE_ACCESS_TOKEN"` |

## 5. Gemini / LLM

| Item | Value |
|---|---|
| Env vars | `GEMINI_API_KEY`, `GEMINI_MODEL=gemini-2.0-flash` |
| Store | `.env` (server-side) or n8n credential "Gemini" |
| Scopes | n/a (API key) |
| Used by | `fug/llm.py` (content + reasoning) |
| Test | `curl -H "x-goog-api-key: $GEMINI_API_KEY" .../generateContent` |

## 6. Website monitoring (optional)

| Item | Value |
|---|---|
| Env var | (none yet) |
| Permissions | Access to website analytics/error logs if available |
| Used by | `fug/agents/website_agent.py` — currently reports `blocked` |
| Note | Optional; not required to run the automation pipeline |

---

## What runs without credentials

The full pipeline runs in **local + dry-run** mode: leads are captured and validated, deduplicated,
stored (JSON store), acknowledged (simulated), follow-ups scheduled, content drafted, SEO audited,
reports generated, errors monitored. Only the external send/publish calls are blocked — and the
system tells you so instead of pretending to work.
