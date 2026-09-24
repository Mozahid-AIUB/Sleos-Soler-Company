#!/usr/bin/env bash
# One-time install of the OSLEOS auto-deploy watcher on the Coolify VPS.
# Asks for a Coolify API token (abilities: deploy, read) — typed input is hidden
# and saved only to /root/osleos-autodeploy/token (root-only).
#
#   curl -fsSL https://raw.githubusercontent.com/Mozahid-AIUB/Sleos-Soler-Company/main/deploy/autodeploy/install.sh | sudo bash
set -euo pipefail

RAW="https://raw.githubusercontent.com/Mozahid-AIUB/Sleos-Soler-Company/main/deploy/autodeploy"
DIR=/root/osleos-autodeploy
umask 077
mkdir -p "$DIR"

curl -fsSL "$RAW/osleos-autodeploy.sh" -o /usr/local/bin/osleos-autodeploy
chmod 755 /usr/local/bin/osleos-autodeploy

if [ ! -s "$DIR/token" ]; then
  printf 'Paste the Coolify API token (hidden): ' > /dev/tty
  IFS= read -rs token < /dev/tty
  echo > /dev/tty
  [ -n "$token" ] || { echo "No token given — aborting."; exit 1; }
  printf '%s' "$token" > "$DIR/token"
fi

code=$(curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $(<"$DIR/token")" \
  http://127.0.0.1:8000/api/v1/applications/ckh8lukpshfd81bis9a0yaae)
if [ "$code" != "200" ]; then
  echo "Token check failed (HTTP $code). Remove $DIR/token and run again with a valid token."
  exit 1
fi

# Don't redeploy what's already live.
git ls-remote https://github.com/Mozahid-AIUB/Sleos-Soler-Company.git refs/heads/main | cut -f1 > "$DIR/last_sha"

cat > /etc/systemd/system/osleos-autodeploy.service <<'EOF'
[Unit]
Description=OSLEOS: redeploy from GitHub via Coolify when main changes
After=network-online.target docker.service

[Service]
Type=oneshot
ExecStart=/usr/local/bin/osleos-autodeploy
EOF

cat > /etc/systemd/system/osleos-autodeploy.timer <<'EOF'
[Unit]
Description=Check GitHub for new OSLEOS commits every minute

[Timer]
OnBootSec=2min
OnUnitActiveSec=60s
Unit=osleos-autodeploy.service

[Install]
WantedBy=timers.target
EOF

systemctl daemon-reload
systemctl enable --now osleos-autodeploy.timer
echo "Auto-deploy is on. Logs: journalctl -u osleos-autodeploy -f"
