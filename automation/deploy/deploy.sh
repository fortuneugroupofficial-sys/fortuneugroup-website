#!/usr/bin/env bash
# =============================================================================
# Fortune U Group — n8n social publishing deployer (idempotent)
# -----------------------------------------------------------------------------
# Imports WF-07/08/09/10/15, creates Header Auth credentials from secrets,
# sets non-secret Variables, activates workflows, and smoke-tests the approval
# gate. Runs against any n8n reachable over HTTP(S) using the public REST API.
#
# Designed to run either:
#   * on the Contabo VPS itself (a self-hosted GitHub Actions runner), or
#   * from any machine with network access to n8n.
#
# Secrets are read from ENVIRONMENT VARIABLES ONLY — never hard-coded, never in
# workflow JSON, never in Git.
#
# Required env:
#   N8N_BASE_URL        e.g. http://localhost:5678  or  https://n8n.fortuneugroup.in
#   N8N_API_KEY         n8n admin API key (Settings -> Users -> ... -> API)
#   N8N_WEBHOOK_BASE    public webhook base, e.g. https://n8n.fortuneugroup.in
# Optional secrets (create the matching n8n credentials if present):
#   GEMINI_API_KEY      -> fortuneGemini  (Header Auth: x-goog-api-key)
#   META_ACCESS_TOKEN   -> fortuneMeta    (Header Auth: Authorization; raw token)
# Optional non-secret config:
#   META_PAGE_ID, META_IG_ACCOUNT_ID
#   AUTO_PUBLISH        default "false"
#
# Usage:
#   N8N_BASE_URL=... N8N_API_KEY=... bash deploy.sh
# =============================================================================
set -euo pipefail

: "${N8N_BASE_URL:?set N8N_BASE_URL}"
: "${N8N_API_KEY:?set N8N_API_KEY}"

N8N_WEBHOOK_BASE="${N8N_WEBHOOK_BASE:-$N8N_BASE_URL}"
AUTO_PUBLISH="${AUTO_PUBLISH:-false}"
API="$N8N_BASE_URL/api/v1"
WF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../n8n/workflows" && pwd)"

# jq is preferred; fall back to python3 if jq is missing.
if command -v jq >/dev/null 2>&1; then JSONTOOL=jq; else JSONTOOL=python3; fi

log()  { printf '\n\033[1;34m==>\033[0m %s\n' "$*"; }
ok()   { printf '   \033[1;32mOK\033[0m  %s\n' "$*"; }
warn() { printf '   \033[1;33mWARN\033[0m %s\n' "$*"; }
fail() { printf '   \033[1;31mFAIL\033[0m %s\n' "$*"; }

api() { # method path [json_body_file_or_-]
  local method="$1" path="$2" body="${3:-}"
  local args=(-sS -X "$method" -H "X-N8N-API-KEY: $N8N_API_KEY" -H "Content-Type: application/json")
  if [ -n "$body" ]; then args+=(-d "@$body"); fi
  curl "${args[@]}" "$API$path"
}

jget() { # json_field  stdin_json  -> value
  local f="$1"
  if [ "$JSONTOOL" = jq ]; then jq -r "$f"; else python3 -c "import sys,json;d=json.load(sys.stdin);print(d$f)"; fi
}

# ---------------------------------------------------------------------------
log "n8n deploy starting — base=$N8N_BASE_URL"
# 0) connectivity + auth check
if ! curl -sS -o /dev/null -w '%{http_code}' -H "X-N8N-API-KEY: $N8N_API_KEY" "$API/workflows" | grep -qE '^2'; then
  echo "   Cannot authenticate to $API/workflows. Check N8N_BASE_URL and N8N_API_KEY." >&2
  exit 1
fi
ok "authenticated to n8n API"

# ---------------------------------------------------------------------------
# 1) Import workflows (idempotent — skip if a workflow with the same name exists)
log "importing workflows"
declare -A WF=(
  [WF-07_Content_Generation.json]=content/generate
  [WF-08_YouTube_Publishing.json]=youtube/publish
  [WF-09_Instagram_Publishing.json]=instagram/publish
  [WF-10_Facebook_Publishing.json]=facebook/publish
  [WF-15_Human_Approval_Queue.json]=approval/decide
)
EXISTING="$(api GET /workflows | jget "['data']" 2>/dev/null || echo '[]')"
import_one() {
  local file="$1" path="$2"
  local wf_name
  wf_name="$(jget "['name']" < "$WF_DIR/$file")"
  local existing_id
  existing_id="$(printf '%s' "$EXISTING" | jget "['data']" 2>/dev/null | { [ "$JSONTOOL" = jq ] && jq -r --arg n "$wf_name" '.[] | select(.name==$n) | .id' || python3 -c "import sys,json;d=json.load(sys.stdin);print(next((x['id'] for x in d if x.get('name')=='$wf_name'), ''))"; } 2>/dev/null || true)"
  if [ -n "$existing_id" ]; then
    ok "workflow '$wf_name' exists (id $existing_id) — skipped re-import"
    return 0
  fi
  local created
  created="$(api POST /workflows "$WF_DIR/$file")"
  local new_id
  new_id="$(printf '%s' "$created" | jget "['id']")"
  ok "imported '$wf_name' (id $new_id)"
}
for f in "${!WF[@]}"; do import_one "$f" "${WF[$f]}"; done

# ---------------------------------------------------------------------------
# 2) Create/refresh Header Auth credentials from secrets
log "credentials"
create_header_auth() {
  local cname="$1" hname="$2" value="$3"
  if [ -z "$value" ]; then warn "secret for '$cname' not provided — skipping (workflow will report BLOCKED)"; return 0; fi
  local existing_id
  existing_id="$(api GET /credentials | jget "['data']" | { [ "$JSONTOOL" = jq ] && jq -r --arg n "$cname" '.[] | select(.name==$n) | .id' || python3 -c "import sys,json;d=json.load(sys.stdin);print(next((x['id'] for x in d if x.get('name')=='$cname'), ''))"; } 2>/dev/null || true)"
  local body
  body="$(mktemp)"; printf '{"name":"%s","type":"httpHeaderAuth","data":{"name":"%s","value":"%s"}}' "$cname" "$hname" "$value" > "$body"
  if [ -n "$existing_id" ]; then
    api PATCH "/credentials/$existing_id" "$body" >/dev/null && ok "updated credential '$cname'" || fail "update '$cname'"
  else
    api POST /credentials "$body" >/dev/null && ok "created credential '$cname'" || fail "create '$cname'"
  fi
  rm -f "$body"
}
create_header_auth fortuneGemini "x-goog-api-key" "${GEMINI_API_KEY:-}"
create_header_auth fortuneMeta  "Authorization"   "${META_ACCESS_TOKEN:-}"
# NOTE: fortuneYouTube is OAuth2 — cannot be created here. The user connects it
# once in the n8n UI (Settings -> Credentials -> YouTube OAuth2 -> Sign in).

# ---------------------------------------------------------------------------
# 3) Set non-secret Variables (used by workflows via $vars.*)
log "variables"
set_var() {
  local key="$1" value="$2"
  local existing_id
  existing_id="$(api GET /variables | jget "['data']" | { [ "$JSONTOOL" = jq ] && jq -r --arg k "$key" '.[] | select(.key==$k) | .id' || python3 -c "import sys,json;d=json.load(sys.stdin);print(next((x['id'] for x in d if x.get('key')=='$key'), ''))"; } 2>/dev/null || true)"
  local body; body="$(mktemp)"; printf '{"key":"%s","value":"%s"}' "$key" "$value" > "$body"
  if [ -n "$existing_id" ]; then
    api PATCH "/variables/$existing_id" "$body" >/dev/null && ok "variable '$key' = $value" || warn "could not PATCH variable '$key'"
  else
    api POST /variables "$body" >/dev/null && ok "variable '$key' = $value" || warn "could not create variable '$key'"
  fi
  rm -f "$body"
}
set_var N8N_WEBHOOK_BASE "$N8N_WEBHOOK_BASE"
set_var AUTO_PUBLISH "$AUTO_PUBLISH"
[ -n "${META_PAGE_ID:-}" ]       && set_var META_PAGE_ID "$META_PAGE_ID"
[ -n "${META_IG_ACCOUNT_ID:-}" ] && set_var META_IG_ACCOUNT_ID "$META_IG_ACCOUNT_ID"

# ---------------------------------------------------------------------------
# 4) Activate workflows
log "activating workflows"
ALL_WF="$(api GET /workflows)"
activate_by_name() {
  local wf_name="$1"
  local id
  id="$(printf '%s' "$ALL_WF" | jget "['data']" | { [ "$JSONTOOL" = jq ] && jq -r --arg n "$wf_name" '.[] | select(.name==$n) | .id' || python3 -c "import sys,json;d=json.load(sys.stdin);print(next((x['id'] for x in d if x.get('name')=='$wf_name'), ''))"; } 2>/dev/null || true)"
  if [ -z "$id" ]; then warn "workflow '$wf_name' not found — skipping activate"; return 0; fi
  api POST "/workflows/$id/activate" >/dev/null && ok "activated '$wf_name'" || warn "activate '$wf_name' (may already be active)"
}
activate_by_name "WF-07 Content Generation"
activate_by_name "WF-08 YouTube Publishing"
activate_by_name "WF-09 Instagram Publishing"
activate_by_name "WF-10 Facebook Publishing"
activate_by_name "WF-15 Human Approval Queue"

# ---------------------------------------------------------------------------
# 5) Smoke test: approval gate must BLOCK a direct publish (AUTO_PUBLISH=false)
log "smoke test — approval gate (expect BLOCKED)"
TEST_URL="$N8N_WEBHOOK_BASE"
if [[ "$TEST_URL" == http://localhost* ]] || [[ "$TEST_URL" == http://127.0.0.1* ]]; then TEST_URL="$TEST_URL"; fi
resp="$(curl -sS -X POST -H "Content-Type: application/json" \
  -d '{"caption":"smoke-test","image_url":"https://example.com/x.jpg"}' \
  "$TEST_URL/webhook/instagram/publish")"
printf '   response: %s\n' "$resp"
if printf '%s' "$resp" | grep -q 'APPROVAL_REQUIRED'; then
  ok "approval gate BLOCKED the unapproved publish (correct)"
else
  fail "expected APPROVAL_REQUIRED but got: $resp"
fi

# 6) Smoke test: generate (should produce DRAFT / BLOCKED-LLM, never publish)
log "smoke test — content generation (expect DRAFT or BLOCKED, never a publish)"
gresp="$(curl -sS -X POST -H "Content-Type: application/json" \
  -d '{"platform":"instagram","topic":"Why term insurance protects your SIP"}' \
  "$TEST_URL/webhook/content/generate")"
printf '   response: %s\n' "$gresp"
if printf '%s' "$gresp" | grep -qE '"status":"(DRAFT|BLOCKED)"'; then
  ok "content generation returned a safe, non-publishing status"
else
  fail "unexpected generation response: $gresp"
fi

log "deploy complete. AUTO_PUBLISH=$AUTO_PUBLISH (publishing stays human-approved)."
