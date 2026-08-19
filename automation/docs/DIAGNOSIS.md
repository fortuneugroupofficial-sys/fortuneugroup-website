# Fortune U Group — AI Agent Failure Diagnosis & Insurance Migration Plan

Scope: existing live n8n workflow (`Webhook → NocoDB Create Row → AI Agent → OpenAI Chat
Model → Code/JS → WhatsApp → Meeting → NocoDB Update → Admin/Customer notifications`).

> **Ground truth note:** this sandbox cannot reach the live Contabo VPS (`n8n.fortuneugroup.in`
> / `crm.fortuneugroup.in` resolve to `169.58.67.175` but HTTPS is blocked from here, and there
> are no SSH/API credentials). Therefore everything marked **[VERIFIED]** below comes from the
> repo (the website source I can read). Everything marked **[NEEDS LIVE DATA]** requires the
> read-only export described at the end before I can state the *exact* failing node/error.
> I have NOT modified anything.

---

## A. Current system status

| Item | Status | Evidence |
|---|---|---|
| Website (static insurance site) | **[VERIFIED]** exists in repo | `index.html`, `health.html`, `services.html`, `tools.html`, `contact.html` |
| Lead form on static site | **[VERIFIED]** | `contact.html` fields: `name, mobile, email, city, goal, message` (+ `source` added in `js/site.js`) |
| Webhook target (static site) | **[VERIFIED]** | `js/config.js` → `https://n8n.fortuneugroup.in/webhook/book-consultation` |
| Legacy React "product" frontend | **[VERIFIED]** exists (may be what's live) | `frontend/` — `LeadForms.jsx`, `lib/api.js` |
| n8n | **UNREACHABLE from sandbox** | `HTTP 000`; needs live export |
| NocoDB/CRM | **UNREACHABLE from sandbox** | `HTTP 000`; user confirms NocoDB save works |
| Master AI Agent (new system) | **UNRELATED to the live workflow** | it is the new modular engine; live flow is the existing n8n one |

## B. What is working
- Website form(s) submit to the n8n webhook.
- NocoDB Create Row (user confirms): leads saved successfully; n8n container reaches NocoDB.

## C. What is failing
- Downstream: **AI Agent / OpenAI Chat Model** step is failing or stopping after the website
  changed to Insurance. (WhatsApp/email/meeting previously worked; now gated behind this node.)

## D. Exact root cause — [NEEDS LIVE DATA] to confirm, top hypothesis below
The most likely cause, given "website changed from Product → Insurance" and "NocoDB save works
but the next node fails", is a **schema/expression mismatch at the AI Agent node**:

1. **[MOST LIKELY]** The AI Agent's **input expression / Structured Output Parser / prompt** still
   reference **old Product-page fields** (e.g. `$json.financial_goal`, `$json.coverageRequirement`,
   `$json.monthlyIncome`, `$json.sipBudget`, `$json.insuranceType`, `$json.familyMembers`). The new
   Insurance payload does **not** contain those keys → the expression resolves to `undefined/null`,
   OpenAI receives empty/malformed input, or the parser gets JSON that doesn't match → node errors
   and the workflow stops.
2. The **Structured Output Parser** schema keys no longer match the lead data → parse failure.
3. **Prompt** still instructs the agent to act on the old Product context; with empty fields it
   returns an unusable/empty response that later Code/JS nodes choke on.
4. A **Code/JavaScript** node downstream uses an old field (`$json.financial_goal`) that is now
   missing → throws `TypeError` and stops.
5. Credential/model: possible but less likely (user says the automation "previously working");
   still must rule out via execution error + credential test. If the model name is
   invalid/legacy or the API key expired, that is a separate, easy fix.
6. Token/input too large or malformed JSON from the new form.

**I will not assert a single root cause as fact until I see the live execution error.** The
leading hypothesis (1) is fully consistent with your description.

## E. Old Product-related dependencies (found in the repo) — [VERIFIED]
`frontend/src/lib/api.js` maps and sends **Product-era fields**:
- webhooks: `/webhook/insurance`, `/webhook/sip`, `/webhook/ai-chat`, `/webhook/book-consultation`
- payload keys: `type, timestamp, name, mobile, email, city, financial_goal, message,
  insuranceType, monthlyIncome, sipBudget, age, familyMembers, coverageRequirement`

`frontend/src/components/LeadForms.jsx`:
- `InsuranceForm` sends `{name, mobile, age, familyMembers, coverageRequirement}` → `/webhook/insurance`
- `SIPRequestForm` sends `{name, mobile, monthlyIncome, sipBudget, financialGoal}` → `/webhook/sip`
- `ConsultationForm` sends `{name, mobile, email, city, financial_goal}` → `/webhook/book-consultation`

**If any of these keys are referenced in the AI Agent input expression / parser / Code nodes,
they are now stale for a pure-Insurance lead.**

## F. New Insurance-related requirements — [VERIFIED vs repo] + recommended
The **current static Insurance site** already sends the essential lead fields:
`source, name, mobile, email, city, goal, message` (goal ∈ {Health, Term/Life, General/Motor,
SIP, Other}). Recommended richer insurance capture (proposed; only add if the live form has them):

| Recommended field | Repo static form? | Legacy React form? |
|---|---|---|
| Name | ✅ `name` | ✅ `name` |
| Mobile | ✅ `mobile` | ✅ `mobile` |
| Email | ✅ `email` | ✅ |
| City | ✅ `city` | ✅ |
| Insurance Type (goal) | ✅ `goal` | ✅ `insuranceType` (via type) |
| Age | ❌ (in health calc, not form) | ✅ `age` |
| Family members | ❌ | ✅ `familyMembers` |
| Existing insurance | ❌ | ❌ |
| Required coverage | ❌ | ✅ `coverageRequirement` |
| Preferred callback time | ❌ | ❌ |
| Requirement/message | ✅ `message` | ✅ |
| Lead source | ✅ `source` | ❌ (has `type`) |
| Source page/URL | ❌ | ❌ |

## G. Nodes/configurations that need modification (proposed; [NEEDS LIVE DATA] to finalize)
1. **AI Agent → input expression**: bind to the new insurance fields (`goal`, `message`, `name`,
   `mobile`, `age`, `familyMembers`, `coverageRequirement` as available) instead of old product keys.
2. **AI Agent → prompt/instructions**: switch to the Insurance classifier (see Phase 5 below).
3. **Structured Output Parser** (if present): update keys to the insurance schema.
4. **Code/JavaScript** node(s): update any old-field references.
5. **NocoDB Update Row** (status): ensure it writes to an insurance-aligned status field.
6. **OpenAI Chat Model** node: verify model name + credential validity (rule out) — do NOT recreate
   credential unless genuinely invalid.

## H. What will NOT be changed (per your constraints)
- No deletion/recreation of workflows, credentials, NocoDB tables/columns/records.
- No reinstall of n8n/NocoDB, no VPS/DNS/reverse-proxy changes, no new containers.
- Working WhatsApp + email credentials are preserved.
- Existing lead data untouched.

## I. Risk level of each proposed change
| Change | Risk | Mitigation |
|---|---|---|
| AI Agent input expression update | LOW–MED | Duplicate workflow; test on TEST lead; only touch the expression |
| Prompt/instructions rewrite | LOW | Preserve working creds; keep output contract stable |
| Structured Output Parser keys | LOW–MED | Match exactly what the LLM is asked to return |
| Code/JS field references | MED | Only the affected lines; verify with test execution |
| NocoDB Update Row | LOW | Additive only |
| OpenAI model/credential | LOW | Do not recreate unless invalid; verify with a direct test |

## J. Final proposed architecture (unchanged backbone, insurance-aligned)
```
CURRENT WEBSITE (insurance form)
  → n8n Webhook (book-consultation)
  → Validate/Normalize lead data  (new small step; optional)
  → NocoDB Create Row  [KEEP — working]
  → AI Agent + OpenAI Chat Model  [FIX — insurance prompt + correct input]
      → classify insurance type, summarize requirement, set priority,
        draft customer + admin messages (NO quotes/premiums/coverage claims)
  → Code/JS (assemble payloads)  [FIX any old-field refs]
  → WhatsApp Customer / WhatsApp Admin  [KEEP]
  → Customer Email / Admin Email  [KEEP]
  → Meeting/Callback if required  [KEEP]
  → NocoDB Update Row (status/follow-up)  [KEEP, insurance-aligned]
```

## Phase 5 — Insurance classification logic (ready to apply, pending approval)
The AI Agent will classify only from available lead data and **never invent quotes, benefits,
premiums or coverage**:
- **Health Insurance** — general health cover
- **Family Health Insurance** — floater, family members > 1
- **Individual Health Insurance** — single member
- **Senior Citizen Health Insurance** — age ≥ 60
- **Term Insurance** — life/term goal
- **Other** — anything else / SIP (post-ARN)

Output contract (JSON) the parser/code will consume:
```
{
  "insurance_type": "HEALTH|FAMILY_HEALTH|INDIVIDUAL_HEALTH|SENIOR_HEALTH|TERM|OTHER",
  "summary": "short requirement summary",
  "priority": "LOW|MEDIUM|HIGH",
  "customer_message": "plain, no claims",
  "admin_message": "lead details for advisor",
  "needs_callback": true|false
}
```

---

## The single next action required
I need a **read-only export** of the live stack to confirm the exact failing node + error and the
real NocoDB columns (I will not guess). Run this **on the Contabo VPS** (it only reads and exports,
never modifies; secrets are hidden) and send me the `fug-export/` folder:

```bash
cd /path/on/vps
curl -sSL https://raw.githubusercontent.com/fortuneugroupofficial-sys/fortuneugroup-website/arena/01a019c9-fortuneugroup-website/automation/ops/export_live_stack.sh -o export_live_stack.sh
bash export_live_stack.sh
```

It collects: the full n8n workflow JSON(s) (via `n8n export:workflow --all`, or REST), the last 20
executions (including the failed run's error), and the NocoDB schema — everything needed to pin the
exact node and message. Once received, I will finalize D/G and apply the minimal approved fix.

> If you prefer not to run a script, the equivalent manual export is: n8n **Workflow → … → Export
> JSON**, the failing **Execution → error text**, and the NocoDB **Leads table column list**. No
> values from those need to be typed into chat beyond the error message and column names.
