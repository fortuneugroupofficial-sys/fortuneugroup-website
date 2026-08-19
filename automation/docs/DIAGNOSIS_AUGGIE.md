# Read-only diagnosis — OpenAI Chat Model fails: `aug/gpt5.6-luna` → Auggie CLI not found

> No changes applied. This report is diagnostic only; the fix waits for your approval.

## The exact error
```
[502] Auggie CLI not found: auggie. Install it and run "auggie login", or set AUGGIE_BIN to an absolute path.
```

## What this error means (grounded, not guessed)
- `auggie` is the **Augment Code** CLI (npm package `@augmentcode/auggie`, installed as the `auggie`
  command). It authenticates via `auggie login` (writes a session token) and is invoked as a
  subprocess by an **Auggie gateway/wrapper**.
- The error is produced by that Auggie gateway when it tries to spawn the `auggie` binary to serve
  the requested model and the binary is **not found** (not installed, not on `PATH`, or
  `AUGGIE_BIN` unset). It returns **HTTP 502** to n8n.
- **n8n is not trying to run the `auggie` CLI itself.** n8n's OpenAI Chat Model node makes a normal
  HTTP call to the Base URL; the Auggie gateway is the thing that needs the `auggie` binary. So the
  missing binary is on the **host/container where Auggie runs**, not in n8n.

## Your questions, answered

**1. Where is `aug/gpt5.6-luna` routed?**
The OpenAI Chat Model node's **Base URL** points at an **OpenAI-compatible Auggie gateway** (part
of the OmniRoute/proxy stack). The model string `aug/gpt5.6-luna` is the gateway's routing key:
provider/prefix `aug`, alias `gpt5.6-luna`. Auggie is expected to resolve that alias to an upstream
and serve it through the `auggie` CLI.

**2. Is Auggie intentionally used through OmniRoute/proxy?**
**Yes — almost certainly.** Both the `aug/` model prefix and the fact that the error comes from
Auggie (not OpenAI) show the node was deliberately pointed at the Auggie gateway via the proxy
setup. This is not a typo in the credential/model.

**3. Does the Auggie CLI exist on the VPS?**
I cannot verify from this sandbox (VPS unreachable, `HTTP 000`, no SSH). The **502 implies the Auggie
gateway is up but cannot locate the `auggie` binary**, i.e. it is missing, not on `PATH`, or
`AUGGIE_BIN` is unset. Confirm on the VPS (read-only commands below).

**4. Why n8n "cannot find it"?**
n8n isn't looking for it. The chain is:
`n8n → HTTP → Auggie gateway → spawn("auggie", …) → FAIL: not found → 502 back to n8n`.
So the fix belongs on the **Auggie host/container**, not in n8n.

**5. Intended installation/config (if it's missing):**
Auggie is already deployed as the gateway. The missing piece is the `auggie` CLI + auth on the
machine running Auggie:
```
npm install -g @augmentcode/auggie   # Auggie CLI (Augment Code)
auggie login                          # creates session auth (AUGMENT_SESSION_AUTH / token)
export AUGGIE_BIN="$(command -v auggie)"   # or an absolute path, set in the Auggie service env
```
`AUGGIE_BIN` must be set in the environment of the **Auggie** service/container (not n8n).

**6. Are the OpenAI Chat Model credential and Base URL correct?**
The credential is a **custom Base-URL OpenAI-compatible credential** pointing at Auggie; the model
is `aug/gpt5.6-luna`. As configured, this is **consistent with the intended Auggie routing** — the
credential/Base URL are likely correct and should **not** be changed. The failure is downstream at
Auggie's missing CLI dependency, not the n8n credential.

## Root cause (exact)
The AI Agent's **OpenAI Chat Model** node is correctly configured to route `aug/gpt5.6-luna` through
the **Auggie gateway**, but the Auggie gateway cannot execute because the **`auggie` CLI binary is
not available** on the Auggie host/container (missing, not on `PATH`, or `AUGGIE_BIN` unset). Auggie
therefore returns **HTTP 502 "Auggie CLI not found"**, which is exactly where the AI Agent step stops
— after the lead is saved in NocoDB (NocoDB save doesn't depend on Auggie).

## Smallest non-destructive fix (waits for your approval)
Only on the **Auggie host/container** — nothing in n8n, NocoDB, WhatsApp, Gmail, meeting, webhook,
proxy, credentials, or data changes:
1. Install the CLI: `npm install -g @augmentcode/auggie`
2. Authenticate: `auggie login`
3. Set `AUGGIE_BIN` to its absolute path (and/or put its dir on `PATH`) in the **Auggie service env**.
4. Restart/retry the AI Agent execution.

If after the CLI is present Auggie still returns a **model-not-found** error for `gpt5.6-luna`, then
the alias mapping in Auggie's config needs checking next — but that is a *second* step and only after
the CLI blocker is cleared.

## Read-only checks to run on the VPS (to confirm #3–#5 before any change)
```bash
# on the host
which auggie && auggie --version || echo "auggie NOT installed"
echo "AUGGIE_BIN=${AUGGIE_BIN:-<unset>}"

# if Auggie runs in a container
docker ps --format '{{.Names}}\t{{.Image}}' | grep -i aug || echo "no aug container"
docker exec <auggie_container> sh -c 'which auggie; echo AUGGIE_BIN=${AUGGIE_BIN:-unset}'
```
These only read. Nothing is changed.
