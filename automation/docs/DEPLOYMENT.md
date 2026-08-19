# Production Deployment Checklist — Fortune U Group Master AI Agent

Goal: take the (already-tested) automation from local/dry-run to live, **without
enabling real publishing or bulk WhatsApp messaging yet**. Auto-publish stays OFF and
dry-run stays ON until explicitly changed.

## 0. Pre-flight (already true)
- [x] `AUTO_PUBLISH=false`
- [x] `FUG_DRY_RUN=true`
- [x] Website pages untouched (no HTML/CSS/JS changes)
- [x] 33 unit tests pass
- [x] All 15 n8n workflows connected to the Master Orchestrator
- [x] NocoDB schema matches the Lead model (22/22 fields, 13/13 tables)

## 1. Infrastructure
- [ ] Provision a VPS (or container) for the Python orchestrator + intake webhook.
- [ ] Put a reverse proxy (nginx/Caddy) in front with HTTPS; bind webhook to `0.0.0.0` behind it.
- [ ] Deploy static site to Vercel as-is (unchanged); domain `fortuneugroup.in`.
- [ ] (Recommended) Deploy n8n Community Edition on the VPS; NocoDB alongside (or managed).

## 2. Secrets (create `automation/.env`, never commit)
- [ ] Copy `.env.example` → `.env`, fill each credential in Section 3.
- [ ] Confirm `.env` is git-ignored (`automation/.env` is in `.gitignore`).

## 3. Credentials required for production (see `docs/CREDENTIALS.md`)
| Integration | Env var(s) | Required? |
|---|---|---|
| NocoDB | `NOCODB_URL`, `NOCODB_API_TOKEN` | Required to go live (else local JSON store) |
| WhatsApp Cloud API | `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_BUSINESS_NUMBER` | Required for real messages |
| Meta Graph (IG/FB) | `META_ACCESS_TOKEN`, `FB_PAGE_ID`, `IG_USER_ID` | Required for social publish |
| YouTube | `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REFRESH_TOKEN`, `YOUTUBE_API_KEY` | Required for YouTube publish |
| Gemini | `GEMINI_API_KEY`, `GEMINI_MODEL` | Recommended (else deterministic mode) |
| Intake | `INTAKE_SECRET` | Recommended (webhook auth) |

## 4. Data layer
- [ ] Create the 13 NocoDB tables from `automation/nocodb/schema.json` (or import the reference DDL).
- [ ] Test NocoDB: `curl -H "xc-token: $NOCODB_API_TOKEN" $NOCODB_URL/api/v1/meta/tables`.
- [ ] Verify the CRM facade reports `crm_backend=nocodb` in `fug.cli status`.

## 5. n8n wiring
- [ ] Import `automation/workflows/n8n/*.json` (WF-01…15) into n8n.
- [ ] Point every HTTP Request node at the deployed intake URL (replace `{{your-domain}}`).
- [ ] Create n8n credential entries for WhatsApp / Meta / YouTube / Gemini as referenced.
- [ ] WF-08/09/10 remain `active=false` (publishing) — keep them disabled.
- [ ] Test WF-01 with a sample lead; confirm the lead lands in NocoDB.

## 6. WhatsApp
- [ ] Get the 7 message templates approved in Meta Business Manager (`new_lead_acknowledgement`, `followup_1`, `followup_2`, `final_followup`, `appointment_reminder`, `document_reminder`, `thank_you`, `human_handover`).
- [ ] Test template send to your own test number via Graph API debugger.

## 7. Go-live order (safe)
- [ ] **Step A (dry-run in prod):** deploy with `FUG_DRY_RUN=true`. Confirm intake → CRM, reports, SEO audit, error log.
- [ ] **Step B:** set `FUG_DRY_RUN=false`; send only the acknowledgement template to a test lead. Do **not** enable bulk follow-ups until one real ack is confirmed.
- [ ] **Step C:** leave `AUTO_PUBLISH=false`. Approve publish items manually through WF-15. Keep WF-08/09/10 inactive.
- [ ] Do **not** enable auto-publish or bulk WhatsApp until separately instructed.

## 8. Observability
- [ ] Confirm `AutomationLogs` and `Errors` tables are being written.
- [ ] Configure an admin alert path (email/n8n notify) for unresolved errors.
- [ ] Review the daily report (`fug.cli report daily`) once per day.
