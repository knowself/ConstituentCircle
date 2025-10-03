#!/usr/bin/env bash
set -euo pipefail

bad=$(git ls-files | grep -E "(^|/)(lib/database/|dataconnect|dataconnect-generated|replit)") || true
if [[ -n "$bad" ]]; then
  echo "? Disallowed legacy files detected:"
  echo "$bad"
  exit 1
fi

echo "? No legacy files detected."
