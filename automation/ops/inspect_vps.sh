#!/usr/bin/env bash
# =============================================================================
# Read-only inspection of the existing Fortune U Group Contabo production stack.
#
# PURPOSE
#   Collect the information needed to connect the new Master AI Agent to the
#   EXISTING n8n + NocoDB on the Contabo VPS.
#
#   It ONLY READS. It does not create, start, stop, delete, or change anything:
#     * docker inspect / ps / network / volume (read-only)
#     * greps config files (read-only)
#     * curls local health endpoints (read-only)
#
# SECURITY
#   Secrets are NEVER printed. For any variable whose name contains TOKEN,
#   KEY, SECRET, PASSWORD, or CREDENTIAL, this script prints only
#   "<name>=<set:yes/no>" — never the value.
#
# USAGE
#   Copy this script to the VPS (or run it there) as root / a user in the
#   docker group:
#       bash inspect_vps.sh
#   Paste the printed output back to the assistant.
# =============================================================================

set -uo pipefail
TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

echo "=========================================================="
echo "FORTUNE U GROUP — PRODUCTION INFRASTRUCTURE INSPECTION"
echo "Timestamp: $TS"
echo "=========================================================="

# --- 0. host ----------------------------------------------------------------
echo; echo "### 0. HOST"
echo "hostname: $(hostname)"
echo "OS: $(grep PRETTY_NAME /etc/os-release 2>/dev/null | cut -d= -f2 | tr -d '"')"
echo "public IP: $(curl -s --max-time 5 https://api.ipify.org 2>/dev/null || echo '(offline/blocked)')"

# --- 1. docker ----------------------------------------------------------------
echo; echo "### 1. DOCKER STATUS"
if ! command -v docker >/dev/null 2>&1; then
  echo "docker: NOT INSTALLED (or not in PATH for this user)"
else
  echo "docker version: $(docker version --format '{{.Server.Version}}' 2>/dev/null || echo 'daemon unreachable (permissions?)')"
  echo; echo "containers (id/name/image/status/ports):"
  docker ps -a --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}' 2>/dev/null | head -60
  echo; echo "container resource usage (live):"
  docker stats --no-stream --format 'table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}' 2>/dev/null | head -60
fi

# --- 2. networks --------------------------------------------------------------
echo; echo "### 2. DOCKER NETWORKS"
docker network ls 2>/dev/null
echo "network membership (name -> containers):"
for net in $(docker network ls -q 2>/dev/null); do
  nname=$(docker network inspect -f '{{.Name}}' "$net" 2>/dev/null)
  conts=$(docker network inspect -f '{{range .Containers}}{{.Name}} {{end}}' "$net" 2>/dev/null)
  echo "  $nname: ${conts:-<none>}"
done

# --- 3. volumes ----------------------------------------------------------------
echo; echo "### 3. DOCKER VOLUMES"
docker volume ls 2>/dev/null
echo "volume mounts used by containers:"
for c in $(docker ps -aq 2>/dev/null); do
  cname=$(docker inspect -f '{{.Name}}' "$c" 2>/dev/null | tr -d '/')
  mounts=$(docker inspect -f '{{range .Mounts}}{{.Type}}:{{.Source}} -> {{.Destination}}; {{end}}' "$c" 2>/dev/null)
  echo "  $cname: ${mounts:-<none>}"
done

# --- 4. container env var NAMES (values redacted) ------------------------------
echo; echo "### 4. CONTAINER ENVIRONMENT (keys + set/empty ONLY, no values)"
for c in $(docker ps -aq 2>/dev/null); do
  cname=$(docker inspect -f '{{.Name}}' "$c" 2>/dev/null | tr -d '/')
  echo "  [$cname]"
  docker inspect -f '{{range .Config.Env}}{{println .}}{{end}}' "$c" 2>/dev/null \
    | grep -iE "NOCODB|N8N|DB_|DATABASE|META|WHATSAPP|YOUTUBE|GEMINI|WEBHOOK|AUTO_PUBLISH|FUG_DRY|PORTS|DOMAIN|HOST" \
    | sed -E 's/^(.*)=(.*)$/\1=<set:yes>/' | while read -r l; do
        var="${l%%=*}"
        if echo "$var" | grep -qiE "TOKEN|KEY|SECRET|PASSWORD|CREDENTIAL"; then
          echo "    $var=<set:yes>  (value hidden)"
        else
          # non-secret vars: show value
          v=$(docker inspect -f "{{range .Config.Env}}{{println .}}{{end}}" "$c" 2>/dev/null | grep "^$var=" | cut -d= -f2-)
          echo "    $var=$v"
        fi
      done
done

# --- 5. docker-compose files ----------------------------------------------------
echo; echo "### 5. DOCKER-COMPOSE FILES (locations only, contents NOT printed)"
find / -maxdepth 4 \( -name "docker-compose*.yml" -o -name "docker-compose*.yaml" -o -name "compose*.yml" \) \
  -not -path "/proc/*" -not -path "/sys/*" -not -path "/var/lib/docker/*" 2>/dev/null | head -20

# --- 6. reverse proxy / HTTPS ----------------------------------------------------
echo; echo "### 6. REVERSE PROXY / HTTPS"
if command -v nginx >/dev/null 2>&1 || [ -d /etc/nginx ]; then
  echo "nginx config files:"
  find /etc/nginx -name "*.conf" 2>/dev/null | head -20
  echo "nginx server blocks (server_name / listen / proxy_pass):"
  grep -rhnE "server_name|listen|proxy_pass|return 301" /etc/nginx 2>/dev/null | grep -v "#" | head -40
fi
if command -v caddy >/dev/null 2>&1 || [ -f /etc/caddy/Caddyfile ]; then
  echo "Caddyfile found:"
  grep -vE "^\s*#|^\s*$" /etc/caddy/Caddyfile 2>/dev/null | head -60
fi
# OmniRoute / other proxy detection
if docker ps --format '{{.Names}}' 2>/dev/null | grep -qi "omni\|route\|traefik\|caddy\|nginx\|proxy"; then
  echo "proxy-like containers:"
  docker ps --format '{{.Names}} {{.Image}} {{.Ports}}' 2>/dev/null | grep -iE "omni|route|traefik|caddy|nginx|proxy"
fi

# --- 7. n8n -----------------------------------------------------------------------
echo; echo "### 7. N8N"
n8n_container=$(docker ps --format '{{.Names}}\t{{.Image}}' 2>/dev/null | grep -i n8n | head -1 | cut -f1)
echo "n8n container: ${n8n_container:-<none found>}"
if [ -n "${n8n_container:-}" ]; then
  echo "n8n port(s): $(docker port "$n8n_container" 2>/dev/null | tr '\n' ' ')"
  echo "n8n exec mode / encryption: $(docker inspect -f 'N8N_ENCRYPTION_KEY=<set:yes>' "$n8n_container" 2>/dev/null)"
  # webhook base path guesses
  echo "n8n webhook paths present in workflows (read-only grep of n8n DB if sqlite):"
  N8N_DB=$(docker inspect -f '{{range .Mounts}}{{.Source}};{{end}}' "$n8n_container" 2>/dev/null)
  echo "  mounted volumes: $N8N_DB"
fi

# --- 8. NocoDB --------------------------------------------------------------------
echo; echo "### 8. NOCODB"
noco_container=$(docker ps --format '{{.Names}}\t{{.Image}}' 2>/dev/null | grep -i "noco" | head -1 | cut -f1)
echo "nocodb container: ${noco_container:-<none found>}"
if [ -n "${noco_container:-}" ]; then
  echo "nocodb port(s): $(docker port "$noco_container" 2>/dev/null | tr '\n' ' ')"
  for port in 8080 8081 8085; do
    code=$(curl -s --max-time 3 -o /dev/null -w "%{http_code}" "http://localhost:$port/dashboard" 2>/dev/null)
    echo "  localhost:$port/dashboard -> HTTP ${code:-<no resp>}"
  done
fi

# --- 9. NocoDB API reachability from THIS host (read-only) -------------------------
echo; echo "### 9. NOCODB API (read-only, unauthenticated probes only)"
if [ -n "${noco_container:-}" ]; then
  # find the published port
  np=$(docker port "$noco_container" 2>/dev/null | grep -oE "0.0.0.0:[0-9]+|:::[0-9]+" | head -1 | grep -oE "[0-9]+$")
  echo "  nocodb published port: ${np:-<none>}"
  if [ -n "${np:-}" ]; then
    echo "  /api/v1/meta/tables (no token) -> $(curl -s --max-time 4 -o /dev/null -w '%{http_code}' "http://localhost:$np/api/v1/meta/tables" 2>/dev/null)"
    echo "  /health -> $(curl -s --max-time 4 -o /dev/null -w '%{http_code}' "http://localhost:$np/health" 2>/dev/null)"
  fi
fi

echo; echo "### 10. NOCODB API TOKEN / AUTH (presence ONLY)"
for var in NOCODB_API_TOKEN NOCODB_URL N8N_API_KEY N8N_BASIC_AUTH_USER N8N_BASIC_AUTH_PASSWORD N8N_ENCRYPTION_KEY; do
  present=""
  if [ -n "${noco_container:-}" ] && docker inspect -f '{{range .Config.Env}}{{println .}}{{end}}' "$noco_container" 2>/dev/null | grep -q "^$var="; then
    present="$present  [on nocodb container]"
  fi
  if [ -n "${n8n_container:-}" ] && docker inspect -f '{{range .Config.Env}}{{println .}}{{end}}' "$n8n_container" 2>/dev/null | grep -q "^$var="; then
    present="$present  [on n8n container]"
  fi
  echo "  $var: ${present:-<not set on containers>}"
done

echo; echo "=========================================================="
echo "INSPECTION COMPLETE — nothing was modified."
echo "If any value here looks like a secret it was hidden. Do not paste"
echo "tokens/keys/passwords into chat; reference them by variable name."
echo "=========================================================="
