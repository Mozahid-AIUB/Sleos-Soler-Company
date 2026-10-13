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

## CMS (Payload) — PostgreSQL, env, media volume

Admin panel `https://domain/admin` — একই Next app-এর ভেতরে চলে (আলাদা container লাগে না)। লাগে: একটা PostgreSQL আর
uploaded ছবির জন্য একটা persistent volume। আগের auto deploy watcher আগের মতোই কাজ করে (push → CI পাস → Coolify build);
শুধু নিচের সেটআপ একবার করতে হবে।

### ১. PostgreSQL বানান (একবার)
1. Coolify → একই Project/Environment-এ **New Resource → Database → PostgreSQL**
2. **Public access / "Make it publicly available" বন্ধ রাখুন** — শুধু Coolify-র internal network-এ থাকবে, internet-এ port খুলবে না
3. Start দিন। Database-এর পাতায় **Internal URL** (`postgres://user:password@<service-name>:5432/db`) পাবেন — এটাই `DATABASE_URI`
4. OSLEOS app আর Postgres একই destination/network-এ আছে কিনা দেখুন, নইলে internal hostname resolve হবে না

### ২. OSLEOS app-এর Environment Variables
| Variable | মান |
|---|---|
| `DATABASE_URI` | ধাপ ১-এর Internal URL |
| `PAYLOAD_SECRET` | `openssl rand -hex 32` দিয়ে বানানো ৬৪ অক্ষরের মান — একবার বানিয়ে আর বদলাবেন না |
| `NEXT_PUBLIC_SERVER_URL` | `https://osleos.com` (শেষে `/` নেই) |

- `NEXT_PUBLIC_SERVER_URL` **Build Variable**-ও করুন (browser-এ build-এর সময় বসে)। `DATABASE_URI`/`PAYLOAD_SECRET` runtime-এই লাগে।
- Dockerfile-এ build-এর জন্য placeholder মান দেওয়া আছে, তাই এই দুটো build-এ না দিলেও `next build` ভাঙে না। Placeholder image-এর final stage-এ যায় না।
- **Build-এ DB লাগবে কিনা:** যে পাতা build-এর সময় CMS থেকে data পড়ে (static generation), সেই build-এ DB reachable থাকতে হয়।
  নিরাপদ পথ: CMS-নির্ভর পাতাগুলো dynamic/revalidate করা (build-এ DB query না চালানো) — তাহলে build DB ছাড়াই পাস করে।
  যদি build-এ DB দরকারই হয়, `DATABASE_URI` Build Variable-ও করুন এবং নিশ্চিত করুন build সেই network থেকে DB-তে পৌঁছাতে পারে;
  না পারলে build log-এ connection error আসবে।
- Key কখনো git-এ নয় — শুধু Coolify-তে। নমুনা: `.env.example`

### ৩. Media volume (uploaded ছবি)
Coolify → OSLEOS → **Persistent Storage**-এ নতুন volume যোগ করুন, container path `/app/media`। না করলে প্রতি redeploy-এ upload করা ছবি মুছে যাবে।
- Image-এ `/app/media` `nextjs` user (uid 1001)-এর নামে বানানো; named volume হলে সরাসরি লেখা যাবে।
- Host folder (bind mount) দিলে সেটা root-owned হতে পারে — তখন VPS-এ `chown -R 1001:1001 <host-folder>` করুন, নইলে upload-এ permission error আসবে।
- `public/media/` (code-এর সাথে আসা ছবি) আর `/app/media` (CMS upload) আলাদা — গুলিয়ে ফেলবেন না।

### ৪. প্রথম চালু — owner account
Deploy শেষে `https://domain/admin` খুলুন — database খালি থাকলে Payload **Create first user** ফর্ম দেখায়।
ইমেইল + শক্ত পাসওয়ার্ড দিয়ে owner account বানান। প্রথম user-ই admin; এরপর অন্য user Admin → Users থেকে যোগ করুন।
এটা দেরি না করে করুন — account না বানানো পর্যন্ত যে কেউ ফর্মটা পেতে পারে।

### ৫. Backup
**Database** — Coolify-র PostgreSQL পাতায় **Backups → Scheduled Backup** চালু করুন (দৈনিক, retention সহ; সম্ভব হলে S3-compatible storage-এ, VPS-এর বাইরে)। হাতে নিতে:
```bash
docker exec <postgres-container> pg_dump -U <user> -Fc <db> > /root/backups/osleos-$(date +%F).dump
```
সাপ্তাহিক cron (VPS root crontab) উদাহরণ: `0 3 * * 0  docker exec <postgres-container> pg_dump -U <user> -Fc <db> > /root/backups/osleos-$(date +\%F).dump`
(পুরনোগুলো `find /root/backups -mtime +30 -delete` দিয়ে মুছুন।)

**Media volume** — volume-এর data VPS-এ Docker volume হিসেবে থাকে; নিয়মিত tar করে বাইরে কপি করুন:
```bash
docker run --rm -v <volume-name>:/media -v /root/backups:/out alpine tar czf /out/osleos-media-$(date +%F).tgz -C /media .
```
(`<volume-name>` দেখতে: `docker volume ls | grep osleos`।) DB আর media **একই সময়ের** backup রাখুন — একটা ছাড়া অন্যটা অর্ধেক।

### ৬. Restore
1. নতুন/খালি PostgreSQL বানিয়ে `DATABASE_URI` ঠিক করুন
2. `cat osleos-YYYY-MM-DD.dump | docker exec -i <postgres-container> pg_restore -U <user> -d <db> --clean --if-exists --no-owner`
3. Media: `docker run --rm -v <volume-name>:/media -v /root/backups:/in alpine tar xzf /in/osleos-media-YYYY-MM-DD.tgz -C /media` তারপর `chown -R 1001:1001` ঐ volume-এ
4. OSLEOS **Redeploy** করুন, `/admin`-এ ঢুকে পরীক্ষা করুন
- একই `PAYLOAD_SECRET` রাখুন, নইলে সবাই logout হয়ে আবার login করতে হবে।
- Server হারালেও `.env` মান (secret) আলাদা জায়গায় (password manager) রাখা থাকলে restore সহজ।

## Local-এ Docker দিয়ে চালানো (ঐচ্ছিক)

```bash
docker build -t osleos .
docker run -p 3000:3000 -e DATABASE_URI=... -e PAYLOAD_SECRET=... -v osleos-media:/app/media osleos   # http://localhost:3000
```

## সমস্যা হলে

- **Build fail:** Coolify → resource → **Deployments** → log দেখুন
- **Site খুলছে না:** Ports Exposes `3000` আছে কিনা, domain-এর DNS ঠিক আছে কিনা দেখুন
- **আগের version-এ ফেরা:** Coolify → Deployments → আগের deployment → **Redeploy**

## AI assistant (ওয়েবসাইট চ্যাট)

ডান-নিচের চ্যাট বাটনে দুটো অপশন: **AI assistant** (Claude, `/api/chat`) আর **WhatsApp**।

1. [console.anthropic.com](https://console.anthropic.com) → **API Keys** → নতুন key বানান (Billing-এ credit/limit সেট করে রাখুন)
2. Coolify → OSLEOS → **Environment Variables** → `ANTHROPIC_API_KEY` = key → Save
   (ঐচ্ছিক: `ANTHROPIC_MODEL` দিয়ে model বদলানো যায়; default `claude-sonnet-5`)
3. **Redeploy** করুন

- Key না থাকলে (বা ভুল হলে) `/api/chat` `503 {"error":"ai_unavailable"}` দেয় — widget তখন একটা বার্তা আর **WhatsApp** বাটন দেখায়, site ঠিকমতো চলে।
- Key কখনো code বা git-এ রাখবেন না — শুধু Coolify-তে। নমুনা: `.env.example`
- সুরক্ষা: প্রতি IP-তে মিনিটে ~৪টা মেসেজ, পুরো site-এ সেকেন্ডে ~১টা; প্রতি মেসেজ ≤১,০০০ অক্ষর, শেষ ১০টা মেসেজ পাঠানো হয়।
- খরচ: একটা সাধারণ ৫-প্রশ্নের কথোপকথন ≈ $0.02–0.03। Anthropic Console → **Limits**-এ মাসিক spend limit দিয়ে রাখুন।
- Cloudflare cache rule-এ `/api/` path cache করবেন না (POST এমনিতেই cache হয় না, তবু rule-এ বাদ রাখা ভালো)।
- AI-এর জ্ঞান আসে `src/content/assistant-knowledge.ts` (ব্রোশিওর), `src/content/site.ts` (যোগাযোগ) আর `src/content/products.ts` (প্রোডাক্ট) থেকে — এগুলো আপডেট করলে পরের deploy-এ AI-ও আপডেট হয়।
