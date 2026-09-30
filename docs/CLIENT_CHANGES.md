# Client change list — 2026-09-25

Source: client's "Changes required for the website" document + WhatsApp messages.
Brochure: `D:/Osleos_Brochure.pdf` (35 pages, content is rasterised — read the page images).
Readable page renders: `<scratchpad>/brochure/read/pageNN.png`; embedded images: `<scratchpad>/brochure/images/`.

## Rules
- Follow the **brochure content**, NOT the logo inside the brochure (our logo is the final ® logo already on the site).
- Company has been **delivering solutions for 15 years** (the doc says 15 — the brochure cover's "20" is outdated).
- Peak module efficiency: **24.1%** (was 23.8%).
- OSLEOS deals with the **whole solar power system**, including **voltage stabilizers** (brochure cover + page 15).
- **No prices, no Add to Cart, no Buy Now** anywhere. Every product → **Request a Quote**.
- Project photos should look like they were done **in Bangladesh**.

## Contact details
- Email: info@osleos.com
- Mobile: **+880 1711-752202, +880 1323-934442** (confirmed by user — the BN doc's 1737 number is not used)
- WhatsApp: **+880 1711-752202** (client change, Sep 2026 — replaces +971 50 956 9576; all quotes go here)
- Office: Tanjima Villa, 31/1, Lift-2, Flat-C2 (2nd Floor), East Hazipara, Rampura, Dhaka-1219, Bangladesh
- Working hours: **Saturday – Thursday, 10:00 – 21:00**
- Facebook: https://www.facebook.com/profile.php?id=61594452931737
- Instagram: https://www.instagram.com/osleoshq/
- LinkedIn: https://www.linkedin.com/company/143899860/

## Pages / features to add
1. **Social landing page** — one page linking all social media (link-in-bio style).
2. **"Get a Quote" → Information Sheet** page (mirrors brochure p.33 "Let us understand your requirement"); fill it and press **Send on WhatsApp**.
3. **Partners**: PV modules — Trina Solar, Jinko Solar, LONGi, JA Solar, Canadian Solar, Astronergy · Inverters — Sungrow, Huawei, Solis, GoodWe, Growatt, Crown, Deye · Brands we use (BOS) — Delixi Electric, CHNT, SAKO, CNC Electric, Tengen, Zhengxi.
4. **Products**: two real models from each PV and inverter partner brand; samples of stabilizers; the whole PV-system set from the brochure under **Commercial & Utility**; all with Request a Quote.
5. **AI agent + WhatsApp** chat on the website.
6. **Footer like Trina Solar**: Sustainability, Service & Support, Customer Service Hotline, Monthly Updates Subscription, social icons, legal links (Security/Vulnerability Response, Legal contacts, Privacy Policy, Legal Statement).

## Client changes — 30 Sep 2026

- Hero headline letter-spacing loosened ("Preserving": R and V no longer touch).
- WhatsApp is now **+880 1711-752202** everywhere (+971 removed).
- Languages: English, 中文, Español, Français, বাংলা (in that order) via the header language menu.
  UI text: `src/i18n/dictionaries/<lang>.ts`. Product/project/review text: English + Bangla in `src/content/*`,
  Chinese/Spanish/French in `src/content/translations/<lang>.json` keyed by the English text
  (a missing string falls back to English; `_source-en.json` lists every English content string).
- SAKO removed from inverters. Voltage-stabilizer partners: SAKO, CNC Electric, Tengen (2 models each).
- Removed Solar PowerGuard, Solar-as-a-Service, Roof to Revenue and Solar Bill Zero.
- Reviews: Bangladeshi clients (incl. plastic and garments factories) + Chinese manufacturer partners — SAMPLE text until real reviews arrive.
- Brand film (AI video) on hold — removed from the home page.
- "Information Sheet" renamed **Measurement Form**; `/quote` now mirrors the client's
  "Measurement Form (English).pdf" (36 questions, 8 sections, technical-terms guide).
- Measurement Form accepts PDF/JPG/PNG attachments (site photos, bills): uploaded to `/api/upload`,
  stored in `UPLOAD_DIR` (Docker: `/app/uploads` — needs a persistent volume in Coolify), and sent as links in the WhatsApp message.
- YouTube (@osleoshq) added to social links.
