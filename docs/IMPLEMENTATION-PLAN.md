# Fortune U Group — Implementation Plan

This is the phased build plan for the Master Agent automation system. Each phase is independently verifiable and does not depend on fabrication — only on credentials/access being supplied.

## Phase 0 — Foundation (IN PROGRESS, no external credentials needed)

- [x] Audit entire existing environment → `docs/AUDIT.md`
- [x] Central configuration → `config/fortuneugroup.config.json`
- [x] Master Agent architecture → `docs/ARCHITECTURE.md`
- [x] Agent definitions → `docs/AGENTS.md`
- [x] NocoDB target schema → `docs/nocodb-schema.md`
- [x] Importable n8n workflow templates → `automation/n8n/`
- [ ] Commit & push to the session branch

## Phase 1 — CRM & Lead Pipeline (needs: NocoDB + n8n access)

- Provision NocoDB tables (`Leads`, `ContentPosts`, `Conversations`, `WorkflowRuns`).
- Import `lead-ingest` workflow into n8n; point webhooks at it.
- Implement normalize + dedupe + status/priority assignment.
- Test with **safe test data** (name `TEST_`, clearly marked) and verify no duplicates.

## Phase 2 — WhatsApp Follow-up (needs: WhatsApp Business API)

- Configure WhatsApp Cloud API credentials in n8n.
- Import `whatsapp-followup` workflow; wire to `Leads` status = `new`.
- Respect opt-outs; template-compliant messages only.
- Test on internal/test number only, then request approval for live.

## Phase 3 — Content & Social Publishing (needs: Meta + YouTube access)

- Import `content-calendar` + `publish-social` workflows.
- Connect Instagram/Facebook (Meta Graph API) and YouTube (Data API/OAuth).
- Approval gate: `ContentPosts.Status` must be `approved`.
- Test with draft-only runs; publish only after explicit approval.

## Phase 4 — Analytics & Reporting (needs: GA4 + reporting channel)

- Import `daily-report` workflow.
- Collect GA4 + `WorkflowRuns` + `Leads` metrics.
- Deliver daily/weekly digest (email or internal channel).

## Phase 5 — SEO Agent (uses existing site + search)

- Crawl `frontend/` (canonical site) for broken links / meta / technical SEO.
- Generate keyword + meta + blog plan. Content edits require approval.

## Phase 6 — Hardening

- Add retry/error-handling policy to all workflows.
- Add monitoring + alerts on `WorkflowRuns.Status = failed`.
- Review idempotency and restart-safety of every workflow.

---

## Immediate blockers (need from you)

| # | What I need | Why |
|---|-------------|-----|
| 1 | **n8n admin access** (login or API key for `n8n.fortuneugroup.in`) | To see existing workflows, import new ones, read/write credentials |
| 2 | **NocoDB URL + API token** | To create the CRM tables and store leads |
| 3 | **WhatsApp Business Cloud API token + phone number ID** | Follow-up messaging |
| 4 | **Meta (Instagram/Facebook) access token + Page/IG IDs** | Social publishing |
| 5 | **YouTube OAuth / Data API credentials** | Video publishing |
| 6 | **Google Gemini (or chosen LLM) API key** | Content Agent generation |
| 7 | **Confirmation: which site is canonical** (React `frontend/` vs static root) | Avoid duplicate SEO/content work |

Without these, I can keep building the **definitions, config, schemas, and importable workflows** (which I am doing now), but I cannot run live automation or verify real end-to-end execution — and I will not fabricate that it is running.
