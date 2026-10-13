# OSLEOS — CMS (Payload) To-Do

লক্ষ্য: ক্লায়েন্ট অ্যাডমিন প্যানেল থেকে প্রোডাক্ট ও কম্বো প্যাকেজ যোগ / এডিট / মোছা / লুকানো (draft) করবে।
ওয়েবসাইটের ডিজাইন ও কম্পোনেন্ট বদলাবে না — শুধু ডেটার উৎস `src/content/products.ts` থেকে ডাটাবেসে যাবে।

**সিদ্ধান্ত:** Payload CMS 3.90.2 (Next.js 16.3.6-এর সাথে সামঞ্জস্যপূর্ণ) + PostgreSQL (Coolify) · অ্যাডমিন দ্বিভাষিক en/bn · বাকি সাইট (হোম, About, ফর্ম, চ্যাট) আপাতত যেমন আছে।

## ধাপ ১ — ভিত্তি (মূল সেশন)
- [x] Payload ইনস্টল (`payload`, `@payloadcms/next`, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`, `graphql`, `sharp`)
- [x] `payload.config.ts` — Postgres, localization (en, bn), অ্যাডমিন বাংলা
- [x] `/admin` ও `/api` রুট (Next route group, `[lang]` রুটের সাথে সংঘাত ছাড়া)
- [x] `Users` collection — রোল: owner / editor (লগইন, শক্ত পাসওয়ার্ড)
- [x] `Media` collection — ছবি + ডেটাশিট PDF, ছবি আপলোডে WebP + ছোট করা
- [x] `Categories` collection (বর্তমান ১০টা ক্যাটাগরি)
- [x] `Products` collection — সব ফিল্ড (নাম, ব্র্যান্ড, ট্যাগলাইন, বিবরণ, স্পেক টেবিল, হাইলাইট, ওয়ারেন্টি, ছবি, datasheet PDF, ফিচার্ড, draft/published) + কম্বো গ্রুপ (দাম, আগের দাম, কী কী আছে, অফারের তারিখ)
- [x] `next build` পাস (agent C-র কাজ শেষ হলে)
- [x] Migration (`src/migrations`), `npm run payload`, `payload:types` স্ক্রিপ্ট; package.json `"type": "module"`

## ধাপ ২ — স্বাধীন কাজ (agent দিয়ে, একসাথে)
- [x] **Agent A — Deploy:** Dockerfile, `.env.example`, `docs/DEPLOY.md`: Postgres Coolify-তে, ছবির persistent volume, `PAYLOAD_SECRET`/`DATABASE_URI`, backup নোট
- [x] **Agent B — Seed:** `scripts/seed-products.ts` — `products.ts` + ক্যাটাগরি + ছবি/datasheet ফাইল ডাটাবেসে ঢোকানো (idempotent, slug ধরে)
- [x] **Agent C — Data layer:** `src/lib/catalog.ts` (ডাটাবেস থেকে প্রোডাক্ট পড়া, draft লুকানো) + প্রোডাক্ট/হোম/চ্যাট/সাইটম্যাপ ব্যবহারকারী পেজ ও কম্পোনেন্ট এতে সরানো, আউটপুট আগের মতোই
- [x] Revalidation hook — Save করলে ওই প্রোডাক্ট পেজ ও লিস্ট নতুন করে তৈরি

> নোট: লোকাল টেস্ট Postgres অবশ্যই UTF8 এনকোডিং হতে হবে (Windows-এর ডিফল্ট WIN1252-এ বাংলা সেভ হয় না)। Coolify-র Postgres ডিফল্টে UTF8।
> নোট: DB ছাড়া `next build` পাস হয় (static ডেটা fallback)। production-এ DB চালু থাকলে ৫ মিনিটের মধ্যে বা Save করলেই DB-র ডেটা আসে।

## ধাপ ৩ — যাচাই
- [x] seed চালিয়ে সব প্রোডাক্ট অ্যাডমিনে আসছে কিনা (লোকাল: ১০ ক্যাটাগরি, ৮১ প্রোডাক্ট, ১১৩ ফাইল, দ্বিতীয়বার চালালে duplicate হয়নি)
- [x] অ্যাডমিনে নতুন প্রোডাক্ট যোগ → সাইটে দেখা যাচ্ছে
- [x] draft লুকানো, মোছা, ফিচার্ড টিক
- [x] editor রোল শুধু কনটেন্ট দেখে (Users নয়)
- [x] `npm run lint` + `npm run build` (DB ছাড়া ও Docker-এর মতো standalone মোডে যাচাই)
- [ ] মোবাইল ও ব্রাউজারে চোখে দেখে মিলানো (আগের সাইটের সাথে একই কিনা)
- [ ] অ্যাডমিন UI ব্রাউজারে ক্লিক করে দেখা (লগইন, প্রোডাক্ট ফর্ম, ভাষা বদল)
- [ ] Coolify-তে deploy ও প্রথম owner একাউন্ট

> যাচাই করা হয়েছে (API + পেজ): draft লুকানো, publish/unpublish, মোছা, sitemap আপডেট, বাংলা সেভ (শুধু English required), editor ≠ ইউজার ম্যানেজ, ছবি CMS থেকে, production-এ migration নিজে চলে।

## পরের সংস্করণ (এখন নয়)
- [ ] লিড সংগ্রহ (কোটেশন/মেজারমেন্ট ফর্ম → ডাটাবেস), লিডের অবস্থা, CSV
- [ ] প্রকল্প, টিম, মতামত, FAQ, সাইট সেটিং, হোমপেজের লেখা
- [ ] মিডিয়া লাইব্রেরি পরিষ্কার, চ্যাট ইতিহাস, SEO, ড্যাশবোর্ড
- [ ] ২FA, অডিট লগ, ভার্সন রিস্টোর
