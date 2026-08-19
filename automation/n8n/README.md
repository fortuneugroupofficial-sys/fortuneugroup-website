# n8n Workflow Templates

These are **importable n8n workflow definitions** for the Fortune U Group automation system. They are starting-point templates — safe to import, but they reference credentials and environment variables you must configure in your n8n instance (`n8n.fortuneugroup.in`). They are **not yet running** and nothing here pretends otherwise.

## Import

In n8n: **Workflows → ⋯ → Import from File** and select the `.json` file.

## Environment variables to set in n8n

Set these in n8n's **Settings → Environment Variables** (or your deployment config):

| Variable | Purpose |
|----------|---------|
| `NOCODB_URL` | NocoDB base URL, e.g. `https://app.nocodb.com` |
| `LEADS_TABLE_ID` | NocoDB table id for `Leads` |
| `WHATSAPP_PHONE_ID` | WhatsApp Business phone number id |
| `WHATSAPP_TOKEN` | WhatsApp Cloud API token |
| `GA4_MEASUREMENT_ID` | Google Analytics 4 id (default `G-5P0R5EM9C6`) |

## Credentials to create in n8n

| Credential name | Type | Fields |
|-----------------|------|--------|
| `NocoDB API Token` | Header Auth | Name = `xc-token`, Value = your NocoDB API token |
| `WhatsApp Cloud API` | Header Auth | Name = `Authorization`, Value = `Bearer <token>` |

## Workflow files

| File | Purpose | Triggers |
|------|---------|----------|
| `lead-ingest.json` | Ingest + normalize + dedupe + store lead in NocoDB | Webhook `POST /lead-ingest` |
| `whatsapp-followup.json` | Template-compliant WhatsApp follow-up with opt-out guard | Manual / NocoDB trigger (wire to `Leads.Status = new`) |
| `daily-report.json` | Collect lead + workflow metrics and build a daily digest | Schedule (daily) |

## IMPORTANT — test safely first

- Run every workflow with `TEST_`-prefixed data first.
- Do **not** point the live website webhooks at these until they are verified in your n8n.
- The current live site posts to `/webhook/book-consultation`, `/webhook/insurance`, `/webhook/sip`, `/webhook/ai-chat`. Decide whether to keep those paths or route them to `lead-ingest` — recommended: keep the existing paths as thin wrappers that all call the same lead-ingest sub-workflow (avoids breaking the live site).
