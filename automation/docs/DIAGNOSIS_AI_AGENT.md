# Read-only Diagnosis — AI Agent / OpenAI Chat Model stopped executing

> Scope: existing live n8n **Master Lead Automation** workflow
> `Webhook → NocoDB Create Row → AI Agent → OpenAI Chat Model → Code/JS → WhatsApp → Meeting → NocoDB Update → Admin/Customer notifications`.
> Nothing has been modified. No fix applied. Waits for approval.

## Access statement (must be explicit)
This sandbox cannot reach the live Contabo VPS: `n8n.fortuneugroup.in` and `crm.fortuneugroup.in`
resolve to `169.58.67.175` but return `HTTP 000` from here, and there are no SSH/API credentials.
I therefore **cannot read the live execution logs or node JSON directly**. The "exact error"
cannot be truthfully stated until I see the failed execution's error line. Everything below marked
**[FACT]** is verified (repo + your stated facts); everything marked **[HYPOTHESIS]** is ranked
reasoning that the execution log will confirm or reject. I will not fake the answer.

## Facts established (accepted as true)
- n8n and NocoDB running; n8n on `nocodb_default` network.
- From n8n container: `http://nocodb:8080` → 200; `http://nocodb:8080/api/v1/health` → 200.
- `.../api/v1/...` (data) → **401 "Authentication required - Invalid token"** when hit without a valid token.
- The n8n **NocoDB credential** shows "Connection tested successfully", and **Leads are being
  saved** (so the Create Row path uses a valid token).
- Downstream (AI Agent / OpenAI / WhatsApp / email / meeting) previously worked; now the AI
  Agent / OpenAI step no longer executes after a lead is created.
- Website changed: old **Product** page → **Insurance** page.

## The one clue that matters most
**FACT — the website payload shape changed.** The current static Insurance site
(`contact.html` + `js/site.js`) posts exactly:
`source, name, mobile, email, city, goal, message`
(goal ∈ Health / Term-life / General-motor / SIP / Other).

The **old Product-era payload** (legacy `frontend/` → `lib/api.js` + `LeadForms.jsx`) used a
different, richer set: `type, financial_goal, insuranceType, monthlyIncome, sipBudget, age,
familyMembers, coverageRequirement, message`.

Verified via repo grep: `financial_goal`, `coverageRequirement`, `monthlyIncome`, `sipBudget`,
`insuranceType`, `familyMembers` appear **only** in the legacy `frontend/` code — **not** in the
static Insurance site. `age` appears only in the health calculator, not the lead form.

So if any node **after** the webhook (especially the AI Agent input expression, the Structured
Output Parser, or a downstream Code node) reads `$json.financial_goal` / `$json.age` /
`$json.familyMembers` / `$json.coverageRequirement` / `$json.insuranceType`, those now resolve to
**undefined/null** → the AI Agent receives an empty or malformed prompt, or the parser rejects the
output, or a Code node throws → **execution stops right there** while the earlier NocoDB Create Row
(which doesn't depend on those keys) succeeds.

## A–E (ranked; the exact error line will finalize)

### A. Exact failure point — [NEEDS LOG to be certain; leading candidate below]
- **Highest likelihood:** the **AI Agent node** (or its input expression / Structured Output
  Parser) is the first node that depends on a now-missing Product-era field, so it is where the run
  stops — *after* NocoDB Create Row, *before* Code/WhatsApp/email.
- Runner-up: the **OpenAI Chat Model** node errors because the AI Agent sent it an empty/malformed
  prompt or the model/credential is stale.
- Confirm via the failed Execution → open it → the last green node and the first red node with the
  tooltip error. That single error line is what I need.

### B. Exact error — [NEEDS the execution log line]
Expected candidates (in order) that the log will show:
1. `Cannot read properties of undefined (reading 'financial_goal' / 'familyMembers' / 'coverageRequirement')` (Code/JS) or an empty `$json` reaching the AI Agent (expression returns nothing).
2. OpenAI `401 invalid_api_key` / `404 model_not_found` / `400` malformed request (if the credential/model is the issue, not the fields).
3. Parser/validation failure if a Structured Output Parser is present and keys no longer match.
4. A **separate** NocoDB auth 401 (see below) if a *non-Create-Row* node uses a different/invalid token.

### C. Root cause — ranked
1. **[HYPOTHESIS, most likely]** Schema/field mismatch from Product→Insurance: AI Agent input
   expression, Structured Output Parser, and/or downstream Code node still reference old Product
   fields the new Insurance payload no longer sends. This perfectly explains "lead saved, AI Agent
   stopped."
2. OpenAI credential/model issue (must rule out): expired key or a model name that is no longer
   valid. Do **not** recreate the credential unless this is confirmed as the only cause.
3. **The 401 "Invalid token" clue:** that 401 is expected for an unauthenticated `curl` — but if a
   node other than Create Row (e.g., an AI-Agent tool, a NocoDB lookup, a status update) uses a
   **different** NocoDB credential with a bad token, it will fail with 401. Check whether the
   failing node is a NocoDB node using the *same* working credential or a separate one.

### D. Safest minimal fix — proposed, NOT applied
1. **Update the AI Agent input expression** to bind to the actual Insurance payload keys:
   `name, mobile, email, city, goal, message, source` (and `age/familyMembers/coverageRequirement`
   only if present).
2. **Rewrite the AI Agent prompt** to the Insurance classifier (classify Health / Family Health /
   Individual Health / Senior Citizen Health / Term / Other; **never invent quotes, premiums,
   benefits or coverage**; output only from available data).
3. **Update the Structured Output Parser** (if present) to the insurance JSON contract.
4. **Fix any Code/JS** reference to old fields (only the affected lines).
5. **Verify** the OpenAI model name + credential (no recreation unless genuinely invalid).
6. **Verify** any non-Create-Row NocoDB node uses the same working credential (not a stale token).
All of this is **additive/edits to existing nodes** — no new workflow, no deleted data/creds, no new
containers, no VPS/network/proxy changes, WhatsApp/email credentials untouched.

### E. Exact node/credential/field to change (to confirm before editing)
- **Node:** `AI Agent` (primary) → its **input expression** and **prompt**; if present also
  `Structured Output Parser`.
- **Fields (old → new):** `financial_goal → goal` (or `insuranceType`), `coverageRequirement →
  message` fallback, `familyMembers / age / monthlyIncome / sipBudget` → optional insurance fields
  or drop, `insuranceType → goal`.
- **Downstream:** `Code/JS` node(s) referencing the above keys; `NocoDB Update Row` status field.
- **Credentials to check (not recreate):** `OpenAI Chat Model` (model name + key validity),
  every `NocoDB` node uses the working credential (the one showing "Connection tested
  successfully").

## What I need from you (one thing) to finalize A & B exactly
Paste the **failed Execution's exact error text** for the most recent insurance lead (n8n →
Executions → failed run → the first red node → error tooltip). Ideally also the **workflow JSON**
or the automated read-only export:
```bash
bash automation/ops/export_live_stack.sh   # on the VPS; read-only; secrets hidden
```
That gives me the workflow + last 20 executions + NocoDB schema. With the error line I will state
the exact failure point and error with certainty, finalize D/E, and present the precise minimal
change for your approval — no changes until you say go.
