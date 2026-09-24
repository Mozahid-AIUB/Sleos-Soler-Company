# Deploy — GitHub → Coolify (Contabo VPS)

Contabo VPS (`194.233.85.160`, hostname `vmi3542165`)-এ **Coolify** চলে (Traefik proxy সহ)।
OSLEOS সেখানে একটা **আলাদা Coolify Project** হিসেবে চলবে — নিজস্ব container, নিজস্ব domain,
অন্য কোনো project-এ হাত দেয় না।

```
git push main ──► GitHub Actions: lint + build (চেক)
                     │ পাস করলে
                     ▼
                  Coolify deploy webhook ──► Dockerfile দিয়ে image build ──► নতুন container চালু
```

ভাঙা code কখনো live-এ যায় না — চেক fail করলে deploy হয় না।

---

## ১. Coolify-তে নতুন Project (একবার)

Coolify dashboard খুলুন (`http://194.233.85.160:8000` বা আপনার Coolify domain)।

1. **Projects → + Add** → নাম `OSLEOS` → Save
2. `production` environment → **+ New Resource → Public Repository**
3. Repository URL: `https://github.com/Mozahid-AIUB/Sleos-Soler-Company` · Branch: `main`
4. **Build Pack: Dockerfile** (repo-র root-এ `Dockerfile` আছে)
5. **Ports Exposes: `3000`**
6. **Domains:** আপাতত Coolify-র দেওয়া sslip.io ঠিকানাই থাকুক; domain পেলে `https://osleos.com,https://www.osleos.com` দিন
   (DNS-এ `A` record → `194.233.85.160`; SSL Coolify নিজে নেবে)
7. **Deploy** চাপুন — প্রথম build ৩–৫ মিনিট লাগে

## ২. Auto deploy চালু (একবার)

1. Coolify-তে OSLEOS resource → **Webhooks** → **Deploy Webhook** URL copy করুন
2. Coolify → **Keys & Tokens → API tokens → Create** (permission: `deploy`) → token copy করুন
3. GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | মান |
|---|---|
| `COOLIFY_WEBHOOK` | ধাপ ১-এর Deploy Webhook URL |
| `COOLIFY_TOKEN` | ধাপ ২-এর API token |

এরপর থেকে `main`-এ push করলেই live site update হবে।
GitHub → **Actions** tab-এ প্রতিটা deploy-এর অবস্থা দেখা যায়।

> Token বা webhook কখনো chat/code-এ রাখবেন না — শুধু GitHub Secrets-এ।

---

## Local-এ Docker দিয়ে চালানো (ঐচ্ছিক)

```bash
docker build -t osleos .
docker run -p 3000:3000 osleos   # http://localhost:3000
```

## সমস্যা হলে

- **Build fail:** Coolify → resource → **Deployments** → log দেখুন
- **Site খুলছে না:** Ports Exposes `3000` আছে কিনা, domain-এর DNS ঠিক আছে কিনা দেখুন
- **আগের version-এ ফেরা:** Coolify → Deployments → আগের deployment → **Redeploy**
