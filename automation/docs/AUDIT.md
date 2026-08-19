# Phase 1 — Current State Audit

## What already exists

| Component | Status | Notes |
|---|---|---|
| Static website (9 pages) | ✅ Working | `index, health, services, tools, disclosure, contact, about, privacy, terms` |
| Contact lead form | ✅ Working | `contact.html` → POST JSON to n8n webhook `https://n8n.fortuneugroup.in/webhook/book-consultation` (see `js/config.js`) |
| WhatsApp FAB + social dock | ✅ Working | `js/site.js` builds `wa.me/919490237465` links, IG/YT/FB/WA icons |
| Central config | ✅ Working | `js/config.js` — phone, email, socials, webhook URL, IRDAI ref, insurers |
| Old React CRA frontend | ⚠️ Present, unused in live path | `frontend/`; legacy FastAPI+Mongo backend not in this repo (see `memory/PRD.md`) |
| Sitemap / robots.txt | ⚠️ Was missing | Added in this phase (`sitemap.xml`, `robots.txt`) |
| SEO basics | ⚠️ Gaps | 9 pages missing JSON-LD schema; some missing/short meta descriptions; some H2 gaps (audited by the SEO agent) |

## What is missing / not reachable from this repo

| Item | State |
|---|---|
| Live n8n instance | **BLOCKED** — external host `n8n.fortuneugroup.in`; not reachable from this sandbox |
| NocoDB instance + token | **BLOCKED** — no URL/token |
| WhatsApp Cloud API credentials | **BLOCKED** |
| Meta Graph API (IG/FB) credentials | **BLOCKED** |
| YouTube OAuth/API credentials | **BLOCKED** |
| Gemini API key | **BLOCKED** (deterministic mode used instead) |

## Audit decisions

1. **No existing automation code to preserve in this repo** — the website is static; the n8n
   workflows live on an external host. Nothing was destroyed.
2. **`js/config.js` webhook is left intact** so the live site keeps working. The self-hosted
   intake webhook (`fug/webhook.py`) is provided as a fallback / dev endpoint and accepts the
   same payload shape.
3. **Sitemap + robots.txt** were added because they are safe, additive SEO fixes that the SEO
   agent flags; they are standard for any deployable site.

## Missing credentials / dependencies

See `docs/CREDENTIALS.md` for exactly which credentials are needed, where to store them, and
which workflows they unblock.
