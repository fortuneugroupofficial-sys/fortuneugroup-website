#!/usr/bin/env bash
# =============================================================================
# 05_restart_n8n.sh — restart ONLY n8n (the only service that needs it after the
# AI Agent credential/model change). Does NOT reboot the VPS and does NOT touch
# NocoDB, nginx-proxy-manager, OmniRoute, volumes, or data.
# =============================================================================
set -uo pipefail
N8N_C=$(docker ps --format '{{.Names}}' | grep -i n8n | head -1)
if [ -z "${N8N_C:-}" ]; then echo "ERROR: no n8n container found"; exit 1; fi

echo ">>> Restarting only: $N8N_C"
docker restart "$N8N_C"
echo ">>> Waiting for n8n to be healthy..."
for i in $(seq 1 30); do
  if docker exec "$N8N_C" wget -q -O /dev/null http://127.0.0.1:5678/healthz 2>/dev/null \
     || curl -s -o /dev/null http://127.0.0.1:5678/healthz 2>/dev/null; then
    echo "n8n is UP."; break
  fi
  sleep 2
done

echo ">>> Container state after restart:"
docker ps --filter name="$N8N_C" --format 'table {{.Names}}\t{{.Status}}'
echo "(No other container was restarted; no VPS reboot.)"
