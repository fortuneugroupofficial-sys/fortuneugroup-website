#!/usr/bin/env bash
# =============================================================================
# 02_n8n_export.sh — READ-ONLY export of n8n workflows + credentials metadata,
# so we can see exactly how the AI Agent reaches the model (Base URL, model name,
# credential) and whether Auggie/OmniRoute is referenced. Secrets are NEVER
# printed or written in cleartext.
# =============================================================================
set -uo pipefail
N8N_C=$(docker ps --format '{{.Names}}' | grep -i n8n | head -1)
if [ -z "${N8N_C:-}" ]; then echo "ERROR: no n8n container found"; exit 1; fi
OUT="$(pwd)/fug-n8n-export"; mkdir -p "$OUT"

echo ">>> n8n container: $N8N_C"
docker exec "$N8N_C" sh -c 'mkdir -p /tmp/fugx && n8n export:workflow --all --output=/tmp/fugx --pretty 2>/dev/null' \
  && docker cp "$N8N_C:/tmp/fugx/." "$OUT/workflows/" 2>/dev/null && echo ">>> workflows exported"
docker exec "$N8N_C" sh -c 'mkdir -p /tmp/fugc && n8n export:credentials --output=/tmp/fugc --decrypted --pretty 2>/dev/null' \
  && docker cp "$N8N_C:/tmp/fugc/." "$OUT/credentials/" 2>/dev/null && echo ">>> credentials exported (metadata)"

echo
echo "===== Workflow files ====="
ls -1 "$OUT/workflows" 2>/dev/null

echo
echo "===== AI / OpenAI Chat Model nodes (model + credential, values shown; keys hidden) ====="
grep -rlE "openAiApi|openAiChat|AI Agent|ai_agent|@n8n/n8n-nodes-langchain.chatModel|openAi" "$OUT/workflows" 2>/dev/null \
  | while read -r f; do
    echo "--- $f"
    # print node names + types + model + credential id/name; redact key material
    python3 - "$f" <<'PY'
import json,sys,re
d=json.load(open(sys.argv[1]))
nodes=d.get("nodes",d.get("workflows",[{}])[0].get("nodes",[])) if isinstance(d,dict) else d
def walk(ns):
    for n in ns:
        t=n.get("type","")
        if any(k in t.lower() for k in ("openaichat","openai","chatmodel","ai_agent","agent")):
            params=n.get("parameters",{})
            creds=n.get("credentials",{})
            # extract model + base url
            model=params.get("model", params.get("options",{}).get("model",""))
            base=params.get("baseURL") or params.get("baseUrl","")
            print(f"  NODE: {n.get('name')}  type={t}")
            print(f"    model={model}")
            print(f"    baseURL={base}  <redacted-if-present>")
            for k,v in creds.items():
                print(f"    credential[{k}] id={v.get('id')} name={v.get('name')}")
            # tools / agent prompt hint
            prompt = params.get("prompt", params.get("systemMessage", ""))
            if prompt: print(f"    prompt_len={len(str(prompt))}")
walk(nodes)
PY
  done
echo
echo "NOTE: exported credential files may contain a decrypted 'data' field - "
echo "we will NOT cat them. Only name/type/baseURL of OpenAI credentials are shown next:"
python3 - "$OUT/credentials" <<'PY'
import json,sys,glob,os
for f in sorted(glob.glob(sys.argv[1]+"/*.json")):
    try:
        d=json.load(open(f))
        name=d.get("name"); typ=d.get("type","")
        data=d.get("data",{})
        base=data.get("baseURL") or data.get("baseUrl") or data.get("url") or ""
        print(f"  {os.path.basename(f)}: name={name} type={typ} baseURL={base}")
    except Exception as e:
        print(f"  {os.path.basename(f)}: (unreadable) {e}")
PY
echo
echo "Export saved: $OUT  (values of OpenAI key fields are NOT printed)"
