# Fortune U Group — Autonomous Deployment Guide (YouTube / Instagram / Facebook)

This explains **exactly** what I can do for you automatically, what is blocked, and the one-time
setup that makes the rest fully hands-off. It also lists the only steps that genuinely require
*your* browser/account (OAuth consent) — nothing here asks you to send secrets in chat.

---

## 0. What I verified this session (honest status)

I audited access to your environment from this sandbox:

| Check | Result |
|-------|--------|
| DNS for `n8n.fortuneugroup.in` | ✅ resolves to Contabo IP (169.58.67.175) |
| TCP to VPS :443 and :5678 | handshake completes |
| HTTPS / HTTP to n8n from this sandbox | ❌ connection reset / TLS reset (`SSL_ERROR_SYSCALL`) |
| Outbound HTTPS to any host (e.g. google.com) | ❌ also reset — the sandbox has no open egress |
| SSH keys / n8n credentials in workspace | ❌ none |

**Conclusion:** this sandbox has **no usable network route to your Contabo VPS and no
authentication** to n8n. I therefore cannot click through your live n8n from here — and I will not
pretend otherwise.

What I *can* do is make the deployment **fully automatic from inside your own environment**, using a
self-hosted GitHub Actions runner on the VPS. After a one-time setup, every future change I make to
these workflows deploys automatically. That machinery is already built in this repo:

- `automation/deploy/deploy.sh` — imports workflows, creates credentials from secrets, sets
  Variables, activates, and smoke-tests the approval gate (idempotent).
- `.github/workflows/n8n-social-deploy.yml` — runs that script on your VPS runner.

---

## 1. One-time setup (you, ~15 minutes, no secrets in chat)

### 1a. Create an n8n API key
1. In n8n → **Settings → Users** → click your user → **API** section (or **Settings → API**).
2. **Create API key** → copy it (once).
3. In GitHub → this repo → **Settings → Secrets and variables → Actions → New repository secret**:
   - Name: `N8N_API_KEY` → paste the key.

> This is the **only** "password-like" value that ever needs to be stored. It goes in a GitHub
> secret, never in chat, never in the repo.

### 1b. Add your platform secrets (GitHub secrets, not chat)
- `GEMINI_API_KEY` — your Gemini key (aistudio.google.com/app/apikey).
- `META_ACCESS_TOKEN` — your long-lived Meta token (see `docs/04` §3).

### 1c. Add non-secret config (GitHub *variables*)
- `N8N_WEBHOOK_BASE` = `https://n8n.fortuneugroup.in`
- `META_PAGE_ID`, `META_IG_ACCOUNT_ID`

### 1d. Install a self-hosted runner on the VPS
On the Contabo VPS (as a normal user):
```bash
# from this repo's GitHub page: Settings -> Actions -> Runners -> New self-hosted runner
# run the 4 commands GitHub shows (download + configure), then:
sudo ./svc.sh install && sudo ./svc.sh start
# add the label "fortuneugroup" so the workflow's runs-on matches
```
The runner lets the workflow reach n8n at `http://localhost:5678` with no public exposure.

---

## 2. What happens automatically after setup

When you (or I) push a change — or you click **Actions → "n8n social publishing deploy" → Run
workflow** — the runner:

1. Imports WF-07, WF-08, WF-09, WF-10, WF-15 (idempotent).
2. Creates `fortuneGemini` + `fortuneMeta` Header Auth credentials **from the GitHub secrets**.
3. Sets Variables `N8N_WEBHOOK_BASE`, `AUTO_PUBLISH=false`, `META_PAGE_ID`, `META_IG_ACCOUNT_ID`.
4. Activates all five workflows.
5. Smoke-tests: a direct publish attempt must return `APPROVAL_REQUIRED` (gate holds);
   a generate call must return `DRAFT`/`BLOCKED` and never publish.

`AUTO_PUBLISH` stays `false` until the full end-to-end test passes **and** you explicitly approve.

---

## 3. Steps that genuinely require YOU (OAuth consent — "stop here")

These cannot be automated because the provider requires a human to log in and click **Allow**.

### 3a. YouTube (Google OAuth — one time)
1. Google Cloud Console → enable **YouTube Data API v3** → create **OAuth client ID** (Web app).
2. Authorized redirect URI (copy from the n8n credential form):
   `https://n8n.fortuneugroup.in/rest/oauth2-credential/callback`
3. In n8n → **Settings → Credentials → YouTube OAuth2 API** (or "Google OAuth2 API"):
   - Name it **`fortuneYouTube`** (exact name — the workflow references it).
   - Paste Client ID + Secret.
   - Click **Sign in with Google** → sign in as the channel owner → **Allow**.

After this single consent, n8n stores and auto-refreshes the token. I never see it.

### 3b. Meta / Facebook + Instagram
Two equivalent options — pick one:

**Option A (recommended): OAuth in n8n**
- n8n → **Credentials → Facebook Graph API** (or "Instagram Graph API") → connect with Facebook
  Login → consent with the account that admins the Page. If you use this, tell me and I'll switch
  WF-09/WF-10 to the OAuth credential reference instead of `fortuneMeta`.

**Option B: long-lived token (current default)**
- Generate the long-lived token yourself (see `docs/04` §3) and store it as the GitHub secret
  `META_ACCESS_TOKEN`. The deploy script then creates the `fortuneMeta` credential automatically.
- ⚠️ This token expires after ~60 days and must be refreshed manually.

### 3c. Gemini
- No OAuth. Generate the key in Google AI Studio and store it as `GEMINI_API_KEY` (GitHub secret).
- The deploy script creates the `fortuneGemini` credential from it automatically.

---

## 4. What to tell me (and what NOT to send)

**Tell me (safe):**
- "API key + secrets + variables added" — I'll trigger the deploy and walk through results.
- "runner installed" — I'll verify the Actions job reaches your n8n.
- "OAuth consent done for YouTube / Meta" — I'll switch references and re-run.
- Any smoke-test output (the `response:` lines are non-secret).

**Never send (in chat):** API keys, access tokens, client secrets, passwords, OTPs, or the n8n API
key. Those belong only in GitHub secrets or your n8n UI.

---

## 5. Current state summary

| Item | Status |
|------|--------|
| WF-07/08/09/10/15 logic + approval gate | ✅ built, 15/15 logic tests pass |
| Non-secret config moved to `$vars` (API-settable) | ✅ done |
| Deploy script + CI workflow | ✅ built (this commit) |
| Live n8n import/configure/activate | ⏳ automatic after §1 setup |
| YouTube OAuth | ⏳ your consent (§3a) |
| Meta (FB + IG) | ⏳ your token or OAuth (§3b) |
| End-to-end publish | ⏳ after §1–§3, approval-gated (`AUTO_PUBLISH=false`) |
