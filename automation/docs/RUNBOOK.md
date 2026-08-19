# Runbook — Fortune U Group Master AI Agent

## Prerequisites

* Python 3.8+ (stdlib only — no pip install needed)
* `automation/.env` copied from `.env.example` (secrets optional; system runs without them)

## Common operations

### Check system status and BLOCKED integrations
```bash
cd automation
python3 -m fug.cli status
```

### Capture a lead
```bash
python3 -m fug.cli ingest --name "Ravi" --phone 9490237465 \
  --goal "Health insurance" --message "Need family cover"
```
This validates, normalises (`+91 94...`), dedupes, writes to CRM and (dry-run) sends the
WhatsApp acknowledgement.

### Generate the daily report
```bash
python3 -m fug.cli report daily
```

### Run due follow-ups
```bash
python3 -m fug.cli followups
```

### Generate a content package
```bash
python3 -m fug.cli content --platform youtube --topic "Term insurance basics"
```

### Read-only SEO audit
```bash
python3 -m fug.cli seo
```

### Serve the intake webhook (fallback / dev)
```bash
python3 -m fug.cli serve --port 8080
# POST JSON to /webhook/lead (add X-Intake-Secret if INTAKE_SECRET is set)
```

## Driving via n8n

Import the workflows from `automation/workflows/n8n/` (WF-01 … WF-15) into n8n, then point the
HTTP Request nodes at the FUG intake URL and set the credential placeholders. The workflows are
the intended production wiring; the Python orchestrator is the Master Agent they call.

## Tests
```bash
cd automation
python3 -m unittest discover -s tests -v   # 30 tests
```

## Approvals workflow

1. Content/social publish creates an `Approvals` record (`DRAFT`).
2. With `AUTO_PUBLISH=false` it requires human review (`HUMAN_REVIEW`).
3. Approve via the approval queue (WF-15) → `APPROVED` → `SCHEDULED` → `PUBLISHED`.
4. Rejections → `REJECTED`. Failures → `FAILED` (handled by Error agent).

## Recovery / troubleshooting

* **Check BLOCKED integrations:** `python3 -m fug.cli status`
* **Review errors:** open `Errors` table / `docs/CREDENTIALS.md`
* **Retry policy:** the Error agent auto-retries only transient causes (network, rate-limit), up to
  `MAX_RETRIES`, then notifies an admin — never an infinite loop.

## Going live

To go live with real sends/publishes:
1. Supply the credentials in `docs/CREDENTIALS.md`.
2. Set `FUG_DRY_RUN=false`.
3. Leave `AUTO_PUBLISH=false` until you explicitly enable auto-publishing.
4. Keep `.env` out of version control (already in `.gitignore`).
