#!/usr/bin/env bash
# One-time VPS setup for OSLEOS. Safe alongside other sites: it only creates
# /var/www/osleos, the `osleos` Nginx site and (if missing) installs PM2.
#
# Usage (as root or with sudo):
#   sudo bash setup-vps.sh <domain> <deploy-user>
#   e.g. sudo bash setup-vps.sh osleos.com ubuntu
set -euo pipefail

DOMAIN="${1:?domain required, e.g. osleos.com}"
DEPLOY_USER="${2:?deploy user required, e.g. ubuntu}"
APP_DIR=/var/www/osleos
PORT=3100
HERE="$(cd "$(dirname "$0")" && pwd)"

echo "==> Checking Node.js (needs 20+)"
if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 20 ]; then
  echo "Node.js 20+ not found. Install it first, e.g.:"
  echo "  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs"
  exit 1
fi
node -v

echo "==> Checking port $PORT is free"
if ss -ltn | grep -q ":$PORT "; then
  echo "Port $PORT is already used by another app. Pick another port and update"
  echo "deploy/ecosystem.config.cjs, deploy/nginx-osleos.conf and the workflow health check."
  exit 1
fi

echo "==> Installing PM2 if missing"
command -v pm2 >/dev/null || npm install -g pm2

echo "==> Creating $APP_DIR (owned by $DEPLOY_USER)"
mkdir -p "$APP_DIR/releases"
chown -R "$DEPLOY_USER":"$DEPLOY_USER" "$APP_DIR"

echo "==> Nginx site"
if command -v nginx >/dev/null; then
  sed "s/DOMAIN_HERE/$DOMAIN/g" "$HERE/nginx-osleos.conf" > /etc/nginx/sites-available/osleos
  ln -sfn /etc/nginx/sites-available/osleos /etc/nginx/sites-enabled/osleos
  nginx -t && systemctl reload nginx
else
  echo "Nginx not installed — install it (sudo apt-get install -y nginx) and re-run."
  exit 1
fi

echo "==> PM2 on boot for $DEPLOY_USER"
env PATH="$PATH" pm2 startup systemd -u "$DEPLOY_USER" --hp "$(eval echo ~"$DEPLOY_USER")" >/dev/null || true

cat <<EOF

Done. Next steps:
  1. Point DNS A records for $DOMAIN and www.$DOMAIN to this server's IP.
  2. HTTPS:  sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN
  3. Add the GitHub secrets (docs/DEPLOY.md) and push to main — the first
     deploy starts the 'osleos' PM2 app automatically.
EOF
