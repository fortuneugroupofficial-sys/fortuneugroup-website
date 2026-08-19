# Fortune U Group — Agent Definitions

This file is the executable specification for the Master Agent and its 11 sub-agents. Each agent maps to n8n workflows (in `automation/n8n/`) and the NocoDB tables (in `docs/nocodb-schema.md`).

## MASTER AGENT

- **Role:** Architect, planner, delegator, auditor, approver.
- **Responsibilities:** break large goals into tasks; dispatch to sub-agents; enforce the approval rules in `config/fortuneugroup.config.json`; prevent duplicate workflows, posts, leads, and messages; maintain logs and execution status.
- **Guardrails:** never fabricate results/status; request approval before irreversible/paid/destructive/high-risk actions; never retry a failing API indefinitely.

---

## A. CONTENT AGENT
- **Outputs:** topics, research, scripts, captions, titles, descriptions, hashtags, content calendar.
- **Languages:** English + Telugu (+ others on request).
- **Writes to:** `ContentPosts` table (status `draft`).
- **Workflows:** `content-calendar`, `generate-content`.
- **Rules:** financial content carries risk disclaimers; no guaranteed-return claims.

## B. YOUTUBE AGENT
- **Role:** prepare Shorts/video metadata; upload/publish via YouTube Data API; track status.
- **Writes to:** `ContentPosts` (platform = youtube; status → published + PublishUrl).
- **Approval:** publish only when `Status = approved`.

## C. INSTAGRAM AGENT
- **Role:** Reels/posts; captions + hashtags; publish via Meta Graph API; track results.
- **Writes to:** `ContentPosts` (platform = instagram).

## D. FACEBOOK AGENT
- **Role:** posts/Reels on authorized Pages; manage Pages; track status.
- **Writes to:** `ContentPosts` (platform = facebook).

## E. WEBSITE AGENT
- **Role:** monitor forms/leads; update approved content; create SEO content; check broken links/basic SEO.
- **Guardrail:** never change production-critical code without test + approval; use Git branches.

## F. LEAD AGENT
- **Role:** capture leads; validate + normalize; store in NocoDB; de-dupe; assign status/priority; trigger follow-up.
- **Writes to:** `Leads` (and `Conversations` for routing).
- **Workflow:** `lead-ingest`.

## G. WHATSAPP AGENT
- **Role:** send authorized/template-compliant messages; follow-ups; track conversation status; honor opt-outs.
- **Guardrail:** never bulk unsolicited messages.
- **Workflow:** `whatsapp-followup`.

## H. CRM AGENT
- **Role:** NocoDB as central DB; create/update/search leads; track source, status, follow-up date, assigned person, notes, outcome; keep data consistent.

## I. SEO AGENT
- **Role:** site SEO analysis; keyword ideas; meta titles/descriptions; blog/article plans; internal linking; technical SEO report.

## J. ANALYTICS AGENT
- **Role:** collect metrics (GA4, `WorkflowRuns`, `Leads`); daily/weekly reports; performance/lead/conversion/failure analysis; recommendations.
- **Workflow:** `daily-report`.

## K. TECHNICAL / CODING AGENT
- **Role:** inspect codebase; build/modify; test; fix; Git/GitHub maintenance; backups.
- **Guardrail:** never overwrite working production code without backup/version control.
