#!/usr/bin/env bash
# =============================================================================
# READ-ONLY export of the EXISTING live n8n workflow + NocoDB schema + recent
# executions, so the assistant can pinpoint the exact failing node WITHOUT any
# manual node-by-node configuration.
#
# SAFETY: This script ONLY READS and EXPORTS. It does NOT create, delete,
# modify, activate/deactivate, or reinstall anything. It never prints secrets
# (any token/key/password is used in-memory or replaced by "<hidden>").
#
# USAGE (on the Contabo VPS, as a user in the docker group or root):
#     bash export_live_stack.sh
#   It writes files into  ./fug-export/  then prints the file list.
#   Send the folder (or its files) back to the assistant.
# =============================================================================
set -uo pipefail

OUT="$(pwd)/fug-export"
mkdir -p "$OUT/workflows" "$OUT/nocodb" "$OUT/executions"

redact() { sed -E 's/((xc-token|xc-auth|Bearer|Authorization|token|api[_-]?key|password|secret|credential)[":= ]+)[^ "&,}]{4,}/\1<hidden>/Ig'; }

echo ">>> Export target: $OUT"

# ---- 1. n8n workflow export (built-in CLI, read-only) ---------------------
N8N_C=$(docker ps --format '{{.Names}}' | grep -i n8n | head -1)
if [ -n "${N8N_C:-}" ]; then
  echo ">>> n8n container: $N8N_C"
  docker exec "$N8N_C" sh -c 'mkdir -p /tmp/fugexport && n8n export:workflow --all --output=/tmp/fugexport --pretty 2>/dev/null' >/dev/null 2>&1
  if docker exec "$N8N_C" sh -c '[ -d /tmp/fugexport ] && ls /tmp/fugexport/*.json' >/dev/null 2>&1; then
    docker cp "$N8N_C:/tmp/fugexport/." "$OUT/workflows/" 2>/dev/null
    echo ">>> Exported n8n workflows to $OUT/workflows/"
  else
    echo ">>> WARN: n8n export:workflow failed (CLI may differ). Trying REST API..."
    # fallback: n8n REST API (read-only) if an API key exists in container env
    KEY=$(docker inspect -f '{{range .Config.Env}}{{println .}}{{end}}' "$N8N_C" 2>/dev/null | grep '^N8N_API_KEY=' | cut -d= -f2-)
    PORT=$(docker port "$N8N_C" 2>/dev/null | grep -oE "0.0.0.0:[0-9]+|:::[0-9]+" | head -1 | grep -oE "[0-9]+$")
    if [ -n "${KEY:-}" ] && [ -n "${PORT:-}" ]; then
      curl -s --max-time 15 -H "X-N8N-API-KEY: $KEY" "http://localhost:$PORT/api/v1/workflows" | redact > "$OUT/workflows/rest_api_workflows.json"
      echo ">>> Exported workflows via REST API (see rest_api_workflows.json)"
    else
      echo ">>> Could not auto-export workflows. Run manually in n8n UI: Workflows -> ... -> Download, or paste workflow JSON."
    fi
  fi
else
  echo ">>> WARN: no n8n container found."
fi

# ---- 2. Recent executions + errors (read-only) ------------------------------
if [ -n "${N8N_C:-}" ]; then
  PORT=$(docker port "$N8N_C" 2>/dev/null | grep -oE "0.0.0.0:[0-9]+|:::[0-9]+" | head -1 | grep -oE "[0-9]+$")
  KEY=$(docker inspect -f '{{range .Config.Env}}{{println .}}{{end}}' "$N8N_C" 2>/dev/null | grep '^N8N_API_KEY=' | cut -d= -f2-)
  if [ -n "${KEY:-}" ] && [ -n "${PORT:-}" ]; then
    echo ">>> Fetching recent executions (last 20, incl. errors)..."
    curl -s --max-time 15 -H "X-N8N-API-KEY: $KEY" "http://localhost:$PORT/api/v1/executions?limit=20" | redact > "$OUT/executions/recent_executions.json"
    echo ">>> Executions saved."
  else
    echo ">>> No n8n API key found. Grab recent executions from n8n UI -> Executions (the failing run) and export/paste the error."
  fi
fi

# ---- 3. NocoDB schema (read-only meta API) ----------------------------------
NOCO_C=$(docker ps --format '{{.Names}}' | grep -i noco | head -1)
if [ -n "${NOCO_C:-}" ]; then
  echo ">>> nocodb container: $NOCO_C"
  NPORT=$(docker port "$NOCO_C" 2>/dev/null | grep -oE "0.0.0.0:[0-9]+|:::[0-9]+" | head -1 | grep -oE "[0-9]+$")
  TOKEN=$(docker inspect -f '{{range .Config.Env}}{{println .}}{{end}}' "$NOCO_C" 2>/dev/null | grep '^NC_AUTH_JWT_SECRET=\|^NOCODB_API_TOKEN=' | head -1 | cut -d= -f2-)
  if [ -n "${NPORT:-}" ]; then
    echo ">>> NocoDB port: $NPORT"
    # meta tables (read-only)
    curl -s --max-time 15 -H "xc-token: $TOKEN" "http://localhost:$NPORT/api/v1/meta/bases/" 2>/dev/null | redact > "$OUT/nocodb/bases.json"
    curl -s --max-time 15 -H "xc-token: $TOKEN" "http://localhost:$NPORT/api/v1/meta/tables" 2>/dev/null | redact > "$OUT/nocodb/tables.json"
    echo ">>> NocoDB schema saved (bases.json, tables.json)."
    echo ">>> NOTE: if these are empty, the API token header may differ; provide NOCODB_API_TOKEN path instead."
  else
    echo ">>> WARN: no published NocoDB port found."
  fi
else
  echo ">>> WARN: no nocodb container found (may run as a different name)."
fi

echo
echo "======================================================================"
echo "EXPORT COMPLETE. Files written under: $OUT"
find "$OUT" -type f | sed "s|$OUT/||"
echo "======================================================================"
echo "Send the $OUT folder back to the assistant. Secrets were NOT printed."
echo "Nothing on the VPS was created (except this export folder) or modified."
echo "======================================================================"
