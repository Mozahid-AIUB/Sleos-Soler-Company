# Deploy — GitHub → Coolify (Contabo VPS)

Contabo VPS (`194.233.85.160`, hostname `vmi3542165`)-এ **Coolify** চলে (Traefik proxy সহ)।
OSLEOS সেখানে একটা **আলাদা Coolify Project** হিসেবে চলবে — নিজস্ব container, নিজস্ব domain,
অন্য কোনো project-এ হাত দেয় না।

```
git push main ──► GitHub Actions: lint + build (CI)
                     │
VPS watcher (প্রতি মিনিটে) ── নতুন commit + CI পাস? ──► Coolify deploy ──► নতুন container
```

Coolify-র port (8000) firewall-এ বন্ধ থাকে, তাই GitHub সরাসরি Coolify-কে ডাকতে পারে না।
তার বদলে VPS-এর ভেতরে একটা ছোট watcher (`systemd timer`) GitHub দেখে আর localhost-এ Coolify-কে deploy করতে বলে।
ভাঙা code কখনো live-এ যায় না — CI fail করলে deploy হয় না। কোনো GitHub secret লাগে না।

**এখনকার অবস্থা:** OSLEOS Coolify-তে চালু — `http://ckh8lukpshfd81bis9a0yaae.194.233.85.160.sslip.io`
(Coolify app uuid `ckh8lukpshfd81bis9a0yaae`, build pack Dockerfile, port 3000)

---

## Coolify dashboard খোলা

Firewall শুধু কয়েকটা IP থেকে port 8000 খুলতে দেয়। অন্য জায়গা থেকে SSH tunnel:

```
ssh -i ~/.ssh/vps_vmi3542165 -N -L 8000:127.0.0.1:8000 root@194.233.85.160
```
তারপর browser-এ `http://localhost:8000`।

## Auto deploy চালু (একবার)

1. Coolify → **Keys & Tokens → API tokens → Create** — নাম `osleos-autodeploy`, permission **deploy** আর **read** → token copy
2. VPS-এ SSH করে:
   ```bash
   curl -fsSL https://raw.githubusercontent.com/Mozahid-AIUB/Sleos-Soler-Company/main/deploy/autodeploy/install.sh | sudo bash
   ```
   Token চাইলে paste করুন (লেখা দেখা যাবে না)। Token শুধু `/root/osleos-autodeploy/token`-এ থাকে।

এরপর `main`-এ push → CI পাস → ১–২ মিনিটের মধ্যে Coolify নতুন build শুরু করে।

```bash
journalctl -u osleos-autodeploy -f          # watcher log
systemctl list-timers osleos-autodeploy     # timer চলছে কিনা
```

## Domain

DNS-এ `A` record → `194.233.85.160` (`@` আর `www`)। তারপর Coolify → OSLEOS app → **Domains**-এ
`https://osleos.com,https://www.osleos.com` → Save → Redeploy। SSL Coolify নিজে নেয়।

---

## Cloudflare (বাংলাদেশে দ্রুত load-এর জন্য — domain পেলে)

Server Singapore-এ (বাংলাদেশ থেকে ~৪৯ms)। Cloudflare-এর ঢাকা edge থাকায় site cache হয়ে ঢাকা থেকেই আসবে।
Site-এ কোনো cookie/login নেই, তাই পুরো site edge-এ cache করা নিরাপদ।

1. Cloudflare-এ free account → **Add site** → domain দিন → registrar-এ nameserver দুটো Cloudflare-এরগুলো দিয়ে বদলান
2. **DNS:** `A  @  194.233.85.160` আর `CNAME  www  @` — শুরুতে **DNS only (ধূসর মেঘ)** রাখুন
3. Coolify → OSLEOS → Domains-এ `https://domain.com,https://www.domain.com` → Save → Redeploy
   (Coolify Let's Encrypt SSL নেবে; site `https`-এ খুললে পরের ধাপ)
4. DNS record দুটো **Proxied (কমলা মেঘ)** করুন · **SSL/TLS → Full (strict)**
5. **Speed:** Brotli, HTTP/3, Early Hints — চালু রাখুন
6. **Caching → Cache Rules** (এই ক্রমে):
   - *Static files* — URI path starts with `/_next/static/` **or** `/media/` **or** `/brand/` **or** `/_next/image` → **Eligible for cache**, Edge TTL: *Use cache-control header*
   - *Pages* — Hostname equals domain → **Eligible for cache**, Edge TTL **override: 10 minutes**, Browser TTL: *Respect origin*

> ⚠️ HTML-এর edge TTL ছোট (১০ মিনিট) রাখা জরুরি: নতুন deploy-এর পর পুরনো HTML পুরনো JS file খুঁজবে, যা নতুন container-এ নেই।
> Deploy-এর পর সাথে সাথে update দেখাতে Cloudflare → **Caching → Purge Everything**
> (চাইলে watcher-এ auto-purge যোগ করা যাবে — Cloudflare API token + Zone ID লাগবে)।

## Local-এ Docker দিয়ে চালানো (ঐচ্ছিক)

```bash
docker build -t osleos .
docker run -p 3000:3000 osleos   # http://localhost:3000
```

## সমস্যা হলে

- **Build fail:** Coolify → resource → **Deployments** → log দেখুন
- **Site খুলছে না:** Ports Exposes `3000` আছে কিনা, domain-এর DNS ঠিক আছে কিনা দেখুন
- **আগের version-এ ফেরা:** Coolify → Deployments → আগের deployment → **Redeploy**
