# Runbook — Remove Auggie dependency, use the official OpenAI API

Goal: make the n8n **AI Agent** call the **official OpenAI API** directly, with **no Auggie
CLI / AUGGIE_BIN / Auggie login / OmniRoute**, while keeping n8n, NocoDB, nginx-proxy-manager,
OmniRoute (only if something else needs it), domains, SSL, workflows, credentials, data, volumes,
WhatsApp, webhooks, and the lead-management flow intact.

> **IMPORTANT — run on the VPS, not here.** This sandbox cannot reach the Contabo VPS. The
> scripts below are safe defaults: **audit/export/backup are read-only**; only `04` writes
> (patching the AI/OpenAI nodes + creating an official credential, both by your explicit run);
> `07` is dry-run unless you pass `--commit`. Nothing ever deletes volumes, data, containers,
> or unrelated workflows. No secrets are printed or committed.

## Step 1 — AUDIT (read-only)
```bash
cd /path/on/vps
bash automation/ops/auggie_removal/01_audit.sh        # docker ps/networks/volumes/env(names)/proxy
bash automation/ops/auggie_removal/02_n8n_export.sh   # workflows + credentials metadata; shows model/BaseURL
```
This tells us: which container is n8n, its network, which container/port is NocoDB, and exactly
how the OpenAI node is configured (model `aug/gpt5.6-luna`, Base URL → OmniRoute/Auggie).

## Step 2 — BACKUP (before any change)
```bash
bash automation/ops/auggie_removal/03_backup.sh
```
Timestamped backups of compose files, n8n workflows+credentials metadata, nginx-proxy-manager and
OmniRoute config dirs. Volumes are untouched.

## Step 3 — Set official OpenAI credential (secrets in env only)
On the VPS shell (NOT in any file/repo/chat):
```bash
export OPENAI_API_KEY='sk-...'     # your official OpenAI key (never print it)
export N8N_API_KEY='...'           # n8n API key (Settings → API) so the script can create the credential
export OPENAI_MODEL='gpt-4o-mini'  # optional; default
```

## Step 4 — Apply the switch (patches ONLY the AI/OpenAI nodes)
```bash
# first list which workflows contain the AI/OpenAI node:
bash automation/ops/auggie_removal/02_n8n_export.sh
# then patch the right exported workflow file and import it:
python3 automation/ops/auggie_removal/04_apply_official_openai.py \
  --workflow fug-n8n-export/workflows/<the_lead_workflow>.json
```
What it does (verified against `/v1/models`, no invented model):
- Lists real supported model names; refuses any `aug/` alias.
- Uses a supported official model (`gpt-4o-mini` default; override with `OPENAI_MODEL`).
- Creates/reuses an n8n **"OpenAI Official"** credential with base URL `https://api.openai.com/v1`.
- Sets the node model + credential id; strips any `aug/` prefix / OmniRoute base URL override.
- Upserts the **same workflow id** — all other nodes (NocoDB, WhatsApp, email, meeting, webhooks)
  are left byte-for-byte intact.

> If you prefer the GUI: edit the OpenAI Chat Model node → model to the verified official name,
> credential → the OpenAI credential with the official Base URL. Same end state.

## Step 5 — AI Agent prompt (insurance-aligned, already ready)
Set the AI Agent's system prompt to the classifier in `insurance_agent_prompt.md`. It classifies
Health / Family Health / Individual Health / Senior Citizen Health / Term / Other and **never
invents quotes, premiums, benefits, or coverage** — outputs only from the lead data, returning
the same structured JSON the downstream Code/NocoDB-update nodes expect.

## Step 6 — Restart only n8n
```bash
bash automation/ops/auggie_removal/05_restart_n8n.sh
```
Restarts **only n8n**. No VPS reboot; NocoDB/nginx-proxy-manager/OmniRoute untouched.

## Step 7 — End-to-end TEST
```bash
bash automation/ops/auggie_removal/06_test_lead.sh
```
Posts a clearly-marked `TEST-Lead-AuggieRemoval` insurance lead through the webhook. Then confirm
in n8n → Executions that the run completed with: **no "Auggie CLI not found", no 502**, OpenAI node
green, NocoDB create + update green. Re-run `02_n8n_export.sh` and grep the latest run for
`auggie`/`502` to auto-verify.

## Step 8 — Verify containers
```bash
docker ps
```
All of n8n, NocoDB, nginx-proxy-manager (and OmniRoute if it must stay) healthy/running.

## Step 9 — Cleanup (dry-run first; only after everything passes)
```bash
bash automation/ops/auggie_removal/07_cleanup_auggie.sh        # report-only
bash automation/ops/auggie_removal/07_cleanup_auggie.sh --commit  # only env-ref removal, never containers/volumes
```
OmniRoute is **not** removed unless a read of Step 1 confirms nothing else depends on it. No
volumes, n8n/NocoDB data, or npm config are ever deleted.

## Final report template (fill and send back)
- **A. What was wrong:** AI Agent routed to `aug/gpt5.6-luna` via Auggie gateway → missing `auggie`
  CLI → HTTP 502.
- **B. What changed:** [workflow id] OpenAI node model → [official model], credential → "OpenAI Official"
  base URL `https://api.openai.com/v1`; n8n restarted.
- **C. Architecture:** n8n AI Agent → OpenAI Chat Model → official OpenAI API → [model].
- **D. Model in use:** [e.g. gpt-4o-mini] (verified via /v1/models).
- **E. Auggie removed from AI path:** yes/no.
- **F. OmniRoute still required:** yes/no (only if another service needs it).
- **G. Containers running:** [docker ps]
- **H. Test result:** [pass/fail; no Auggie, no 502]
- **I. Commands/config changed:** [list; keys never shown]
- **J. Remaining issues:** [none or list]
