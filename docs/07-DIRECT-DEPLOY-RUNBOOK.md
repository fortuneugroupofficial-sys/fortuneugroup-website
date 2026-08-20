# Fortune U Group — Direct Deploy Runbook (YouTube + Instagram + Facebook)

This is the step-by-step path using **`deploy.sh` directly** — no GitHub Actions, no
`workflows` permission needed. Everything runs **on your Contabo VPS** where n8n is at
`http://localhost:5678`.

**Ground rules:**
- You never paste a secret into chat. Secrets are typed into your VPS terminal (hidden input) and
  stored in a root-owned, chmod-600 file.
- `AUTO_PUBLISH` stays **`false`** through this entire runbook. It is only flipped (optionally) at
  the very end, after all three platforms pass and you explicitly choose to.

---

## Phase 0 — one-time prerequisites on the VPS

SSH into your Contabo VPS as a user that can `sudo` (or as root).

```bash
# 0.1 install the two small tools the scripts need
sudo apt-get update -y && sudo apt-get install -y curl jq git

# 0.2 get the latest automation code onto the VPS (any path; ~/workspace is fine)
cd ~ && rm -rf fortuneugroup-automation 2>/dev/null || true
git clone --branch arena/01a01cc8-fortuneugroup-website \
  https://github.com/fortuneugroupofficial-sys/fortuneugroup-website.git fortuneugroup-automation
cd fortuneugroup-automation/automation
```

> Re-run the `git clone`/`git pull` whenever I tell you I've updated the workflows.

---

## Phase 1 — create the n8n API key (no secret in chat)

1. In your browser open `https://n8n.fortuneugroup.in` → log in.
2. **Settings → Users** (or **Settings → API**) → select your user → **Create API key**.
3. Copy it once. **Do not send it to me.** You will type it into the terminal in Phase 2.

> You'll also need, ready to paste into the terminal (NOT chat) during Phase 2:
> - **Gemini key** — https://aistudio.google.com/app/apikey → Create API key.
> - **Meta long-lived token** — from `docs/04-SOCIAL-PUBLISHING-CREDENTIALS.md` §3 (Graph API
>   Explorer → generate → `fb_exchange_token` to make it long-lived). Keep the token in your
>   clipboard.

---

## Phase 2 — store secrets securely (terminal, hidden input)

On the VPS, in the `automation` directory:

```bash
bash deploy/bootstrap-secrets.sh
```

It asks (hidden, nothing echoed):
- **n8n admin API key** → paste the key from Phase 1.
- **Gemini API key** → paste.
- **Meta long-lived access token** → paste.

Then (visible, non-secret):
- **n8n webhook base URL** → `https://n8n.fortuneugroup.in`
- **Facebook Page ID** → numeric ID (from `docs/04` §3c).
- **Instagram Business Account ID** → numeric ID (from `docs/04` §3c).

Result: a chmod-600 file at `/etc/fortuneugroup/secrets.env` (root) or
`~/.fortuneugroup/secrets.env` (non-root). Confirm with:
```bash
ls -l /etc/fortuneugroup/secrets.env    # (path may differ — the script prints it)
```

---

## Phase 3 — deploy (import + credentials + variables + activate)

```bash
N8N_BASE_URL=http://localhost:5678 bash deploy/deploy.sh
```

This, in one shot:
1. Imports **WF-07, WF-08, WF-09, WF-10, WF-15** (idempotent).
2. Creates/updates credentials **`fortuneGemini`** and **`fortuneMeta`** from the secrets file.
3. Sets variables `N8N_WEBHOOK_BASE`, `AUTO_PUBLISH=false`, `META_PAGE_ID`, `META_IG_ACCOUNT_ID`.
4. Activates all five workflows.
5. Smoke-tests the approval gate — expects `APPROVAL_REQUIRED` on a direct publish.

**Expected end-of-run lines:**
```
OK   approval gate BLOCKED the unapproved publish (correct)
==>  deploy complete. AUTO_PUBLISH=false (publishing stays human-approved).
```

**Report back to me (non-secret):** "Phase 3 done — gate blocked" and any `WARN`/`FAIL` lines you saw.

---

## Phase 4 — OAuth / consent (the only browser steps — "stop here")

These cannot be automated; they require your account login + clicking **Allow**.

### 4a. YouTube (one time)
1. Google Cloud Console → enable **YouTube Data API v3** → **Credentials → Create OAuth client ID**
   (Web application).
2. Authorized redirect URI (copy exactly from the n8n credential form):
   `https://n8n.fortuneugroup.in/rest/oauth2-credential/callback`
3. In n8n → **Settings → Credentials → YouTube OAuth2 API** (or "Google OAuth2 API"):
   - Name it **`fortuneYouTube`** (exact — the workflow references this name).
   - Paste Client ID + Secret → **Sign in with Google** → choose the channel owner → **Allow**.

### 4b. Meta (Facebook + Instagram)
You already stored the long-lived token in Phase 2, so **no further Meta OAuth is required** for the
current `fortuneMeta` (Header Auth) setup. If you prefer OAuth instead, connect a **Facebook Graph
API** credential in n8n and tell me — I'll switch WF-09/10 to reference it.

> Note: `fortuneMeta` (long-lived token) expires after ~60 days and must be refreshed by re-running
> `bootstrap-secrets.sh` + `deploy.sh`. OAuth would auto-refresh; say the word if you want to switch.

**Report back:** "YouTube OAuth done" (no other details needed).

---

## Phase 5 — end-to-end test (approval-gated)

Prepare two public test assets (any public HTTPS URL Meta/Google can fetch):
- `TEST_IMAGE_URL` — a small `.jpg/.png` (for Instagram).
- `TEST_VIDEO_URL` — a tiny `.mp4` (for YouTube; it will upload as **private**, so nothing is public).

```bash
TEST_IMAGE_URL="https://<your-public-image-url>" \
TEST_VIDEO_URL="https://<your-public-video-url>" \
bash deploy/test-e2e.sh
```

The script verifies:
1. **Gate** — direct publish without approval returns `APPROVAL_REQUIRED` on all 3 platforms.
2. **Generation** — `/content/generate` returns `DRAFT` + `fact_check` (never publishes).
3. **Publish** — Instagram, Facebook, YouTube each return `status: PUBLISHED` + a platform post ID.

It prints a summary and exits non-zero on any failure. **It never changes `AUTO_PUBLISH`.**

**Report back:** the summary block (e.g. `PASS  instagram publish` … and any `FAIL`/`WARN` lines with
their JSON). This is non-secret.

---

## Phase 6 — (optional, only after you approve) enable auto-publish

Only if **all three** Phase 5 publish checks passed and you have reviewed the test posts:

```bash
AUTO_PUBLISH=true ALLOW_AUTO_PUBLISH=1 bash deploy/deploy.sh
```

Until you run this, every publish remains human-approved regardless of any other setting.

---

## What happens automatically when I update the workflows

I'll tell you "pull + redeploy", then you run:
```bash
cd ~/fortuneugroup-automation && git pull && cd automation && N8N_BASE_URL=http://localhost:5678 bash deploy/deploy.sh
```
The deploy is idempotent, so this is always safe to re-run.

---

## Status board

| Step | Owner | State |
|------|-------|-------|
| Workflows + gate + `$vars` + scripts | me | ✅ done, in repo |
| Phase 0–3 (prereqs, secrets, deploy) | you (VPS) | ⏳ awaiting your run |
| Phase 4 (YouTube OAuth) | you (browser) | ⏳ |
| Phase 5 (E2E test) | you (VPS) → report to me | ⏳ |
| Phase 6 (auto-publish) | you, after approval | ⏳ blocked by design |
