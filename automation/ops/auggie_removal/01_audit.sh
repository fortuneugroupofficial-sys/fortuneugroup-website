#!/usr/bin/env bash
# =============================================================================
# 01_audit.sh  — READ-ONLY audit of the Contabo VPS Docker + n8n + proxy stack.
# Safe: prints/collects state only. NEVER prints secrets.
# Writes a redacted audit report to ./fug-audit/ and prints a summary.
# =============================================================================
set -uo pipefail
OUT="$(pwd)/fug-audit"; mkdir -p "$OUT"
TS="$(date -u +%Y%m%dT%H%M%SZ)"

redact() { sed -E 's/((xc-token|xc-auth|Bearer|Authorization|token|api[_-]?key|password|secret|AUGGIE_BIN|credential)[":= ]+)[^ "&,}]{4,}/\1<hidden>/Ig'; }
mask_envvals() { sed -E 's/^(.*)=(.*)$/\1=<set:yes>/'; }

echo ">>> Audit report -> $OUT"
{
  echo "===== HOST ====="
  hostname; grep PRETTY_NAME /etc/os-release 2>/dev/null | cut -d= -f2
  echo
  echo "===== 1. DOCKER PS ====="
  docker ps -a --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
  echo
  echo "===== 2. DOCKER COMPOSE FILES ====="
  find / -maxdepth 4 \( -name "docker-compose*.yml" -o -name "docker-compose*.yaml" -o -name "compose*.yml" \) \
    -not -path "/proc/*" -not -path "/sys/*" -not -path "/var/lib/docker/*" 2>/dev/null
  echo
  echo "===== 3. NETWORKS ====="
  docker network ls
  echo
  echo "===== 4. VOLUMES ====="
  docker volume ls
  echo
  echo "===== 5. CONTAINER ENV VAR NAMES (values hidden) ====="
  for c in $(docker ps -aq); do
    n=$(docker inspect -f '{{.Name}}' "$c" | tr -d '/')
    echo "  [$n]"
    docker inspect -f '{{range .Config.Env}}{{println .}}{{end}}' "$c" 2>/dev/null \
      | mask_envvals
  done
  echo
  echo "===== 6. NGINX-PROXY-MANAGER (config present?) ====="
  find / -maxdepth 5 -path "*nginx-proxy-manager*" -name "*.conf" 2>/dev/null | head
  echo "(proxy hosts live in its DB; use the npm UI/API to list them - not printed here)"
  echo
  echo "===== 7. OMNIROUTE config locations (names only) ====="
  find / -maxdepth 5 \( -iname "*omniroute*" -o -iname "*omni-route*" \) \
    -not -path "/proc/*" -not -path "/sys/*" 2>/dev/null | head -20
  echo
  echo "===== 8. NOCODB env (names only) ====="
  for c in $(docker ps -aq); do
    docker inspect -f '{{range .Config.Env}}{{println .}}{{end}}' "$c" 2>/dev/null \
      | grep -i "noco\|nc_" | mask_envvals
  done
} | redact > "$OUT/audit_$TS.txt"

cat "$OUT/audit_$TS.txt"
echo
echo "Audit saved: $OUT/audit_$TS.txt  (secrets hidden; nothing modified)"
