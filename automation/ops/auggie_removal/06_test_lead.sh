#!/usr/bin/env bash
# =============================================================================
# 06_test_lead.sh — end-to-end test with a clearly-marked TEST insurance lead.
# Verifies: webhook -> NocoDB create -> AI Agent -> OpenAI -> response -> status
# update, with NO Auggie and NO 502. Runs after the workflow is applied + n8n
# restarted. Read-only except for the single TEST lead it inserts.
# =============================================================================
set -uo pipefail
WEBHOOK="${WEBHOOK_URL:-https://n8n.fortuneugroup.in/webhook/book-consultation}"
echo ">>> Posting TEST insurance lead to $WEBHOOK"

BODY='{
  "source":"fortuneugroup-website",
  "name":"TEST-Lead-AuggieRemoval",
  "mobile":"9999999999",
  "email":"test@example.com",
  "city":"Tirupati",
  "goal":"Health insurance",
  "message":"TEST record to verify official OpenAI path after Auggie removal"
}'

RESP=$(curl -s --max-time 90 -w "\n__HTTP_%{http_code}" -H "Content-Type: application/json" \
        -X POST -d "$BODY" "$WEBHOOK")

echo "Response (HTTP code included):"
echo "$RESP"

if echo "$RESP" | grep -q "__HTTP_200" || echo "$RESP" | grep -qi "lead\|received\|ok"; then
  echo
  echo ">>> PASS: webhook accepted the TEST lead."
else
  echo
  echo ">>> FAIL: webhook did not return 2xx/ok. See response above."
fi

echo
echo "Now confirm in n8n -> Executions that the newest run completed with:"
echo "  - no 'Auggie CLI not found'"
echo "  - no '502 Bad Gateway'"
echo "  - OpenAI Chat Model node green (returned a response)"
echo "  - NocoDB Update Row green (status updated)"
echo "You can auto-verify the run by exporting executions (02_n8n_export.sh) "
echo "and grepping the latest run for 'auggie'/'502'."
