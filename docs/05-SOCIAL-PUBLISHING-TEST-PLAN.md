# Fortune U Group — Social Publishing Test Plan (WF-07/08/09/10/15)

This covers the complete flow **content generation → approval queue → platform publishing → logging**,
with human approval enabled by default. It is split into three layers:

1. **Logic mock test** (no credentials — run now, proves approval gate + routing + flagging).
2. **Per-credential smoke tests** (curl — proves each platform credential independently).
3. **End-to-end n8n test** (requires credentials wired into n8n).

---

## Layer 1 — Logic mock test (run now, no credentials)

```bash
cd automation/test
node social-flow-test.mjs
```

It mirrors the exact decision logic inside the workflow Code nodes and asserts:

| Test | What it proves |
|------|----------------|
| Content prompt builder | rejects unsupported platform / empty topic; builds compliance-safe prompt |
| Fact-check flagger | flags `[FACT_CHECK]` / non-empty `flags` → `fact_check: FLAGGED` |
| Approval gate | publish is **BLOCKED** without `APPROVED`/`approved:true`/`AUTO_PUBLISH` |
| Approval gate (auto-off) | `AUTO_PUBLISH=false` still blocks |
| Approval gate (approved) | `approval_status: APPROVED` passes the gate |
| Dispatch router | maps youtube/instagram/facebook → correct publish webhook path |
| Decision validator | rejects invalid decisions, accepts APPROVED/REJECTED |

All must print `PASS`. This is honest "test results" for the parts that do not require a live platform.

---

## Layer 2 — Per-credential smoke tests (curl)

Run each BEFORE wiring into n8n, so you know the credential is valid.

**Gemini**
```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent" \
  -H "x-goog-api-key: AIza..." -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Reply with the single word: OK"}]}]}'
```

**Meta token + IDs**
```bash
curl -s "https://graph.facebook.com/v21.0/me?fields=id,name&access_token=EAAG..."
curl -s "https://graph.facebook.com/v21.0/me/accounts?access_token=EAAG..."
curl -s "https://graph.facebook.com/v21.0/{PAGE_ID}?fields=instagram_business_account&access_token=EAAG..."
```

**Facebook publish (draft-safe test)**
```bash
curl -s -X POST "https://graph.facebook.com/v21.0/{PAGE_ID}/feed" \
  --data-urlencode "message=API connectivity test" --data-urlencode "access_token=EAAG..."
```

**Instagram container (no publish)**
```bash
curl -s -X POST "https://graph.facebook.com/v21.0/{IG_ACCOUNT_ID}/media" \
  --data-urlencode "image_url=https://your-domain.com/test.jpg" \
  --data-urlencode "caption=Test" --data-urlencode "access_token=EAAG..."
```

**YouTube (token check via n8n credential / curl with access token)**
```bash
curl -s "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true" \
  -H "Authorization: Bearer {ACCESS_TOKEN}"
```

---

## Layer 3 — End-to-end n8n test (after credentials wired)

### Setup
1. Import WF-07, WF-08, WF-09, WF-10, WF-15 into n8n.
2. Create credentials `fortuneGemini` (Header Auth), `fortuneMeta` (Header Auth),
   `fortuneYouTube` (YouTube/Google OAuth2). Re-assign on each HTTP node.
3. Set env vars: `META_PAGE_ID`, `META_IG_ACCOUNT_ID`, `N8N_WEBHOOK_BASE`,
   and (optional) NocoDB `NOCODB_*` table IDs + token for persistence/logging.
4. Keep `AUTO_PUBLISH=false`. Activate WF-07, WF-08, WF-09, WF-10, WF-15.

### Test sequence

**Step A — generate (should NOT publish anything):**
```bash
curl -s -X POST "https://n8n.fortuneugroup.in/webhook/content/generate" \
  -H "Content-Type: application/json" \
  -d '{"platform":"instagram","topic":"Why term insurance protects your SIP","content_type":"post"}'
```
Expected: `{ "status": "DRAFT", "fact_check": "...", "content_id": "...", "approval_id": "..." }`.
Confirm **nothing** appeared on Instagram (approval gate holds).

**Step B — reject path:**
```bash
curl -s -X POST "https://n8n.fortuneugroup.in/webhook/approval/decide" \
  -H "Content-Type: application/json" \
  -d '{"approval_id":"<id from A>","decision":"REJECTED","reviewed_by":"you"}'
```
Expected: `{ "decision": "REJECTED", "dispatched": false }`.

**Step C — direct publish attempt WITHOUT approval (must be BLOCKED):**
```bash
curl -s -X POST "https://n8n.fortuneugroup.in/webhook/instagram/publish" \
  -H "Content-Type: application/json" \
  -d '{"caption":"should be blocked","image_url":"https://example.com/x.jpg"}'
```
Expected: `{ "status": "BLOCKED", "skipped": true, "reason": "APPROVAL_REQUIRED" }`.

**Step D — approve → dispatch → publish:**
```bash
curl -s -X POST "https://n8n.fortuneugroup.in/webhook/approval/decide" \
  -H "Content-Type: application/json" \
  -d '{"approval_id":"<id from A>","decision":"APPROVED","reviewed_by":"you"}'
```
Expected: `{ "decision": "APPROVED", "dispatched": true }`, then WF-09 publishes to Instagram and
returns a `platform_post_id`. Verify the post appears (or check `SocialPosts`/`AutomationLogs`).

Repeat the equivalent for `facebook` and `youtube` (YouTube needs a `video_url` + the OAuth upload).

### Acceptance criteria
- [ ] A generate call never publishes anything on its own.
- [ ] A publish webhook call without approval returns `BLOCKED / APPROVAL_REQUIRED`.
- [ ] `AUTO_PUBLISH=false` keeps the gate closed even when content is approved-looking.
- [ ] APPROVED decision dispatches exactly once to the correct platform.
- [ ] Every step writes an `AutomationLogs` row (when NocoDB is wired).
- [ ] Successful publishes write a `SocialPosts` row with platform post ID + URL.

---

## Rollback / safety

- All publishing is reversible via the platform's own delete; nothing here deletes data.
- To fully halt publishing, deactivate WF-08/09/10 (or set the credentials' tokens to invalid) —
  the approval gate alone already prevents unapproved publishes.
- If a workflow fails mid-publish (e.g. container created but not published), re-run the specific
  publish webhook manually with the same payload; no orphan state is stored in CRM.
