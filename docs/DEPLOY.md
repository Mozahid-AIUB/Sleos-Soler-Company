# Deploy — GitHub থেকে Contabo VPS-এ auto deploy

`main` branch-এ push করলেই GitHub Actions site build করে VPS-এ পাঠিয়ে দেয়।
Build হয় GitHub-এর server-এ, তাই VPS-এর RAM/CPU-তে চাপ পড়ে না।

VPS-এ এটা একটা **আলাদা (independent) project** — অন্য কোনো site/app-এ হাত দেয় না:

| জিনিস | মান |
|---|---|
| Folder | `/var/www/osleos` (`releases/` + `current` symlink) |
| Process | PM2 app `osleos` |
| Port | `3100` (শুধু localhost, বাইরে থেকে দেখা যায় না) |
| Nginx | নিজস্ব site file `/etc/nginx/sites-available/osleos` |

শেষ ৩টা release রাখা হয়, তাই দরকার হলে আগের version-এ ফেরা যায়।

---

## ১. VPS-এ একবার setup (SSH terminal-এ)

VPS-টা x86_64 (Contabo-র সাধারণ VPS) হতে হবে — `uname -m` দিলে `x86_64` দেখাবে।

```bash
# Node.js 22, Nginx, Certbot (না থাকলে)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs nginx certbot python3-certbot-nginx

# Deploy-এর জন্য আলাদা user (root দিয়ে deploy না করাই ভালো)
sudo adduser --disabled-password --gecos "" deploy

# Setup script চালান (repo থেকে সরাসরি)
curl -fsSL https://raw.githubusercontent.com/Mozahid-AIUB/Sleos-Soler-Company/main/deploy/setup-vps.sh -o /tmp/setup-vps.sh
curl -fsSL https://raw.githubusercontent.com/Mozahid-AIUB/Sleos-Soler-Company/main/deploy/nginx-osleos.conf -o /tmp/nginx-osleos.conf
sudo bash /tmp/setup-vps.sh YOUR-DOMAIN.com deploy
```

> Repo private হলে `curl` কাজ করবে না — তখন এই দুইটা file হাতে copy করে `/tmp`-এ রাখুন।

## ২. GitHub-এর জন্য SSH key (VPS-এ)

```bash
sudo -u deploy mkdir -p -m 700 /home/deploy/.ssh
sudo -u deploy ssh-keygen -t ed25519 -N "" -f /home/deploy/.ssh/github_deploy
sudo -u deploy sh -c 'cat /home/deploy/.ssh/github_deploy.pub >> /home/deploy/.ssh/authorized_keys'
sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo cat /home/deploy/.ssh/github_deploy   # এই private key পুরোটা copy করুন
```

## ৩. GitHub Secrets

GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | মান |
|---|---|
| `VPS_HOST` | VPS-এর IP (Contabo panel-এ আছে) |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | ধাপ ২-এর private key (`-----BEGIN` থেকে `END-----` পর্যন্ত পুরোটা) |
| `VPS_PORT` | SSH port — `22` হলে না দিলেও চলবে |

## ৪. Deploy

`main`-এ push করুন, অথবা GitHub → **Actions → Deploy to VPS → Run workflow**।
সবুজ ✓ মানে site চালু। প্রথম deploy-এ PM2 নিজে `osleos` app চালু করে।

## ৫. Domain + HTTPS

1. Domain-এর DNS-এ `A` record → VPS IP (`@` আর `www` দুটোই)
2. `sudo certbot --nginx -d YOUR-DOMAIN.com -d www.YOUR-DOMAIN.com`

---

## দরকারি command (VPS-এ, `deploy` user হিসেবে)

```bash
pm2 status              # app চলছে কিনা
pm2 logs osleos         # error দেখতে
pm2 restart osleos      # restart

# আগের version-এ ফেরা
ls -1t /var/www/osleos/releases
ln -sfn /var/www/osleos/releases/<আগের-folder> /var/www/osleos/current && pm2 reload osleos
```

Port বদলাতে চাইলে তিন জায়গায় `3100` বদলাতে হবে: `deploy/ecosystem.config.cjs`, `deploy/nginx-osleos.conf`, `.github/workflows/deploy.yml` (health check)।
