#!/usr/bin/env bash
# =============================================================================
# Fortune U Group — secure secrets bootstrap (interactive)
# -----------------------------------------------------------------------------
# Prompts you for the secrets needed by deploy.sh / test-e2e.sh and writes them
# to a root-owned, chmod-600 file OUTSIDE the repo, so they can never be
# committed or leaked. Nothing here is sent anywhere or echoed.
#
# Where the file lives (auto):
#   root      -> /etc/fortuneugroup/secrets.env
#   non-root  -> ~/.fortuneugroup/secrets.env
# Override with:  SECRETS_FILE=/path bash bootstrap-secrets.sh
#
# The same file is sourced automatically by deploy.sh and test-e2e.sh.
# =============================================================================
set -euo pipefail

if [ "$(id -u)" = 0 ]; then
  DEFAULT_FILE="/etc/fortuneugroup/secrets.env"
else
  DEFAULT_FILE="$HOME/.fortuneugroup/secrets.env"
fi
FILE="${SECRETS_FILE:-$DEFAULT_FILE}"

mkdir -p "$(dirname "$FILE")"
umask 077

# Preload existing values so prompts can default to "keep current".
if [ -r "$FILE" ]; then set -a; . "$FILE"; set +a; fi

echo "=============================================================="
echo " Fortune U Group — secrets bootstrap"
echo " Values are read from your keyboard, never echoed, never sent."
echo " They are written ONLY to: $FILE"
echo "=============================================================="
echo

# Reads a secret (hidden input). Prints only "NAME=value" to stdout.
read_secret() {
  local name="$1" prompt="$2"
  local current="${!name:-}" val
  if [ -n "$current" ]; then
    printf '%s [existing — press Enter to keep]: ' "$prompt" >&2
    IFS= read -r -s val || true; printf '\n' >&2
    val="${val:-$current}"
  else
    printf '%s (hidden): ' "$prompt" >&2
    IFS= read -r -s val || true; printf '\n' >&2
  fi
  printf '%s=%s\n' "$name" "$val"
}

# Reads a non-secret (visible input).
read_plain() {
  local name="$1" prompt="$2"
  local current="${!name:-}" val
  if [ -n "$current" ]; then
    printf '%s [existing: %s — Enter to keep]: ' "$prompt" "$current" >&2
  else
    printf '%s: ' "$prompt" >&2
  fi
  IFS= read -r val || true
  val="${val:-$current}"
  printf '%s=%s\n' "$name" "$val"
}

{
  echo "# Fortune U Group secrets — generated $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "# chmod 600. Sourced by automation/deploy/deploy.sh + test-e2e.sh. NEVER commit."
  echo
  echo "# --- secrets (hidden on input) ---"
  read_secret N8N_API_KEY "n8n admin API key"
  read_secret GEMINI_API_KEY "Gemini API key"
  read_secret META_ACCESS_TOKEN "Meta long-lived access token"
  echo
  echo "# --- non-secret config (visible) ---"
  read_plain N8N_WEBHOOK_BASE "n8n webhook base URL (e.g. https://n8n.fortuneugroup.in)"
  read_plain META_PAGE_ID "Facebook Page ID"
  read_plain META_IG_ACCOUNT_ID "Instagram Business Account ID"
} > "$FILE.tmp"

chmod 600 "$FILE.tmp"
mv -f "$FILE.tmp" "$FILE"
chmod 600 "$FILE"

echo
echo "Secrets saved to $FILE (chmod 600)."
echo "Next step:  bash automation/deploy/deploy.sh"
