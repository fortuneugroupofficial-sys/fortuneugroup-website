# Fortune U Group

Public website for [fortuneugroup.in](https://www.fortuneugroup.in/)

Static HTML (no React). Health insurance calculator, IRDAI disclosures, social dock.

## Automation

The **Fortune U Group Master AI Agent** automation system lives in [`automation/`](automation/README.md):
a central orchestrator (Python, stdlib-only) routing to specialist agents for Leads/CRM, WhatsApp,
Content, YouTube, Instagram, Facebook, Website/SEO, Follow-up, Analytics and Error Monitoring —
with n8n workflow definitions (WF-01…15), a NocoDB schema, and an approval-gated publishing model.
External integrations are credential-gated (see [`automation/docs/CREDENTIALS.md`](automation/docs/CREDENTIALS.md)).

## Local preview

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

## Deploy on Vercel

1. Import this GitHub repo in [vercel.com](https://vercel.com/new)
2. Framework: **Other**
3. Output: leave empty (static root)
4. Assign domains `fortuneugroup.in` and `www.fortuneugroup.in`

Licence and insurer names: edit `js/config.js`.
