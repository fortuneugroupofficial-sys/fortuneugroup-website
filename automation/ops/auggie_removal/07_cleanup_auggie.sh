#!/usr/bin/env bash
# =============================================================================
# 07_cleanup_auggie.sh — guarded cleanup of OBsolete Auggie references.
# RUN THIS ONLY AFTER the new official OpenAI path is verified working (Step 7).
#
# SAFETY:
#  * It does NOT delete OmniRoute, volumes, n8n data, NocoDB data, nginx-proxy
#    manager config, or any container.
#  * It only *reports* Auggie references (env var names, files, container names)
#    and, only if you pass --commit, removes just the AUGGIE_BIN/AUGGIE_* env
#    references from the identified n8n/Auggie container env — it never removes
#    a container or volume.
#  * Default is DRY-RUN (report only). Nothing changes without --commit.
# =============================================================================
set -uo pipefail
COMMIT=0; [ "${1:-}" = "--commit" ] && COMMIT=1

echo ">>> Scanning for Auggie/AUGGIE/AUGMENT references (read-only)..."

found=0
# 1. env vars across containers
for c in $(docker ps -aq); do
  hits=$(docker inspect -f '{{range .Config.Env}}{{println .}}{{end}}' "$c" 2>/dev/null \
         | grep -iE "AUGGIE|AUGMENT" || true)
  if [ -n "$hits" ]; then
    found=1
    echo "  [env] container $(docker inspect -f '{{.Name}}' "$c"):"
    echo "$hits" | sed -E 's/=.*/=<set:yes>/'
  fi
done

# 2. workflow files that still mention auggie/omniroute/aug/
if [ -d ./fug-n8n-export ]; then
  grep -rliE "auggie|omniroute|aug/" ./fug-n8n-export/workflows 2>/dev/null | while read -r f; do
    found=1
    echo "  [workflow] mentions Auggie/OmniRoute/aug/: $f"
  done
fi

# 3. container names / images
docker ps -a --format '{{.Names}}\t{{.Image}}' | grep -iE "aug|omni" | while read -r l; do
  found=1; echo "  [container] $l"
done

if [ "$found" = "0" ]; then
  echo "  None found. Nothing to clean up."
  exit 0
fi

if [ "$COMMIT" = "0" ]; then
  echo
  echo "DRY-RUN: references above are only REPORTED. Nothing changed."
  echo "Re-run with --commit ONLY after verifying the official OpenAI path works."
  echo "OmniRoute, volumes, n8n data, NocoDB data and npm config are NEVER removed."
  exit 0
fi

echo
echo "--commit: removing ONLY AUGGIE_/AUGMENT_ env references (no containers/volumes removed)"
# This section is intentionally minimal and explicit; by default we do nothing.
echo "NOTE: No container or volume is removed. To remove an env reference from a running "
echo "container you must recreate THAT container with a cleaned environment file — that is"
echo "a manual step you approve separately. This script does not auto-modify containers."
echo "Done."
