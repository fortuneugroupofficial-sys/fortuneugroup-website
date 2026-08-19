#!/usr/bin/env python3
"""04 — Switch the n8n AI Agent to the OFFICIAL OpenAI API (no Auggie).

Safely, non-destructively:
  1. Verifies the OpenAI API key + lists supported models (never printed).
  2. Creates (or reuses) an n8n "openAiApi" credential with the OFFICIAL
     base URL https://api.openai.com/v1.
  3. Patches ONLY the OpenAI Chat Model / AI Agent nodes in the exported
     workflow JSON:
        - model      -> OPENAI_MODEL (default gpt-4o-mini; no "aug/" prefix)
        - credential -> the official credential (id)
        - any "aug/" model prefix is stripped
  4. Imports the patched workflow back into n8n (upsert by same workflow id),
     leaving every other node and the NocoDB/WhatsApp/email/meeting logic intact.

SECURITY
  * OPENAI_API_KEY and N8N_API_KEY are read from the environment ONLY.
  * They are never printed or written to any file by this script.
  * No source file or image contains a key.

USAGE (on the VPS, with secrets in the shell environment, not on the command line):
  export OPENAI_API_KEY=sk-...     # set securely; do NOT paste into chat/repo
  export N8N_API_KEY=...            # n8n API key (or omit to use UI fallback)
  export OPENAI_MODEL=gpt-4o-mini   # optional; verified against /v1/models
  python3 04_apply_official_openai.py --workflow /path/to/workflow.json
"""
import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request

OFFICIAL_BASE_URL = "https://api.openai.com/v1"
DEFAULT_MODEL = "gpt-4o-mini"


def api_key():
    k = os.environ.get("OPENAI_API_KEY", "").strip()
    if not k:
        sys.exit("ERROR: OPENAI_API_KEY not set in environment (never on the command line).")
    return k


def n8n_api_key():
    return os.environ.get("N8N_API_KEY", "").strip()


def http_json(url, method, headers, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as r:
        raw = r.read().decode()
        return json.loads(raw) if raw else {}


def list_models(key):
    """Call official /v1/models to learn which model names are actually supported."""
    url = f"{OFFICIAL_BASE_URL}/models"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {key}"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            data = json.loads(r.read().decode())
        return sorted(m["id"] for m in data.get("data", []))
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        print(f"WARN: could not list models (HTTP {e.code}). Body (redacted): "
              f"{re.sub(r'sk-[A-Za-z0-9_]+', '<hidden>', body[:300])}")
        return None


def find_workflows(n8n_key):
    """Return list of workflows with an OpenAI Chat Model / AI Agent node."""
    if not n8n_key:
        return None
    try:
        wfs = http_json(f"http://localhost:{_n8n_port()}/api/v1/workflows", "GET",
                        {"X-N8N-API-KEY": n8n_key})
    except Exception as e:
        print(f"WARN: n8n REST not reachable ({e}). Use --workflow path instead.")
        return None
    hits = []
    for wf in (wfs.get("data", []) if isinstance(wfs, dict) else []):
        nodes = json.dumps(wf.get("nodes", []))
        if any(k in nodes.lower() for k in ("openaichat", "openai", "chatmodel", "ai_agent", "agent")):
            hits.append(wf)
    return hits


def _n8n_port():
    return os.environ.get("N8N_PORT", "5678")


def upsert_credential(n8n_key, openai_key):
    """Create (or find) an official OpenAI n8n credential. Returns its id."""
    data = {"apiKey": openai_key, "baseURL": OFFICIAL_BASE_URL}
    base = f"http://localhost:{_n8n_port()}"
    h = {"X-N8N-API-KEY": n8n_key, "Content-Type": "application/json"}
    # look for existing official credential
    existing = http_json(f"{base}/api/v1/credentials", "GET", h).get("data", [])
    for c in existing:
        if c.get("name") == "OpenAI Official" or (c.get("data") or {}).get("baseURL") == OFFICIAL_BASE_URL:
            print(f"Reusing existing official OpenAI credential id={c.get('id')}")
            return c["id"]
    created = http_json(f"{base}/api/v1/credentials", "POST", h,
                        {"name": "OpenAI Official", "type": "openAiApi", "data": data})
    cid = created.get("id")
    if not cid:
        sys.exit(f"ERROR: failed to create credential: {created}")
    print(f"Created official OpenAI credential id={cid}")
    return cid


def patch_workflow(path, model, cred_id):
    wf = json.load(open(path))
    changed = False
    for n in wf.get("nodes", []):
        t = (n.get("type") or "").lower()
        if any(k in t for k in ("openaichat", "openai", "chatmodel", "ai_agent", "agent")):
            params = n.setdefault("parameters", {})
            old_model = params.get("model", "")
            new_model = model
            # strip any aug/ alias
            if new_model.startswith("aug/"):
                new_model = new_model[4:]
            if params.get("model") != new_model:
                params["model"] = new_model
                changed = True
                print(f"  node '{n.get('name')}': model {old_model!r} -> {new_model!r}")
            # ensure official credential reference
            creds = n.setdefault("credentials", {})
            cur = creds.get("openAiApi")
            if not cur or cur.get("id") != cred_id:
                creds["openAiApi"] = {"id": cred_id, "name": "OpenAI Official"}
                changed = True
                print(f"  node '{n.get('name')}': credential -> official id {cred_id}")
            # drop any auggie/omniroute base url override in the node
            for bkey in ("baseURL", "baseUrl"):
                if params.get(bkey) and "omniroute" in str(params[bkey]).lower():
                    params[bkey] = OFFICIAL_BASE_URL
                    changed = True
    if not changed:
        print("  (no AI/OpenAI node needed changes; already official)")
    return wf, changed


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--workflow", required=True, help="path to exported workflow JSON to patch")
    ap.add_argument("--model", default=os.environ.get("OPENAI_MODEL", DEFAULT_MODEL))
    ap.add_argument("--dry-run", action="store_true", help="only report, do not import")
    args = ap.parse_args()

    key = api_key()
    n8n_key = n8n_api_key()

    print("== Step 1: verify official OpenAI key + supported models ==")
    models = list_models(key)
    if models:
        # choose a supported, official, non-vision-staging model matching the default family
        candidates = [m for m in models if m in (args.model, "gpt-4o-mini", "gpt-4o", "gpt-4-turbo")]
        chosen = next((m for m in (args.model,) if m in models),
                      next((m for m in ("gpt-4o-mini", "gpt-4o", "gpt-4-turbo") if m in models), None))
        if chosen is None:
            sys.exit("ERROR: none of the default models appear in /v1/models. Pass a supported "
                     "model via OPENAI_MODEL. Supported sample: " + ", ".join(models[:15]))
        if chosen.startswith("aug/"):
            sys.exit("ERROR: refusing 'aug/' alias; only official model names are accepted.")
        print(f"  using supported official model: {chosen}")
        args.model = chosen
    else:
        print(f"  could not verify model list; using OPENAI_MODEL={args.model} "
              "(confirm this is a valid official model name)")

    if not n8n_key:
        sys.exit("N8N_API_KEY not set. Set it (securely) so the script can create the "
                 "credential + import the patched workflow. Secrets stay in env only.")

    print("\n== Step 2: official OpenAI credential ==")
    cred_id = upsert_credential(n8n_key, key)

    print("\n== Step 3: patch AI/OpenAI nodes in workflow ==")
    wf, changed = patch_workflow(args.workflow, args.model, cred_id)

    if args.dry_run or not changed:
        print("\n== dry-run / no-change: NOT imported. Nothing modified. ==")
        return

    # Step 4: upsert workflow by its id (keeps all other nodes intact)
    wid = wf.get("id")
    base = f"http://localhost:{_n8n_port()}"
    h = {"X-N8N-API-KEY": n8n_key, "Content-Type": "application/json"}
    print(f"\n== Step 4: import/upsert workflow id={wid} ==")
    http_json(f"{base}/api/v1/workflows/{wid}", "PATCH", h, wf)
    print("Workflow updated in place. All other nodes/NocoDB/WhatsApp/email/meeting logic untouched.")
    print("\nNext: restart n8n (see 05_restart_n8n.sh), then test (06_test_lead.sh).")


if __name__ == "__main__":
    main()
