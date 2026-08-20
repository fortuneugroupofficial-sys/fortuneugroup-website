#!/usr/bin/env bash
# =============================================================================
# Fortune U Group — n8n social publishing deployer (idempotent)
# -----------------------------------------------------------------------------
# Imports WF-07/08/09/10/15, creates Header Auth credentials from secrets,
# sets non-secret Variables, activates workflows, and smoke-tests the approval
# gate. Run ON the Contabo VPS (n8n is at http://localhost:5678).
#
# Secrets are loaded from a secrets file (see bootstrap-secrets.sh) or the
# environment. They are NEVER hard-coded, never in workflow JSON, never in Git.
#
# Usage:
#   1) bash automation/deploy/bootstrap-secrets.sh          # once, stores secrets
#   2) N8N_BASE_URL=http://localhost:5678 bash automation/deploy/deploy.sh
#
# Dry run (validates logic, no network):   DRY_RUN=1 bash automation/deploy/deploy.sh
# =============================================================================
set -euo pipefail

# --- prerequisites -----------------------------------------------------------
for c in curl jq; do
  command -v "$c" >/dev/null 2>&1 || { echo "missing '$c' — install it first (e.g. apt-get install -y $c)" >&2; exit 1; }
done

DRY_RUN="${DRY_RUN:-0}"

# --- load secrets (first readable file wins; env vars take precedence) -------
for f in "${DEPLOY_SECRETS_FILE:-}" "/etc/fortuneugroup/secrets.env" "$HOME/.fortuneugroup/secrets.env" "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/secrets.env"; do
  [ -n "$f" ] || continue
  if [ -r "$f" ]; then
    set -a; . "$f"; set +a
    echo "Loaded secrets from $f"
    break
  fi
done

: "${N8N_BASE_URL:?set N8N_BASE_URL (e.g. http://localhost:5678)}"
: "${N8N_API_KEY:?set N8N_API_KEY (env or secrets file)}"

N8N_WEBHOOK_BASE="${N8N_WEBHOOK_BASE:-$N8N_BASE_URL}"

# --- safety guard: publishing stays human-approved unless explicitly allowed --
AUTO_PUBLISH="${AUTO_PUBLISH:-false}"
if [ "$AUTO_PUBLISH" != "false" ] && [ "${ALLOW_AUTO_PUBLISH:-0}" != "1" ]; then
  echo "WARN: AUTO_PUBLISH=$AUTO_PUBLISH requested but not authorized — forcing false." >&2
  AUTO_PUBLISH=false
fi

API="$N8N_BASE_URL/api/v1"
WF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../n8n/workflows" && pwd)"

log()  { printf '\n\033[1;34m==>\033[0m %s\n' "$*"; }
ok()   { printf '   \033[1;32mOK\033[0m  %s\n' "$*"; }
warn() { printf '   \033[1;33mWARN\033[0m %s\n' "$*"; }
fail() { printf '   \033[1;31mFAIL\033[0m %s\n' "$*"; }

# --- dry run -----------------------------------------------------------------
if [ "$DRY_RUN" = 1 ]; then
  log "DRY RUN — would deploy to $N8N_BASE_URL (no network calls)"
  echo "   - import WF-07, WF-08, WF-09, WF-10, WF-15 (skip if name exists)"
  echo "   - create/update credential 'fortuneGemini'  (Header Auth x-goog-api-key)  [if GEMINI_API_KEY set]"
  echo "   - create/update credential 'fortuneMeta'    (Header Auth Authorization)   [if META_ACCESS_TOKEN set]"
  echo "   - note: 'fortuneYouTube' is OAuth2 — created once in the n8n UI (not via API)"
  echo "   - set variables: N8N_WEBHOOK_BASE, AUTO_PUBLISH=$AUTO_PUBLISH, META_PAGE_ID, META_IG_ACCOUNT_ID"
  echo "   - activate the 5 workflows"
  echo "   - smoke test: direct publish must return APPROVAL_REQUIRED (gate holds)"
  exit 0
fi

# --- helpers -----------------------------------------------------------------
api() { # method path [json_body_file]
  local method="$1" path="$2" body="${3:-}"
  local args=(-sS -X "$method" -H "X-N8N-API-KEY: $N8N_API_KEY" -H "Content-Type: application/json")
  [ -n "$body" ] && args+=(-d "@$body")
  curl "${args[@]}" "$API$path"
}

id_by_name() { # json_array  name  -> id (empty if none)
  printf '%s' "$1" | jq -r --arg n "$2" '.[] | select(.name==$n) | .id' 2>/dev/null | head -1
}

# ---------------------------------------------------------------------------
log "n8n deploy starting — base=$N8N_BASE_URL"
if [ "$(curl -sS -o /dev/null -w '%{http_code}' -H "X-N8N-API-KEY: $N8N_API_KEY" "$API/workflows")" != "200" ]; then
  echo "   Cannot authenticate to $API/workflows. Check N8N_BASE_URL + N8N_API_KEY." >&2
  exit 1
fi
ok "authenticated to n8n API"

# 1) import workflows (idempotent by name)
log "importing workflows"
declare -A WF=(
  [WF-07_Content_Generation.json]=content/generate
  [WF-08_YouTube_Publishing.json]=youtube/publish
  [WF-09_Instagram_Publishing.json]=instagram/publish
  [WF-10_Facebook_Publishing.json]=facebook/publish
  [WF-15_Human_Approval_Queue.json]=approval/decide
)
WFLIST="$(api GET /workflows | jq -c '.data // empty')"
for file in "${!WF[@]}"; do
  wf_name="$(jq -r '.name' "$WF_DIR/$file")"
  existing_id="$(id_by_name "$WFLIST" "$wf_name")"
  if [ -n "$existing_id" ]; then
    ok "workflow '$wf_name' exists (id $existing_id) — skipped re-import"
    continue
  fi
  new_id="$(api POST /workflows "$WF_DIR/$file" | jq -r '.id')"
  ok "imported '$wf_name' (id $new_id)"
done

# 2) create/refresh Header Auth credentials from secrets
log "credentials"
create_header_auth() {
  local cname="$1" hname="$2" value="$3"
  if [ -z "$value" ]; then warn "secret for '$cname' not set — skipping (workflow reports BLOCKED)"; return 0; fi
  local credlist existing_id body
  credlist="$(api GET /credentials | jq -c '.data // empty')"
  existing_id="$(id_by_name "$credlist" "$cname")"
  body="$(mktemp)"; printf '{"name":"%s","type":"httpHeaderAuth","data":{"name":"%s","value":"%s"}}' "$cname" "$hname" "$value" > "$body"
  if [ -n "$existing_id" ]; then
    api PATCH "/credentials/$existing_id" "$body" >/dev/null && ok "updated credential '$cname'" || fail "update '$cname'"
  else
    api POST /credentials "$body" >/dev/null && ok "created credential '$cname'" || fail "create '$cname' (fallback: create it in the n8n UI)"
  fi
  rm -f "$body"
}
create_header_auth fortuneGemini "x-goog-api-key" "${GEMINI_API_KEY:-}"
create_header_auth fortuneMeta  "Authorization"   "${META_ACCESS_TOKEN:-}"

# 3) set non-secret Variables
log "variables"
set_var() {
  local key="$1" value="$2"
  local varlist existing_id body
  varlist="$(api GET /variables | jq -c '.data // empty')"
  existing_id="$(printf '%s' "$varlist" | jq -r --arg k "$key" '.[] | select(.key==$k) | .id' 2>/dev/null | head -1)"
  body="$(mktemp)"; printf '{"key":"%s","value":"%s"}' "$key" "$value" > "$body"
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

# 4) activate workflows
log "activating workflows"
WFLIST="$(api GET /workflows | jq -c '.data // empty')"
activate_by_name() {
  local wf_name="$1" id
  id="$(id_by_name "$WFLIST" "$wf_name")"
  [ -z "$id" ] && { warn "workflow '$wf_name' not found — skipping"; return 0; }
  api POST "/workflows/$id/activate" >/dev/null && ok "activated '$wf_name'" || warn "activate '$wf_name' (may already be active)"
}
activate_by_name "WF-07 Content Generation"
activate_by_name "WF-08 YouTube Publishing"
activate_by_name "WF-09 Instagram Publishing"
activate_by_name "WF-10 Facebook Publishing"
activate_by_name "WF-15 Human Approval Queue"

# 5) smoke test: approval gate must BLOCK a direct publish
log "smoke test — approval gate (expect BLOCKED)"
resp="$(curl -sS -X POST -H "Content-Type: application/json" \
  -d '{"caption":"smoke-test","image_url":"https://example.com/x.jpg"}' \
  "$N8N_WEBHOOK_BASE/webhook/instagram/publish")"
printf '   response: %s\n' "$resp"
if printf '%s' "$resp" | grep -q 'APPROVAL_REQUIRED'; then
  ok "approval gate BLOCKED the unapproved publish (correct)"
else
  fail "expected APPROVAL_REQUIRED but got: $resp"
fi

log "deploy complete. AUTO_PUBLISH=$AUTO_PUBLISH (publishing stays human-approved)."
log "next: run the end-to-end test — bash automation/deploy/test-e2e.sh"
