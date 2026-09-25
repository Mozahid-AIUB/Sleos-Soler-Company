# OSLEOS — To-Do List

## Phase 1 — Draft Website (এখন)

### Setup
- [x] Next.js 16 + TypeScript + Tailwind scaffold
- [x] GitHub repo connect (`Mozahid-AIUB/Sleos-Soler-Company`)
- [x] Design plan (`docs/DESIGN_PLAN.md`)
- [x] Media sourcing — hero video + ২৫টা ছবি (Mixkit, Unsplash), compress করা (`public/media`)
- [x] Design tokens (colors, fonts) → `globals.css`
- [x] i18n: `[lang]` route, en/bn dictionary

### Components
- [x] Header (transparent → solid, mobile menu, lang switch, cart count)
- [x] Footer (links, contact, social icons)
- [x] Floating WhatsApp button
- [x] Section header, Button, Badge, Reveal animation (CSS only)
- [x] Product card (Add to Cart / Buy Now / Quote)
- [x] Cart drawer + cart state (localStorage)

### Pages
- [x] Home — সব section
- [x] Products (shop + category filter)
- [x] Product detail
- [x] Solutions
- [x] Projects
- [x] About
- [x] Contact (quote form → WhatsApp)
- [x] Cart
- [x] Checkout (COD → WhatsApp order message)

### Quality
- [x] Mobile responsive check
- [x] Production build pass, lint pass — সব page static (SSG)
- [ ] Lighthouse performance test (deploy-এর পরে)
- [x] SEO: metadata, OG, hreflang en/bn

## Client থেকে লাগবে
- [x] Logo (PNG পেয়েছি — transparent version, icon, share image বানানো হয়েছে; SVG পেলে আরও ভালো)
- [ ] Brochure PDF
- [ ] Product list — নাম, spec, দাম, ছবি, datasheet
- [ ] Real project list + ছবি
- [ ] Real client review
- [ ] Payment method (COD / bKash / SSLCommerz)
- [ ] Delivery area + charge
- [ ] Social links, WhatsApp number, phone, email, address
- [ ] Domain

## Phase 2
- [ ] Sanity CMS (client admin panel, en/bn field)
- [ ] (ঐচ্ছিক) Brevo newsletter + brochure auto-email
- [ ] Online payment (bKash / SSLCommerz)
- [ ] Order database + admin
- [ ] Vercel deploy + custom domain
