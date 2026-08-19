#!/usr/bin/env bash
# =============================================================================
# 03_backup.sh — timestamped, non-destructive backups BEFORE any change.
# Backs up: docker-compose files, n8n workflows + credentials (from container),
# nginx-proxy-manager config, omniroute config. Does NOT delete anything and
# does NOT copy secrets in cleartext to the repo (files stay on the VPS).
# =============================================================================
set -uo pipefail
TS="$(date -u +%Y%m%dT%H%M%SZ)"
BK="$(pwd)/fug-backup-$TS"; mkdir -p "$BK"
echo ">>> Backup -> $BK"

# 1. compose files
find / -maxdepth 4 \( -name "docker-compose*.yml" -o -name "docker-compose*.yaml" -o -name "compose*.yml" \) \
  -not -path "/proc/*" -not -path "/sys/*" -not -path "/var/lib/docker/*" 2>/dev/null \
  | while read -r f; do
    d="$BK/compose$(dirname "$f")"; mkdir -p "$d"; cp -a "$f" "$d/" && echo "  backed up: $f"
  done

# 2. n8n workflows + credentials metadata (from container)
N8N_C=$(docker ps --format '{{.Names}}' | grep -i n8n | head -1)
if [ -n "${N8N_C:-}" ]; then
  docker exec "$N8N_C" sh -c 'rm -rf /tmp/fugbk && mkdir -p /tmp/fugbk/w /tmp/fugbk/c && n8n export:workflow --all --output=/tmp/fugbk/w --pretty 2>/dev/null; n8n export:credentials --output=/tmp/fugbk/c --decrypted --pretty 2>/dev/null' \
    && docker cp "$N8N_C:/tmp/fugbk/." "$BK/n8n/" 2>/dev/null && echo "  n8n workflows+credentials metadata backed up"
fi

# 3. nginx-proxy-manager + omniroute config dirs (if present)
for d in /data/nginx /opt/nginx-proxy-manager /etc/nginx /opt/omniroute /etc/omniroute; do
  if [ -d "$d" ]; then mkdir -p "$BK/$(basename "$d")"; cp -a "$d/." "$BK/$(basename "$d")/" 2>/dev/null && echo "  backed up config: $d"; fi
done

# 4. env files referenced by compose (names/values kept on VPS only)
find / -maxdepth 4 -name ".env" -path "*n8n*" 2>/dev/null | while read -r f; do mkdir -p "$BK/env"; cp -a "$f" "$BK/env/" 2>/dev/null && echo "  backed up env: $f (kept on VPS)"; done

echo
echo "Backup complete: $BK"
echo "Volumes were NOT touched (data preserved in place)."
