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
    └── workflows/            ← versioned, importable workflow JSON
        ├── WF-01_Website_Lead_Intake.json
        ├── WF-14_Master_AI_Orchestrator.json
        └── WF-15_Human_Approval_Queue.json
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

## 4. Wiring to the website

The live static site posts to `https://n8n.fortuneugroup.in/webhook/book-consultation`
(`js/config.js → webhookConsult`). The new Master Agent exposes `POST /master` and `POST /lead-intake`.
Keep `book-consultation` working by adding a small alias/redirect inside n8n, or re-point `js/config.js`
once Phase 2 is verified — do **not** break the live form mid-migration.

---

## 5. Status of each workflow

| Workflow | State |
|----------|-------|
| WF-01 Website Lead Intake | 🟡 scaffold complete; needs NocoDB + WhatsApp credentials |
| WF-02 … WF-13 | ⏳ queued (see `docs/03-IMPLEMENTATION-PLAN.md`) |
| WF-14 Master AI Orchestrator | 🟡 skeleton complete |
| WF-15 Human Approval Queue | 🟡 skeleton complete |
