# Fortune U Group — Current State Audit (Phase 1)

**Date:** 2026-08-20
**Repository:** `fortuneugroupofficial-sys/fortuneugroup-website`
**Branch:** `arena/01a01cc8-fortuneugroup-website` (off `main` @ `e0af8ae`)

This document is the factual "what exists today" audit. It deliberately does **not** propose
changes — the target architecture is in `01-TARGET-ARCHITECTURE.md`.

---

## 1. What the repository actually contains

The repo has **two website codebases** plus documentation:

| Path | What it is | Status |
|------|-----------|--------|
| `/` (root) | **Static HTML site** (`index.html`, `health.html`, `services.html`, `tools.html`, `about.html`, `contact.html`, `disclosure.html`, `privacy.html`, `terms.html`) + `css/` + `js/` | **Active / canonical** — this is the new site being pushed to Vercel |
| `/frontend/` | **Legacy React (CRA) app** — marketing pages, calculators, blog, admin panel UI, `AIChatWidget`, `LeadForms` | **Legacy** — the previously-live site (still referenced in `HOW-TO-GO-LIVE.md` as "old React app") |
| `/memory/PRD.md` | Original product requirements (FastAPI + MongoDB + React) | Reference only |
| `/design_guidelines.json` | Brand/design system (colors, fonts, layout) | Reference |
| `/test_result.md`, `/tests/`, `/test_reports/` | Testing protocol + historical test output | Reference |
| `.emergent/`, `.gitconfig`, `.gitignore`, `vercel.json`, `HOW-TO-GO-LIVE.md`, `README.md` | Meta/deploy config | Active |

### Static site (root) — details
- **Pages:** Home, Health calculator, Services, SIP tool, About, Contact, Disclosures, Privacy, Terms.
- **Stack:** Pure HTML + vanilla JS. `js/config.js` holds all business identity (brand, phone, email,
  city, IRDAI licence `LIC0159665T`, insurer lists, social URLs, webhook URL). `js/site.js` builds the
  shared header/footer/social-dock and wires the consult form + SIP calculator. `js/health-calc.js`
  drives the health premium illustration.
- **Lead form:** `contact.html` → `#consultForm` POSTs JSON to
  `https://n8n.fortuneugroup.in/webhook/book-consultation` (configured in `js/config.js` →
  `webhookConsult`). Fields: `name`, `mobile`, `email`, `city`, `goal`, `message`, plus `source`.
- **No `robots.txt`, no `sitemap.xml`, no JSON-LD structured data** at the repo root (only the legacy
  `frontend/public/` has them). This is a real SEO gap.
- **Compliance posture is strong:** IRDAI/AMFI/SEBI disclaimers are baked into every page and footer,
  with explicit "not a SEBI-registered Investment Adviser", "mutual funds after ARN", "no advisory fee"
  language. Any automation MUST preserve this (no invented financial/insurance/regulatory claims).

### Legacy React app (`frontend/`) — details
- **Lead paths (`src/lib/api.js`)** post to **four n8n webhooks**: `/webhook/insurance`,
  `/webhook/sip`, `/webhook/ai-chat`, `/webhook/book-consultation`.
- **`AIChatWidget.jsx`** calls `/webhook/ai-chat` (a Gemini-backed chat, Telugu-capable).
- **`Analytics.jsx`** reads `REACT_APP_GA4_ID` (env) for GA4.
- **Known bug (cosmetic):** `LeadForms.jsx` InsuranceForm reset mixes `familyMembers` vs
  `family_members` keys. Low priority since this app is being superseded.
- This app is the **"old site"** the `HOW-TO-GO-LIVE.md` says is still live on Vercel.

---

## 2. Existing integrations (what is actually wired today)

| Integration | Evidence | State |
|-------------|----------|-------|
| **n8n** (hosted at `n8n.fortuneugroup.in`) | 4 webhooks referenced in code: `book-consultation`, `insurance`, `sip`, `ai-chat` | **Live external service, NOT versioned in this repo.** No workflow JSON, no docker-compose, no env files committed. |
| **NocoDB / CRM database** | **None found in repo.** Leads flow into n8n webhooks but there is no persistent CRM schema or store in this codebase. | **Missing** |
| **WhatsApp** | Only as `wa.me` deep-links (click-to-chat) in `config.js`/`site.js`. **No WhatsApp Cloud API integration code.** | **Missing** (click-to-chat only) |
| **Meta / Facebook / Instagram** | Only as social profile links in `config.js`. **No Graph API code.** | **Missing** |
| **YouTube** | Only as a channel link. **No Data API / OAuth code.** | **Missing** |
| **Gemini / LLM** | `@google/generative-ai` in `package.json` (root + frontend); used only inside the legacy `ai-chat` n8n webhook. **No LLM orchestration in repo.** | **Partial** (external, unverified) |
| **Analytics** | `REACT_APP_GA4_ID` env in legacy app; nothing on static site. | **Missing** |

### Important observations
1. **The n8n instance is the de-facto existing automation layer** — but its workflows are not in
   source control. That is a single point of failure and an audit/recovery risk.
2. **The existing lead pipeline is "fire-and-forget":** website → n8n webhook → (unknown). There is no
   evidence of validation, dedup, CRM persistence, follow-up, or observability in this repo.
3. **There is no central orchestrator** — each webhook is an isolated entry point.
4. **No secrets are committed** (good): `.gitignore` covers `.env`, `credentials.json`, `*token.json*`,
   etc. Confirmed no hard-coded API keys in the repo.

---

## 3. What is missing (gap list → maps to target architecture)

| # | Capability | Status |
|---|-----------|--------|
| 1 | Central AI Orchestrator (Master Agent) | Missing |
| 2 | Lead validation + phone normalization + dedup | Missing |
| 3 | Persistent CRM (NocoDB) with defined schema | Missing |
| 4 | WhatsApp Cloud API messaging + templates + follow-ups | Missing |
| 5 | Content generation pipeline (idea → research → draft → fact-check → approve → publish) | Missing |
| 6 | YouTube / Instagram / Facebook publishing | Missing |
| 7 | SEO audit agent | Missing |
| 8 | Follow-up agent (intelligent intervals, opt-out handling) | Missing |
| 9 | Analytics / reporting agent | Missing |
| 10 | Error monitoring + retry + alerting | Missing |
| 11 | Human approval queue (gated actions) | Missing |
| 12 | Versioned n8n workflows (Infrastructure-as-Code) | Missing |
| 13 | Deployment stack definition (docker-compose / VPS) | Missing |
| 14 | Observability / structured logs (`workflow_name`, `execution_id`, `status`, …) | Missing |
| 15 | `robots.txt` / `sitemap.xml` / JSON-LD on the canonical static site | Missing |

---

## 4. Duplicate / legacy systems identified (reuse vs retire)

| System | Recommendation |
|--------|----------------|
| Legacy React app (`frontend/`) | **Retire as the live site.** Keep only if it still provides the admin panel + blog until those are re-implemented or moved. Its `ai-chat` webhook path is worth **reusing** in the new architecture (see below). |
| `n8n.fortuneugroup.in` webhooks | **Reuse.** Keep `book-consultation` as the canonical inbound lead endpoint so the live static site keeps working; route it through the new Master Orchestrator additively. |
| `@google/generative-ai` dependency | **Reuse** for the LLM layer (or swap to a configured LLM via env). |

---

## 5. Blockers identified (credential / access level)

These are things that **cannot** be built or verified from inside this repo. They are marked
**BLOCKED** until the owner provides access. Details + exact storage/scope/test steps are in
`02-CREDENTIAL-AND-DEPENDENCY-CHECKLIST.md`.

1. **n8n instance access** — cannot read/export the existing 4 workflows (they live only on the server).
2. **NocoDB** — no instance/URL/token; CRM layer cannot be stood up against real data.
3. **WhatsApp Cloud API** — no WABA / Phone Number ID / token.
4. **Meta Graph API** — no app ID / token / page & IG account linkage.
5. **YouTube Data API** — no OAuth client / consent.
6. **LLM key** — Gemini key (or alternate provider) is not present.
7. **Admin notification channel** — no email/SMTP config.

> Working rule honoured: none of these are assumed to work. Architecture is built so each is a clean,
> swappable, approval-gated integration point.

---

## 6. Existing working systems — DO NOT DESTROY

- The live static website (root) and its current `book-consultation` webhook contract.
- The live n8n instance and its 4 webhooks (even if undocumented).
- The compliance copy/legal disclaimers (regulatory requirement).
- Brand identity in `design_guidelines.json` and `js/config.js`.
