# Fortune U Group — Social Publishing Credentials (WF-07 / WF-08 / WF-09 / WF-10)

This is the **exact** list of credentials needed for the content → approval → publish flow, how to
create each one, and how to connect them to your existing n8n at `n8n.fortuneugroup.in` (Contabo VPS).

> **Rule:** none of these go into workflow JSON or Git. They are stored as **n8n credentials**
> (encrypted at rest in n8n's database) or, for OAuth, as n8n OAuth2 credentials. The workflows only
> reference them **by name**.

---

## 0. Before anything — make sure n8n can encrypt credentials

On a self-hosted n8n, credentials are encrypted with `N8N_ENCRYPTION_KEY`. Check your Contabo
deployment (docker-compose or systemd) that this env var is set to a long random string. If it is not
set, set it **now** (before creating credentials), otherwise credentials cannot be encrypted/decrypted
consistently. Example: `N8N_ENCRYPTION_KEY=40+_random_characters`.

---

## 1. Summary — what you need

| # | Integration | What you get | Used by | n8n credential type (create in UI) |
|---|-------------|--------------|---------|-------------------------------------|
| 1 | **Gemini** | One API key string | WF-07 (content gen) | `Header Auth` |
| 2 | **Meta** (Facebook **and** Instagram share this) | One long-lived access token + Page ID + Instagram account ID | WF-09, WF-10 | `Header Auth` |
| 3 | **YouTube** | Google OAuth2 Client ID + Secret (n8n handles the token) | WF-08 | `YouTube OAuth2 API` |

**IDs you'll also need** (these are *not* secrets, but are required config):
- Meta **Page ID** (for Facebook posting)
- Meta **Instagram Business Account ID** (for Instagram posting)
- Your **n8n public base URL** = `https://n8n.fortuneugroup.in` (for webhooks + OAuth callback)

---

## 2. Gemini API key (for WF-07)

**What it is:** a server-side API key for Google's Gemini LLM.

**Steps:**
1. Go to **https://aistudio.google.com/app/apikey** (Google AI Studio) and sign in with the Google
   account you want to own the key.
2. Click **Create API key** → choose the project → copy the key (looks like `AIza...`).

**Where it goes (n8n):**
- n8n → **Credentials → Add credential → Search "Header Auth"** (type `httpHeaderAuth`).
- Name it: **`fortuneGemini`**
- **Name** field (header name) = `x-goog-api-key`
- **Value** field = paste the Gemini key (raw, no prefix)

**Used by:** WF-07 (the `HTTP Request → LLM Generate` node reads `{{ $credentials.fortuneGemini }}`).

**Test it independently (from anywhere):**
```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent" \
  -H "x-goog-api-key: AIza..." \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Reply with the single word: OK"}]}]}'
```
✅ Success = JSON response containing `"text": "OK"`.

---

## 3. Meta — Facebook + Instagram (for WF-09 + WF-10)

Both platforms use **one Meta app and one access token** (Instagram requires its account be a
**Professional** account linked to your Facebook Page).

### 3a. Prerequisites (hard requirements)
- Your Fortune U Group **Facebook Page** must exist and you must be its admin.
- Your **Instagram account must be a Business or Creator account** (Settings → Account type → switch
  to Professional) **and linked to the Facebook Page** (IG → Settings → Linked accounts).
- A **Meta Business** account (business.facebook.com) is strongly recommended.

### 3b. Create the app
1. Go to **https://developers.facebook.com/apps** → **Create app**.
2. Use case = **Business** (or "Other" → Business). Name it "Fortune U Group Automation".
3. Link it to your Business account and your Facebook Page.
4. In the app dashboard, add these products / use cases:
   - **Facebook Login for Business** (to get a user token) **or** use Graph API Explorer (step 3c).
   - **Instagram Graph API**
   - **Pages API / "Facebook Page"**

### 3c. Get a token + the IDs
Fastest path (fine for development/testing):

1. Open **Graph API Explorer** (https://developers.facebook.com/tools/explorer) → select your app.
2. In "User or Page" pick your **Page**, then click **Generate Access Token**.
3. In **Permissions**, add exactly these scopes (least privilege):
   - `pages_show_list`
   - `pages_manage_posts`
   - `pages_read_engagement`
   - `instagram_basic`
   - `instagram_content_publish`
   - `business_management`
4. Authorize. Copy the token (starts `EAAG...`).

**Get the IDs:**
```bash
# list your pages (find the numeric Page ID)
curl -s "https://graph.facebook.com/v21.0/me/accounts?access_token=EAAG..."
# find the Instagram Business Account ID attached to the page
curl -s "https://graph.facebook.com/v21.0/{PAGE_ID}?fields=instagram_business_account&access_token=EAAG..."
```

### 3d. Make the token long-lived (60 days)
```bash
curl -s "https://graph.facebook.com/v21.0/oauth/access_token" \
  -G --data-urlencode "grant_type=fb_exchange_token" \
  --data-urlencode "client_id={APP_ID}" \
  --data-urlencode "client_secret={APP_SECRET}" \
  --data-urlencode "fb_exchange_token=EAAG..."
```
Store the returned long-lived token (lasts ~60 days). Add a calendar reminder to refresh it.

> **App Review note:** in **Development mode**, the API only works for accounts that hold a role
> (admin/tester) on the app. That is fine for *testing the flow with your own accounts*. To publish
> publicly at scale you will need **App Review** for `instagram_content_publish` +
> `pages_manage_posts` and **Business Verification**. The automation itself is identical either way.

### 3e. Where it goes (n8n)
- n8n → **Credentials → Add credential → "Header Auth"**.
- Name it: **`fortuneMeta`**
- **Name** field = `Authorization`
- **Value** field = `Bearer ` + the long-lived token (i.e. `Bearer EAAG...`)

> I have written the workflows to add `Bearer ` themselves, so if you prefer you may put the raw token
> in the Value field instead. Pick ONE convention and use it consistently. (The guide below assumes
> Value = **raw token**, no `Bearer`.)

**Used by:** WF-09 (Instagram) and WF-10 (Facebook) read `{{ $credentials.fortuneMeta }}`.

### 3f. Test independently
```bash
# 1. token is valid
curl -s "https://graph.facebook.com/v21.0/me?fields=id,name&access_token=EAAG..."
# 2. Facebook: post to your page (test mode = draft/unpublished is fine)
curl -s -X POST "https://graph.facebook.com/v21.0/{PAGE_ID}/feed" \
  --data-urlencode "message=Test from API" \
  --data-urlencode "access_token=EAAG..."
# 3. Instagram: create a media container (no publish — just tests the ID + scope)
curl -s -X POST "https://graph.facebook.com/v21.0/{IG_ACCOUNT_ID}/media" \
  --data-urlencode "image_url=https://your-domain.com/test.jpg" \
  --data-urlencode "caption=Test" \
  --data-urlencode "access_token=EAAG..."
```
✅ Success = a JSON `{ "id": "..." }` (a post ID / container ID). If you get a permissions error, the
scopes in 3c are missing.

---

## 4. YouTube (for WF-08)

### 4a. Google Cloud setup
1. Go to **https://console.cloud.google.com** → create/select a project.
2. **APIs & Services → Library → enable "YouTube Data API v3"**.
3. **APIs & Services → OAuth consent screen** → External → add your own Google account as a test user.
4. **APIs & Services → Credentials → Create credentials → OAuth client ID → Web application**.
   - Copy the **Client ID** and **Client Secret**.
5. In **Authorized redirect URIs**, add exactly (n8n's callback):
   ```
   https://n8n.fortuneugroup.in/rest/oauth2-credential/callback
   ```
   (This exact string is shown inside the n8n credential form — copy it from there to avoid mismatch.)

### 4b. Connect in n8n (OAuth)
- n8n → **Credentials → Add credential → "YouTube OAuth2 API"** (if not present, use
  **"Google OAuth2 API"**).
- Name it: **`fortuneYouTube`**
- Paste Client ID + Client Secret.
- Click **Sign in with Google** → authorise with the channel owner account.
- n8n stores the token (and refreshes it automatically). **Scopes requested:** `youtube.upload`,
  `youtube.readonly`.

**Used by:** WF-08 reads `{{ $credentials.fortuneYouTube.oauthTokenData.access_token }}`.

### 4c. Test independently
```bash
curl -s "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true" \
  -H "Authorization: Bearer {ACCESS_TOKEN}"
```
✅ Success = HTTP 200 with your channel details. (You can read the live token inside the n8n
credential, or test upload directly from n8n after wiring.)

---

## 5. Non-secret config (environment variables on your n8n)

These are **not secrets** but are needed by the workflows. Add them to your n8n environment
(docker-compose env or systemd):

```
N8N_WEBHOOK_BASE=https://n8n.fortuneugroup.in     # used by WF-15 to dispatch to publish webhooks
META_PAGE_ID={numeric page id}                     # WF-10
META_IG_ACCOUNT_ID={numeric ig account id}         # WF-09
NOCODB_URL=...                                      # only if you want persistence/logging (optional for first test)
NOCODB_API_TOKEN=...                                # secret — keep in env, never in JSON
NOCODB_CONTENT_TABLE_ID=...
NOCODB_APPROVALS_TABLE_ID=...
NOCODB_SOCIALPOSTS_TABLE_ID=...
NOCODB_AUTOMATIONLOGS_TABLE_ID=...
```

> NocoDB is the persistence layer for Content / Approvals / SocialPosts / AutomationLogs. It is
> **optional for a first smoke test** of the flow (the workflows degrade gracefully and log a
> `BLOCKED`/`NOCODB_NOT_CONFIGURED` status instead of failing). CRM lead tables are out of scope.

---

## 6. Security checklist (do all of these)

- [ ] `N8N_ENCRYPTION_KEY` set on the server.
- [ ] Tokens live **only** in n8n credentials / server env — never in workflow JSON, Git, logs, or chat.
- [ ] Least privilege: only the scopes listed above (no `pages_manage_metadata`/`ads_*` extras).
- [ ] Instagram token is long-lived; a reminder exists to refresh before 60 days.
- [ ] Publishing stays **approval-gated** (`AUTO_PUBLISH=false`). No auto-publish.
- [ ] Test app/roles first in Development mode before any App Review.
- [ ] n8n editor has basic-auth / a strong password (it is internet-facing).

---

## 7. What to actually tell me / do next

1. Create the three credentials in n8n with the **exact names** `fortuneGemini`, `fortuneMeta`,
   `fortuneYouTube`.
2. Set the non-secret env vars (`META_PAGE_ID`, `META_IG_ACCOUNT_ID`, `N8N_WEBHOOK_BASE`).
3. Run the curl tests in sections 2, 3f, 4c and confirm they pass.
4. **Do not paste any token here.** Just tell me "credentials created + curl tests pass", and I'll
   finish wiring each workflow end-to-end and hand you the activation + test runbook.
