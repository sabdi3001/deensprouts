#!/usr/bin/env bash
# tools/patch_nav.sh
set -euo pipefail
SCRIPT_PATH="js/nav.login-upload-guard.v1107.js"
INCLUDE="<script src=\"${SCRIPT_PATH}?v=1107\"></script>"
FILES=("index.html" "video.html" "contact.html" "policy.html" "upload.html" "auth.html")

for f in "${FILES[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "Skip (not found): $f"
    continue
  fi
  if grep -Fq "$INCLUDE" "$f"; then
    echo "Already patched: $f"
    continue
  fi
  cp "$f" "$f.bak"
  if grep -qi "</body>" "$f"; then
    awk -v inc="$INCLUDE" 'BEGIN{IGNORECASE=1} {sub(/<\/body>/, inc "\n</body>")}1' "$f" > "$f.tmp"
  else
    printf "%s\n" "$INCLUDE" >> "$f"
    mv "$f" "$f.tmp"
  fi
  mv "$f.tmp" "$f"
  echo "Patched: $f"
done
