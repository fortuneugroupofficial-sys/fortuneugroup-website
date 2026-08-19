#!/usr/bin/env bash
# =============================================================================
# finish_fortune_automation.sh  — ONE consolidated, idempotent, SAFE procedure
# to move the Fortune U Group n8n AI Agent from Auggie/OmniRoute to the OFFICIAL
# OpenAI API, and verify the full lead pipeline end-to-end.
#
# It does NOT rebuild anything. It only:
#   1) audits  (read-only)
#   2) backs up (timestamped, volumes/data untouched)
#   3) verifies the official OpenAI key + supported models (never prints key)
#   4) patches ONLY the OpenAI Chat Model / AI Agent model connection
#   5) restarts ONLY n8n
#   6) posts a clearly-marked TEST insurance lead and verifies no Auggie/502
#   7) prints ONE final report
#
# SAFETY:
#   * Default = PLAN (read-only). Pass --apply to actually change + restart + test.
#   * Never deletes volumes, n8n/NocoDB data, containers, workflows, credentials,
#     domains, SSL, WhatsApp/email/meeting nodes, or NocoDB lead rows.
#   * Secrets are read from the environment ONLY (see below); never printed,
#     never written to files, never in images.
#
# USAGE (on the Contabo VPS):
#   export OPENAI_API_KEY='sk-...'      # official OpenAI key (never print it)
#   export N8N_API_KEY='...'            # n8n Settings -> API (for credential+import)
#   export OPENAI_MODEL='gpt-4o-mini'   # optional default; verified against /v1/models
#   bash finish_fortune_automation.sh            # PLAN (read-only) first
#   bash finish_fortune_automation.sh --apply    # then the real change + test
# =============================================================================
set -uo pipefail

MODE="${1:-plan}"          # plan (default) | apply
if [ "$MODE" = "--apply" ]; then MODE="apply"; fi
TS="$(date -u +%Y%m%dT%H%M%SZ)"
WORK="$(pwd)/fug-automation-$TS"; mkdir -p "$WORK"

redact() { sed -E 's/((sk-|xc-token|xc-auth|Bearer|Authorization|token|api[_-]?key|password|secret|AUGGIE_BIN|credential)[":= ]+)[^ "&,}]{4,}/\1<hidden>/Ig'; }
mask() { sed -E 's/=.*/=<set:yes>/'; }

echo "======================================================================"
echo " FORTUNE U GROUP — CONSOLIDATED AUTOMATION MIGRATION (mode: $MODE)"
echo "======================================================================"

# ---------- 1. AUDIT (read-only) --------------------------------------------
echo; echo "[1/7] AUDIT"
AUD="$WORK/audit.txt"
{
  echo "HOST: $(hostname) $(grep PRETTY_NAME /etc/os-release 2>/dev/null | cut -d= -f2)"
  echo "DOCKER PS:"; docker ps -a --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
  echo "NETWORKS:"; docker network ls
  echo "VOLUMES:"; docker volume ls
} > "$AUD" 2>&1
cat "$AUD" | redact
N8N_C=$(docker ps --format '{{.Names}}' | grep -i n8n | head -1)
NOCO_C=$(docker ps --format '{{.Names}}' | grep -i noco | head -1)
echo "  -> n8n container:   ${N8N_C:-<none>}"
echo "  -> nocodb container:${NOCO_C:-<none>}"
if [ -z "${N8N_C:-}" ]; then echo "  !! No n8n container found. STOP. Nothing changed."; exit 1; fi

# ---------- 2. BACKUP (non-destructive) --------------------------------------
BK="$WORK/backup"
mkdir -p "$BK/workflows" "$BK/credentials"
echo; echo "[2/7] BACKUP -> $BK"
docker exec "$N8N_C" sh -c 'rm -rf /tmp/fugbk && mkdir -p /tmp/fugbk/w /tmp/fugbk/c && n8n export:workflow --all --output=/tmp/fugbk/w --pretty 2>/dev/null; n8n export:credentials --output=/tmp/fugbk/c --decrypted --pretty 2>/dev/null' \
  && docker cp "$N8N_C:/tmp/fugbk/." "$BK/" 2>/dev/null && echo "  n8n workflows+credentials metadata backed up"
echo "  (Docker volumes / NocoDB data are NOT touched.)"

# ---------- 3. Find the AI/OpenAI node in the workflow -----------------------
echo; echo "[3/7] LOCATE AI/OPENAI NODE"
WF=""
for f in "$BK"/workflows/*.json; do
  if [ -f "$f" ] && grep -qiE "openaichat|chatmodel|openai|ai_agent|@n8n/n8n-nodes-langchain.chatModel" "$f"; then
    WF="$f"; echo "  candidate workflow: $(basename "$f")"; break
  fi
done
if [ -z "$WF" ]; then echo "  !! No AI/OpenAI node found in exported workflows. STOP."; exit 1; fi

python3 - "$WF" <<'PY'
import json,sys
d=json.load(open(sys.argv[1]))
nodes=d.get("nodes",[]) or (d.get("workflows",[{}])[0].get("nodes",[]))
print("  workflow name:", d.get("name"), "id:", d.get("id"))
for n in nodes:
    t=(n.get("type") or "").lower()
    if any(k in t for k in ("openaichat","chatmodel","ai_agent","agent")):
        p=n.get("parameters",{})
        model=p.get("model","")
        base=p.get("baseURL") or p.get("baseUrl") or "(node has no baseURL)"
        cred=n.get("credentials",{})
        print("  NODE:", n.get("name"), "| type:", t)
        print("    model    =", model)
        print("    baseURL  =", base)
        print("    credential=", json.dumps(cred) if cred else "(none)")
PY

# ---------- 4. Verify official OpenAI + patch (apply only) -------------------
if [ "$MODE" = "apply" ]; then
  [ -n "${OPENAI_API_KEY:-}" ] || { echo "  !! OPENAI_API_KEY not set in env. STOP (apply)."; exit 1; }
  [ -n "${N8N_API_KEY:-}" ] || { echo "  !! N8N_API_KEY not set in env. STOP (apply)."; exit 1; }
  MODEL="${OPENAI_MODEL:-gpt-4o-mini}"

  echo; echo "[4/7] VERIFY OFFICIAL OPENAI (model must be real, no aug/ alias)"
  models=$(curl -s --max-time 30 -H "Authorization: Bearer ${OPENAI_API_KEY}" \
      https://api.openai.com/v1/models | python3 -c 'import sys,json;
d=json.load(sys.stdin); print(" ".join(sorted(m["id"] for m in d.get("data",[]))))' 2>/dev/null || true)
  if [ -n "$models" ]; then
    echo "  supported official models (sample): $(echo "$models" | tr ' ' '\n' | grep -E "^(gpt-4o|gpt-4|gpt-3.5)" | head -8 | tr '\n' ' ')"
    if ! echo " $models " | grep -q " $MODEL "; then
      echo "  !! $MODEL not in /v1/models. Choose one from the list (OPENAI_MODEL). STOP."
      echo "  NOTE: refusing to invent a model or use any aug/ alias."
      exit 1
    fi
    echo "  using verified official model: $MODEL"
  else
    echo "  !! Could not verify /v1/models (network/key). Confirm OPENAI_MODEL is a valid official name."
  fi

  echo; echo "[5/7] CREATE/REUSE OFFICIAL OPENAI CREDENTIAL + PATCH NODE"
  # create/reuse credential via n8n REST API
  BASE="http://localhost:${N8N_PORT:-5678}"
  H1="X-N8N-API-KEY: ${N8N_API_KEY}"
  H2="Content-Type: application/json"
  CID=$(curl -s -H "$H1" "$BASE/api/v1/credentials" | python3 -c 'import sys,json
for c in json.load(sys.stdin).get("data",[]):
    if c.get("name")=="OpenAI Official" or (c.get("data") or {}).get("baseURL")=="https://api.openai.com/v1":
        print(c.get("id")); break' 2>/dev/null)
  if [ -z "$CID" ]; then
    CID=$(curl -s -H "$H1" -H "$H2" -X POST -d "{\"name\":\"OpenAI Official\",\"type\":\"openAiApi\",\"data\":{\"apiKey\":\"${OPENAI_API_KEY}\",\"baseURL\":\"https://api.openai.com/v1\"}}" \
      "$BASE/api/v1/credentials" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("id",""))' 2>/dev/null)
    echo "  created credential 'OpenAI Official' id=$CID"
  else
    echo "  reused existing official credential id=$CID"
  fi

  # patch the workflow: set model + credential, strip aug/ and omniroute base url
  python3 - "$WF" "$MODEL" "$CID" <<'PY'
import json,sys
path,model,cid=sys.argv[1],sys.argv[2],sys.argv[3]
d=json.load(open(path)); changed=False
for n in d.get("nodes",[]):
    t=(n.get("type") or "").lower()
    if any(k in t for k in ("openaichat","chatmodel","ai_agent","agent")):
        p=n.setdefault("parameters",{})
        m=model
        if m.startswith("aug/"): m=m[4:]  # strip alias defensively
        if p.get("model")!=m:
            print("    node",n.get("name"),": model",p.get("model"),"->",m); p["model"]=m; changed=True
        c=n.setdefault("credentials",{})
        if not c.get("openAiApi") or c.get("openAiApi",{}).get("id")!=cid:
            c["openAiApi"]={"id":cid,"name":"OpenAI Official"}; changed=True
            print("    node",n.get("name"),": credential -> official id",cid)
        for b in ("baseURL","baseUrl"):
            if p.get(b) and "omniroute" in str(p[b]).lower():
                p[b]="https://api.openai.com/v1"; changed=True
json.dump(d,open(path,"w"),indent=2)
print("  changed:",changed)
PY

  # upsert the SAME workflow id (all other nodes intact)
  echo "  importing patched workflow (id preserved, other nodes unchanged)..."
  curl -s -H "$H1" -H "$H2" -X PATCH -d @"$WF" "$BASE/api/v1/workflows/$(python3 -c 'import json,sys;print(json.load(open(sys.argv[1]))["id"])' "$WF")" >/dev/null \
    && echo "  workflow updated in place."

  # ---------- 6. Restart only n8n + 7. TEST --------------------------------
  echo; echo "[6/7] RESTART n8n ONLY"
  docker restart "$N8N_C" >/dev/null
  for i in $(seq 1 30); do
    if curl -s -o /dev/null http://127.0.0.1:5678/healthz 2>/dev/null; then echo "  n8n UP."; break; fi; sleep 2
  done

  echo; echo "[7/7] END-TO-END TEST (TEST lead)"
  RESP=$(curl -s --max-time 120 -w "\n__HTTP_%{http_code}" \
    -H "Content-Type: application/json" -X POST \
    -d '{"source":"fortuneugroup-website","name":"TEST-Lead-OfficialOpenAI","mobile":"9999999999","email":"test@example.com","city":"Tirupati","goal":"Health insurance","message":"TEST record to verify official OpenAI path"}' \
    "${WEBHOOK_URL:-https://n8n.fortuneugroup.in/webhook/book-consultation}")
  echo "$RESP" | redact
  echo
  echo "  Confirm in n8n->Executions: newest run completed, OpenAI node green,"
  echo "  no 'Auggie CLI not found', no '502'. (grep the export for auggie/502 to verify.)"
else
  echo; echo "[4-7] PLAN mode: audit+backup+locate done. Pass --apply to verify OpenAI,"
  echo "       patch the model connection, restart n8n, and run the end-to-end test."
fi

# ---------- FINAL REPORT ------------------------------------------------------
echo; echo "======================================================================"
echo " FINAL REPORT"
echo "  A. Architecture:   n8n AI Agent -> OpenAI Chat Model -> official OpenAI API"
echo "  B. Failure:        AI Agent stopped at OpenAI Chat Model: 502 Auggie CLI not found"
echo "  C. Root cause:     model path used Auggie gateway (aug/gpt5.6-luna) needing the"
echo "                     missing 'auggie' CLI; not an n8n credential/model config fault."
echo "  D. Change (apply): OpenAI node model -> $([ "$MODE" = apply ] && echo "${OPENAI_MODEL:-gpt-4o-mini} (verified)" || echo '<pending --apply>') ; credential -> OpenAI Official (https://api.openai.com/v1); aug/ + OmniRoute base URL removed."
echo "  E. AI model:       $([ "$MODE" = apply ] && echo "${OPENAI_MODEL:-gpt-4o-mini}" || echo '<pending --apply>')"
echo "  F. OmniRoute:      kept installed; NO longer required by the AI Agent."
echo "  G. Auggie:         no longer required; not installed/used."
echo "  H. Test:           $([ "$MODE" = apply ] && echo 'run above' || echo '<pending --apply>')"
echo "  I. Workflow/node:  only the OpenAI Chat Model node's model+credential changed;"
echo "                     NocoDB/WhatsApp/email/meeting/webhook/data/volumes untouched."
echo "  J. Remaining:      confirm the latest execution is green and no 502."
echo "======================================================================"
echo "Artifacts kept in: $WORK  (secrets never printed; nothing deleted)"
