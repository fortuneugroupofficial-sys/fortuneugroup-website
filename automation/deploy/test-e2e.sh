#!/usr/bin/env bash
# =============================================================================
# Fortune U Group — END-TO-END publishing verification (YouTube / Instagram /
# Facebook), approval-gated. Run ON the VPS after deploy.sh.
#
# 1) Approval gate: direct publish WITHOUT approval must be BLOCKED.
# 2) Content generation (Gemini) must return DRAFT + fact_check, never publish.
# 3) Approved publish per platform (simulated human approval) must return
#    PUBLISHED + a platform post id.
#
# Does NOT flip AUTO_PUBLISH. It only reports PASS/FAIL; flipping to true is a
# separate, deliberate step (see docs/07) gated on this script + your approval.
#
# Required:
#   N8N_WEBHOOK_BASE            (from secrets file)
#   TEST_IMAGE_URL              public HTTPS image for the Instagram test
#   TEST_VIDEO_URL              public HTTPS mp4 for the YouTube test
# Optional:
#   N8N_BASE_URL + N8N_API_KEY  to preflight which credentials exist
#
# Dry run:  DRY_RUN=1 bash automation/deploy/test-e2e.sh
# =============================================================================
set -euo pipefail

for c in curl jq; do
  command -v "$c" >/dev/null 2>&1 || { echo "missing '$c' — install it first (e.g. apt-get install -y $c)" >&2; exit 1; }
done

DRY_RUN="${DRY_RUN:-0}"

for f in "${DEPLOY_SECRETS_FILE:-}" "/etc/fortuneugroup/secrets.env" "$HOME/.fortuneugroup/secrets.env" "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/secrets.env"; do
  [ -n "$f" ] || continue
  [ -r "$f" ] && { set -a; . "$f"; set +a; break; }
done

: "${N8N_WEBHOOK_BASE:?set N8N_WEBHOOK_BASE (env or secrets file)}"
BASE="$N8N_WEBHOOK_BASE/webhook"
STAMP="$(date -u +%Y%m%d-%H%M%S)"

if [ "$DRY_RUN" = 1 ]; then
  echo "[dry-run] E2E would run these checks against $BASE"
  echo "  1. gate    POST /{youtube,instagram,facebook}/publish (no approval) -> APPROVAL_REQUIRED"
  echo "  2. generate POST /content/generate -> DRAFT + fact_check"
  echo "  3. instagram POST /instagram/publish (APPROVED + TEST_IMAGE_URL) -> PUBLISHED"
  echo "  4. facebook  POST /facebook/publish  (APPROVED)                -> PUBLISHED"
  echo "  5. youtube   POST /youtube/publish   (APPROVED + TEST_VIDEO_URL, private) -> PUBLISHED"
  echo "[dry-run] AUTO_PUBLISH stays false."
  exit 0
fi

post() { curl -sS -X POST -H 'Content-Type: application/json' -d "$1" "$2"; }

pass=0; failn=0; warnn=0
P() { printf '   \033[1;32mPASS\033[0m  %-30s\n' "$1"; pass=$((pass+1)); }
F() { printf '   \033[1;31mFAIL\033[0m  %-30s -> %s\n' "$1" "$2"; failn=$((failn+1)); }
W() { printf '   \033[1;33mWARN\033[0m  %-30s -> %s\n' "$1" "$2"; warnn=$((warnn+1)); }

echo "=== E2E publishing verification ($STAMP) — AUTO_PUBLISH stays false ==="

# 0) optional credential preflight
if [ -n "${N8N_API_KEY:-}" ] && [ -n "${N8N_BASE_URL:-}" ]; then
  creds="$(curl -sS -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/credentials" | jq -c '.data // empty')"
  for cn in fortuneGemini fortuneMeta fortuneYouTube; do
    if printf '%s' "$creds" | jq -e --arg n "$cn" '.[] | select(.name==$n)' >/dev/null 2>&1; then
      P "credential $cn present"
    else
      W "credential $cn missing" "(create it — see docs/07)"
    fi
  done
else
  W "credential preflight skipped" "(set N8N_BASE_URL + N8N_API_KEY to enable)"
fi

# 1) approval gate
echo
echo "--- 1) approval gate (no approval -> BLOCKED) ---"
for p in youtube instagram facebook; do
  r="$(post "{\"caption\":\"gate-test-$STAMP\"}" "$BASE/$p/publish")"
  printf '%s' "$r" | grep -q 'APPROVAL_REQUIRED' && P "$p gate blocked" || F "$p gate blocked" "$r"
done

# 2) content generation
echo
echo "--- 2) content generation (Gemini -> DRAFT, never publish) ---"
g="$(post "{\"platform\":\"instagram\",\"topic\":\"TEST $STAMP term insurance protects your SIP\"}" "$BASE/content/generate")"
if   printf '%s' "$g" | grep -q '"status":"DRAFT"';       then P "generate -> DRAFT"
elif printf '%s' "$g" | grep -qiE 'BLOCKED|LLM';           then W "generate -> blocked" "$g"
else                                                             F "generate -> DRAFT" "$g"; fi
printf '%s' "$g" | grep -q 'fact_check' && P "generate returns fact_check" || F "generate returns fact_check" "$g"

# 3) approved publish per platform
echo
echo "--- 3) approved publish (simulated human approval) ---"

if [ -n "${TEST_IMAGE_URL:-}" ]; then
  r="$(post "{\"approval_status\":\"APPROVED\",\"approved\":true,\"media_type\":\"IMAGE\",\"image_url\":\"$TEST_IMAGE_URL\",\"caption\":\"Fortune U Group E2E test $STAMP — please ignore\"}" "$BASE/instagram/publish")"
  printf '%s' "$r" | grep -q '"status":"PUBLISHED"' && P "instagram publish" || F "instagram publish" "$r"
else
  W "instagram publish skipped" "(set TEST_IMAGE_URL)"
fi

r="$(post "{\"approval_status\":\"APPROVED\",\"approved\":true,\"message\":\"Fortune U Group E2E test $STAMP — please ignore\",\"title\":\"E2E test\"}" "$BASE/facebook/publish")"
printf '%s' "$r" | grep -q '"status":"PUBLISHED"' && P "facebook publish" || F "facebook publish" "$r"

if [ -n "${TEST_VIDEO_URL:-}" ]; then
  r="$(post "{\"approval_status\":\"APPROVED\",\"approved\":true,\"title\":\"Fortune U Group E2E test $STAMP\",\"video_url\":\"$TEST_VIDEO_URL\",\"privacyStatus\":\"private\",\"tags\":[\"e2e-test\"]}" "$BASE/youtube/publish")"
  printf '%s' "$r" | grep -q '"status":"PUBLISHED"' && P "youtube publish" || F "youtube publish" "$r"
else
  W "youtube publish skipped" "(set TEST_VIDEO_URL)"
fi

# summary
echo
echo "=== Summary: $pass passed, $warnn warnings, $failn failed ==="
if [ "$failn" -gt 0 ]; then
  echo "RESULT: FAIL — AUTO_PUBLISH remains false. Fix failures and re-run this script."
  exit 1
fi
echo "RESULT: PASS — all run checks succeeded. AUTO_PUBLISH is still false."
echo "Flip to auto-publish ONLY after your review, with an explicit command:"
echo "  AUTO_PUBLISH=true ALLOW_AUTO_PUBLISH=1 bash automation/deploy/deploy.sh"
exit 0
