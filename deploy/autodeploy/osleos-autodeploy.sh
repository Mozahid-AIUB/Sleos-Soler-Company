#!/usr/bin/env bash
# Runs on the Contabo VPS every minute (systemd timer). When `main` on GitHub
# has a new commit AND its GitHub checks passed, ask the local Coolify to
# redeploy OSLEOS. Coolify's port stays closed to the internet.
set -euo pipefail

REPO="Mozahid-AIUB/Sleos-Soler-Company"
APP_UUID="ckh8lukpshfd81bis9a0yaae"
DIR=/root/osleos-autodeploy
STATE="$DIR/last_sha"
COOLIFY="http://127.0.0.1:8000"

sha=$(git ls-remote "https://github.com/$REPO.git" refs/heads/main | cut -f1)
[ -n "$sha" ] || exit 0
[ "$sha" = "$(cat "$STATE" 2>/dev/null || true)" ] && exit 0

# CI gate: wait until every check run for this commit finished successfully.
verdict=$(curl -fsS -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$REPO/commits/$sha/check-runs" | python3 -c '
import json, sys
runs = json.load(sys.stdin).get("check_runs", [])
if not runs or any(r["status"] != "completed" for r in runs):
    print("pending")
elif all(r["conclusion"] in ("success", "skipped", "neutral") for r in runs):
    print("pass")
else:
    print("fail")
') || exit 0

case "$verdict" in
  pending) exit 0 ;;
  fail)
    echo "checks failed for ${sha:0:7} — not deploying"
    echo "$sha" > "$STATE"
    exit 0 ;;
esac

token=$(<"$DIR/token")
curl -fsS -H "Authorization: Bearer $token" "$COOLIFY/api/v1/deploy?uuid=$APP_UUID&force=false" >/dev/null
echo "$sha" > "$STATE"
echo "deploy queued for ${sha:0:7}"
