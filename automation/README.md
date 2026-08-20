# Fortune U Group — Automation Stack (Infrastructure-as-Code)

This directory is the version-controlled source of truth for the Fortune U Group automation system:
n8n workflows, the NocoDB CRM schema, and the deployment stack.

```
automation/
├── README.md                 ← this file
├── docker-compose.yml        ← n8n + NocoDB + Postgres + reverse proxy
├── .env.example              ← every env var, no secrets
├── nocodb/
│   └── schema.sql            ← full CRM/data DDL (Leads, Contacts, Interactions, …)
└── n8n/
    └── workflows/            ← versioned, importable workflow JSON (WF-01 … WF-15)
```

---

## Security (read first)

- **Never commit secrets.** Copy `.env.example` → `.env` and fill it on the server. `.env` is
  git-ignored.
- Store API tokens in **n8n credentials** (Settings → Credentials), not in workflow JSON.
- Workflows read credentials by name; after import you will be prompted to re-assign each one.

---

## 1. Deploy the stack (fresh VPS)

```bash
cd automation
cp .env.example .env        # then edit real values
docker compose up -d
```

Services:
- **n8n** (Community) — `http://localhost:5678` (proxied to `n8n.fortuneugroup.in`)
- **NocoDB** — `http://localhost:8080` (proxied to `crm.fortuneugroup.in`)
- **Postgres** — shared DB for NocoDB + n8n queue/persistence
- **Caddy** — reverse proxy + automatic HTTPS

> You already have a live n8n at `n8n.fortuneugroup.in`. Two options:
> **(A) keep it** and simply *import* the workflows below into it (recommended, least disruption), or
> **(B) migrate** to this compose stack and re-point the website webhook. Do not run two n8n instances
> serving the same webhook paths.

---

## 2. Initialize the CRM schema

NocoDB manages schema visually, but you can create tables from SQL. Option A — use the NocoDB UI to
create the tables described in `nocodb/schema.sql`. Option B — if you attach a dedicated Postgres to
NocoDB, run the DDL directly:

```bash
docker compose exec -T postgres psql -U nocodb -d nocodb < nocodb/schema.sql
```

(Adjust DB/user per your `.env`.)

---

## 3. Import the workflows

1. n8n → Workflows → **Import from File** → pick each JSON in `n8n/workflows/`.
2. Re-assign credentials when prompted (create them first under Settings → Credentials).
3. Set the `FUG_N8N_BASE_URL`, NocoDB base URL + token, WhatsApp Phone Number ID, etc. in the
   relevant nodes (they use expressions like `{{$env.FUG_...}}` or a credential reference — no secrets
   inline).
4. **Activate** WF-01 and WF-14.

---

## 4. Wiring to the website (import into the EXISTING n8n)

You already run n8n at `n8n.fortuneugroup.in` with 4 live webhooks. Recommended migration
(additive — do **not** delete the working webhooks until the new ones are verified):

| Existing webhook (live) | Maps to | Action |
|-------------------------|---------|--------|
| `book-consultation` | WF-01 `POST /lead-intake` | Import WF-01, then point it at NocoDB; keep `book-consultation` as an alias/redirect node inside n8n, or re-point `js/config.js → webhookConsult` after verification |
| `insurance` | WF-01 (service = health/life) | Same lead-intake path, add a `service` field |
| `sip` | WF-01 (service = sip) | Same lead-intake path, add a `service` field |
| `ai-chat` | WF-14 `POST /master` (or keep as-is) | Route chat through the Master Agent for intent + human-handoff |

The new Master Agent exposes `POST /master` and `POST /lead-intake`. Never break the live form
mid-migration: import first, verify end-to-end, then cut over.

---

## 5. Workflow catalogue (all importable)

| Workflow | Trigger | State |
|----------|---------|-------|
| WF-01 Website Lead Intake | Webhook `POST /lead-intake` | 🟡 scaffold; needs NocoDB + WA creds |
| WF-02 Lead Validation | Webhook `POST /lead/validate` | 🟡 scaffold |
| WF-03 Lead Deduplication | Webhook `POST /lead/dedupe` | 🟡 scaffold |
| WF-04 NocoDB CRM Sync | Webhook `POST /crm/sync` | 🟡 scaffold |
| WF-05 WhatsApp New Lead Ack | Webhook `POST /wa/ack` | 🟡 scaffold; needs WA creds |
| WF-06 WhatsApp Follow-up Scheduler | Cron (hourly) | 🟡 scaffold; needs WA creds |
| WF-07 Content Generation | Webhook `POST /content/generate` | 🟡 scaffold; needs LLM key |
| WF-08 YouTube Publishing | Webhook `POST /youtube/publish` | 🟡 approval-gated; needs OAuth |
| WF-09 Instagram Publishing | Webhook `POST /instagram/publish` | 🟡 approval-gated; needs Meta creds |
| WF-10 Facebook Publishing | Webhook `POST /facebook/publish` | 🟡 approval-gated; needs Meta creds |
| WF-11 SEO Audit | Cron (weekly) | 🟡 scaffold (report-only) |
| WF-12 Analytics | Cron (daily) | 🟡 scaffold |
| WF-13 Error Monitoring | Error Trigger | 🟡 scaffold |
| WF-14 Master AI Orchestrator | Webhook `POST /master` | 🟡 routing skeleton |
| WF-15 Human Approval Queue | Webhook `POST /approval/submit` | 🟡 scaffold |

**Important:** every workflow is `active: false` and credential-free. After import, re-assign
credentials, fill `$env` vars, test each one, then activate. Nothing auto-publishes
(`AUTO_PUBLISH=false` by default).
