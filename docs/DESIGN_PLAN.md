# OSLEOS — Website Design Plan (Draft v1)

> স্ট্যাটাস: ড্রাফট। সব সংখ্যা, দাম, প্রোডাক্ট নাম, প্রজেক্ট আর রিভিউ **placeholder** — client-এর real data আসলে বদলাতে হবে।
> Reference: Jinko Solar / Trina Solar (international manufacturer look), findrealestate.com (cinematic hero), saharalinkgroup.com (editorial section pattern, marquee, process)।

---

## ১. লক্ষ্য

1. প্রথম ১০ সেকেন্ডে বোঝাতে হবে — OSLEOS একটা serious, Tier-1 manufacturer (SREDA + BSTI approved)।
2. দুই দিক একসাথে: **Information** (কোম্পানি, সলিউশন, প্রজেক্ট) + **Shop** (Add to Cart, Buy Now, Get Quote)।
3. **Superfast** — Lighthouse 95+, প্রথম লোড < 1.5s (4G)।
4. **English + বাংলা** — URL দিয়ে (`/en/...`, `/bn/...`), SEO-friendly।
5. পরে client নিজে edit করতে পারবে (Phase 2: Sanity CMS admin)।

---

## ২. Visual Identity

### রঙ (Design Tokens)

| Token | Hex | কোথায় |
|---|---|---|
| `forest-950` | `#06130E` | Hero, footer — প্রায় কালো সবুজ |
| `forest-900` | `#0A1F16` | Products / dark section |
| `forest-800` | `#123224` | Dark card, border |
| `gold-500` | `#E3A72F` | শুধু primary CTA, হেডলাইনের highlight শব্দ, আইকন |
| `gold-400` | `#F0BD4F` | Gold hover |
| `teal-600` | `#0F7A68` | Check icon, link, stat band |
| `teal-500` | `#16A08A` | Teal hover / on-dark accent |
| `cream-50` | `#F7F4EC` | Light section background |
| `cream-100` | `#EEE8DA` | Alternate light section, divider |
| `white` | `#FFFFFF` | Card, form |
| `ink-900` | `#0E1D16` | Light bg-তে টেক্সট (pure black না) |
| `ink-600` | `#43524A` | Body text |
| `ink-400` | `#6E7D74` | Caption / muted |

নিয়ম: gold এক স্ক্রিনে ২–৩ জায়গার বেশি না। Dark আর light section পালাক্রমে।

### টাইপোগ্রাফি

- **English:** Plus Jakarta Sans — Display 700/800, tracking -0.03em; Body 400/500, line-height 1.65
- **বাংলা:** Hind Siliguri — 400/500/600/700
- Scale (fluid `clamp`): Display 44→88px · H2 32→56px · H3 20→26px · Body 16→18px · Label 12–13px uppercase tracking 0.14em
- সংখ্যা: `tabular-nums`

### Shape & Depth

- Radius: card 20px, button full pill (findrealestate style), image 24px
- Shadow: শুধু light section-এ, খুব হালকা (`0 1px 2px + 0 12px 32px -12px`)
- Section header pattern (Sahara ref): ছোট gold bar/eyebrow label → H2 → এক লাইন body

### Motion

- হালকা, GPU-friendly: fade-up reveal (IntersectionObserver, একটাই ছোট script)
- Hero: scroll করলে ভিডিও একটু zoom + content fade (CSS scroll-driven animation, না থাকলে static)
- Marquee: pure CSS
- `prefers-reduced-motion` হলে সব animation বন্ধ

---

## ৩. Site Map

```
/{lang}                 Home
/{lang}/products        Shop — category filter (Panels, Inverters, Batteries, Kits, Accessories)
/{lang}/products/[slug] Product detail — gallery, specs, Add to Cart / Buy Now / Datasheet
/{lang}/solutions       Residential · Commercial & Industrial · Utility-scale
/{lang}/projects        Case studies
/{lang}/about           Story, certifications, factory, values
/{lang}/contact         Quote form + info + map
/{lang}/cart            Cart
/{lang}/checkout        Checkout (COD + WhatsApp confirmation)
```

---

## ৪. Home Page — section by section

1. **Header** — transparent on hero, scroll করলে blur-dark। Logo · Products · Solutions · Projects · About · Contact · [EN/বাং] · Cart icon (count) · **Get a Quote** (gold pill)
2. **Hero (full screen)** — aerial solar farm sunset video, dark gradient overlay
   - Eyebrow: "SREDA & BSTI Approved · Tier-1 Solar"
   - H1: "Powering Today. **Preserving Tomorrow.**" (দ্বিতীয় অংশ gold)
   - Sub: এক লাইনের mission
   - CTA: **Shop Solar** (gold) · **Get a Quote** (glass/ghost)
   - নিচে glass stat bar: `850+ MW Installed` · `23.8% Module Efficiency` · `30-Year Warranty`
3. **Trust strip** — marquee: certifications/standards (IEC 61215, IEC 61730, UL, ISO 9001, SREDA, BSTI, TÜV)
4. **Intro / About teaser** (cream) — বাঁয়ে বড় heading + text + ৪টা badge; ডানে ছবি + floating stat card
5. **Product categories** (dark forest) — ৫টা category tile, hover-এ image zoom
6. **Featured products** (cream) — ৪টা product card: image, badge, key spec, price, **Add to Cart** + **Buy Now**
7. **Solutions** (white) — ৩টা বড় card: Residential / C&I / Utility, প্রতিটায় "Get Quote"
8. **Stat band** (teal) — `1,200+ Projects` · `18 Districts` · `640k t CO₂ Avoided` · `24/7 Monitoring`
9. **Projects** (dark) — ৩টা case study, বড় image + capacity + location
10. **Process** (cream) — 4 step: Consultation → Design → Installation → Monitoring & Service
11. **Testimonials** (white) — ৩টা review card (ড্রাফটে "Sample" ট্যাগ)
12. **Newsletter + Brochure** (dark, gold accent) — Email + Phone → "Get the Brochure"
13. **Contact CTA** — form (Project type প্রথমে) + phone/email/WhatsApp
14. **Footer** — logo, tagline, links, contact, social icons (WhatsApp, Facebook, LinkedIn, Instagram), SREDA/BSTI
15. **Floating WhatsApp button** — সব পেজে

---

## ৫. Shop / E-commerce Flow

- Cart: browser-এ (localStorage) — server লাগে না, instant
- Product card: **Add to Cart** (drawer খোলে) · **Buy Now** (সরাসরি checkout)
- বড় system (C&I, Utility, Tracker): দাম নেই → **Request Quote**
- Checkout: নাম, ফোন, ঠিকানা, জেলা → **Cash on Delivery** → "Send order on WhatsApp" চাপলে cart-এর সব product + দাম + customer-এর তথ্য একটা সাজানো message হয়ে সরাসরি কোম্পানির WhatsApp-এ চলে যায়
- **কোনো backend / database নেই** — Quote form আর Newsletter form-ও একইভাবে WhatsApp message পাঠায়
- পরে চাইলে: bKash / SSLCommerz online payment, order database, admin

---

## ৬. Technical

| বিষয় | সিদ্ধান্ত |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4 |
| i18n | `app/[lang]` route + dictionary (`en.ts`, `bn.ts`), `proxy.ts` দিয়ে `/` → `/en` |
| Content | `src/content/*.ts` — প্রতিটা field `{ en, bn }`। Phase 2-এ একই shape Sanity-তে যাবে |
| Rendering | সব page static (SSG, `generateStaticParams`) → CDN থেকে serve |
| Client JS | শুধু: Cart, Header menu, Lang switch, Reveal, Forms |
| Images | `next/image` (AVIF/WebP, lazy, sizes) — local `/public/media` |
| Video | 720p H.264, muted loop, poster image; mobile-এ শুধু poster |
| Orders / forms | Backend নেই — সব WhatsApp (`wa.me`) message হিসেবে যায় |
| Newsletter | WhatsApp-এ email + phone যায়, টিম brochure পাঠায় (পরে চাইলে Brevo auto-email) |
| Hosting | Vercel |

---

## ৭. Media Sources (সব free commercial license)

- ভিডিও: Mixkit (Mixkit Free License)
- ছবি: Unsplash (Unsplash License)
- Logo / brochure: client দেবে (এখন text wordmark placeholder)
