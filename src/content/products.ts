import type { Localized } from "@/i18n/config";

/**
 * Product catalogue — PLACEHOLDER names, specs and prices until the client
 * sends the real list. Shape is ready to move into a CMS later.
 */

export type CategoryId = "panels" | "inverters" | "batteries" | "kits" | "accessories" | "commercial";

export type Product = {
  slug: string;
  category: CategoryId;
  name: string;
  tagline: Localized;
  description: Localized;
  /** BDT, VAT included. `null` = quote only. */
  price: number | null;
  compareAt?: number;
  badge?: Localized;
  keySpec: Localized;
  specs: { label: Localized; value: string }[];
  highlights: Localized<string[]>;
  warranty: Localized;
  /** Product photo — stock placeholder until real product shots arrive. */
  image: string;
  featured?: boolean;
};

export const categories: { id: CategoryId; name: Localized; blurb: Localized; image: string; home?: false }[] = [
  {
    id: "panels",
    name: { en: "Solar Panels", bn: "সোলার প্যানেল" },
    blurb: { en: "N-type & PERC modules, 430–580 W", bn: "N-টাইপ ও PERC মডিউল, ৪৩০–৫৮০ ওয়াট" },
    image: "/media/img/panels-closeup.jpg",
  },
  {
    id: "inverters",
    name: { en: "Inverters", bn: "ইনভার্টার" },
    blurb: { en: "Hybrid & on-grid, 3–50 kW", bn: "হাইব্রিড ও অন-গ্রিড, ৩–৫০ কিলোওয়াট" },
    image: "/media/img/electronics.jpg",
  },
  {
    id: "batteries",
    name: { en: "Energy Storage", bn: "এনার্জি স্টোরেজ" },
    blurb: { en: "LiFePO4 wall & rack batteries", bn: "LiFePO4 ওয়াল ও র‍্যাক ব্যাটারি" },
    image: "/media/img/house-evening.jpg",
  },
  {
    id: "kits",
    name: { en: "Solar Kits", bn: "সোলার কিট" },
    blurb: { en: "Complete home systems, ready to install", bn: "সম্পূর্ণ হোম সিস্টেম, ইনস্টলের জন্য প্রস্তুত" },
    image: "/media/img/rooftop-installer.jpg",
  },
  {
    id: "accessories",
    name: { en: "Accessories", bn: "এক্সেসরিজ" },
    blurb: { en: "Mounting, cables & protection", bn: "মাউন্টিং, ক্যাবল ও প্রোটেকশন" },
    image: "/media/img/install-hands.jpg",
    home: false,
  },
  {
    id: "commercial",
    name: { en: "Commercial & Utility", bn: "বাণিজ্যিক ও ইউটিলিটি" },
    blurb: { en: "C&I rooftops, trackers, solar parks", bn: "C&I রুফটপ, ট্র্যাকার, সোলার পার্ক" },
    image: "/media/img/utility-aerial.jpg",
  },
];

export const products: Product[] = [
  {
    slug: "titan-n-580-bifacial",
    category: "panels",
    name: "TITAN N-Type 580W Bifacial",
    tagline: { en: "TOPCon bifacial module for utility & C&I", bn: "ইউটিলিটি ও C&I-এর জন্য TOPCon বাইফেসিয়াল মডিউল" },
    description: {
      en: "Our flagship N-type TOPCon module with dual-glass bifacial design. Up to 25% extra yield from the rear side, lower degradation and excellent performance in Bangladesh's heat and humidity.",
      bn: "ডুয়াল-গ্লাস বাইফেসিয়াল ডিজাইনের আমাদের ফ্ল্যাগশিপ N-টাইপ TOPCon মডিউল। পেছনের দিক থেকে ২৫% পর্যন্ত বাড়তি উৎপাদন, কম ডিগ্রেডেশন এবং বাংলাদেশের গরম ও আর্দ্রতায় চমৎকার পারফরম্যান্স।",
    },
    price: 21500,
    compareAt: 23900,
    badge: { en: "Best seller", bn: "বেস্ট সেলার" },
    keySpec: { en: "22.5% efficiency · 580 W", bn: "২২.৫% দক্ষতা · ৫৮০ ওয়াট" },
    specs: [
      { label: { en: "Max power (Pmax)", bn: "সর্বোচ্চ পাওয়ার" }, value: "580 W" },
      { label: { en: "Module efficiency", bn: "মডিউল দক্ষতা" }, value: "22.5%" },
      { label: { en: "Cell type", bn: "সেলের ধরন" }, value: "N-type TOPCon, 144 half-cut" },
      { label: { en: "Bifaciality", bn: "বাইফেসিয়ালিটি" }, value: "80 ± 5%" },
      { label: { en: "Dimensions", bn: "মাপ" }, value: "2278 × 1134 × 30 mm" },
      { label: { en: "Weight", bn: "ওজন" }, value: "32.0 kg" },
      { label: { en: "Temp. coefficient (Pmax)", bn: "তাপমাত্রা সহগ" }, value: "-0.29 %/°C" },
    ],
    highlights: {
      en: ["Up to 25% bifacial gain", "0.40% annual degradation", "Dual-glass, PID resistant", "5400 Pa snow / 2400 Pa wind load"],
      bn: ["২৫% পর্যন্ত বাইফেসিয়াল গেইন", "বার্ষিক মাত্র ০.৪০% ডিগ্রেডেশন", "ডুয়াল-গ্লাস, PID প্রতিরোধী", "৫৪০০ Pa / ২৪০০ Pa লোড সহনশীল"],
    },
    warranty: { en: "15-year product · 30-year power", bn: "১৫ বছর প্রোডাক্ট · ৩০ বছর পাওয়ার" },
    image: "/media/img/p-panel-sunset.jpg",
    featured: true,
  },
  {
    slug: "lumen-430-all-black",
    category: "panels",
    name: "LUMEN 430W All-Black",
    tagline: { en: "Premium all-black module for homes", bn: "বাসার জন্য প্রিমিয়াম অল-ব্ল্যাক মডিউল" },
    description: {
      en: "A sleek, all-black N-type module designed for residential rooftops where looks matter as much as yield.",
      bn: "বাসার ছাদের জন্য তৈরি মসৃণ অল-ব্ল্যাক N-টাইপ মডিউল — যেখানে দেখতে সুন্দর হওয়াও উৎপাদনের মতোই জরুরি।",
    },
    price: 16900,
    keySpec: { en: "21.8% efficiency · 430 W", bn: "২১.৮% দক্ষতা · ৪৩০ ওয়াট" },
    specs: [
      { label: { en: "Max power (Pmax)", bn: "সর্বোচ্চ পাওয়ার" }, value: "430 W" },
      { label: { en: "Module efficiency", bn: "মডিউল দক্ষতা" }, value: "21.8%" },
      { label: { en: "Cell type", bn: "সেলের ধরন" }, value: "N-type, 108 half-cut" },
      { label: { en: "Dimensions", bn: "মাপ" }, value: "1722 × 1134 × 30 mm" },
      { label: { en: "Weight", bn: "ওজন" }, value: "21.5 kg" },
    ],
    highlights: {
      en: ["All-black aesthetic", "Excellent low-light response", "Anti-reflective glass"],
      bn: ["অল-ব্ল্যাক ডিজাইন", "কম আলোতেও ভালো উৎপাদন", "অ্যান্টি-রিফ্লেক্টিভ গ্লাস"],
    },
    warranty: { en: "25-year product · 30-year power", bn: "২৫ বছর প্রোডাক্ট · ৩০ বছর পাওয়ার" },
    image: "/media/img/p-panel-black.jpg",
  },
  {
    slug: "apex-450-mono-perc",
    category: "panels",
    name: "APEX 450W Mono PERC",
    tagline: { en: "The dependable workhorse", bn: "নির্ভরযোগ্য ও সাশ্রয়ী" },
    description: {
      en: "Proven mono PERC technology at an accessible price — ideal for residential and small commercial systems.",
      bn: "সাশ্রয়ী দামে প্রমাণিত মনো PERC প্রযুক্তি — বাসা ও ছোট বাণিজ্যিক সিস্টেমের জন্য আদর্শ।",
    },
    price: 14800,
    keySpec: { en: "20.9% efficiency · 450 W", bn: "২০.৯% দক্ষতা · ৪৫০ ওয়াট" },
    specs: [
      { label: { en: "Max power (Pmax)", bn: "সর্বোচ্চ পাওয়ার" }, value: "450 W" },
      { label: { en: "Module efficiency", bn: "মডিউল দক্ষতা" }, value: "20.9%" },
      { label: { en: "Cell type", bn: "সেলের ধরন" }, value: "Mono PERC, 144 half-cut" },
      { label: { en: "Dimensions", bn: "মাপ" }, value: "2094 × 1038 × 35 mm" },
      { label: { en: "Weight", bn: "ওজন" }, value: "23.5 kg" },
    ],
    highlights: {
      en: ["Best value per watt", "Half-cut cell design", "Salt-mist & ammonia resistant"],
      bn: ["প্রতি ওয়াটে সেরা দাম", "হাফ-কাট সেল ডিজাইন", "লবণাক্ততা ও অ্যামোনিয়া প্রতিরোধী"],
    },
    warranty: { en: "12-year product · 25-year power", bn: "১২ বছর প্রোডাক্ট · ২৫ বছর পাওয়ার" },
    image: "/media/img/p-panel-blue.jpg",
  },
  {
    slug: "volta-hybrid-6kw",
    category: "inverters",
    name: "VOLTA Hybrid Inverter 6kW",
    tagline: { en: "Solar + battery + grid, one box", bn: "সোলার + ব্যাটারি + গ্রিড, এক বক্সে" },
    description: {
      en: "A single-phase hybrid inverter that runs your home on solar by day, battery by night and switches in under 10 ms during load-shedding.",
      bn: "সিঙ্গেল-ফেজ হাইব্রিড ইনভার্টার — দিনে সোলারে, রাতে ব্যাটারিতে বাসা চালায় এবং লোডশেডিংয়ে ১০ মিলিসেকেন্ডেরও কম সময়ে সুইচ করে।",
    },
    price: 118000,
    badge: { en: "New", bn: "নতুন" },
    keySpec: { en: "6 kW · 98.2% max efficiency", bn: "৬ কিলোওয়াট · ৯৮.২% দক্ষতা" },
    specs: [
      { label: { en: "Rated output", bn: "রেটেড আউটপুট" }, value: "6 kW" },
      { label: { en: "Max efficiency", bn: "সর্বোচ্চ দক্ষতা" }, value: "98.2%" },
      { label: { en: "MPPT trackers", bn: "MPPT ট্র্যাকার" }, value: "2" },
      { label: { en: "Battery voltage", bn: "ব্যাটারি ভোল্টেজ" }, value: "48 V (LiFePO4 / lead-acid)" },
      { label: { en: "Switch-over time", bn: "সুইচ-ওভার সময়" }, value: "< 10 ms" },
      { label: { en: "Protection", bn: "সুরক্ষা" }, value: "IP65" },
    ],
    highlights: {
      en: ["UPS-grade switch-over", "Wi-Fi monitoring app", "Parallel up to 6 units"],
      bn: ["UPS-মানের সুইচ-ওভার", "Wi-Fi মনিটরিং অ্যাপ", "৬টি পর্যন্ত প্যারালাল"],
    },
    warranty: { en: "5-year standard, extendable to 10", bn: "৫ বছর, ১০ বছর পর্যন্ত বাড়ানো যায়" },
    image: "/media/img/p-inverter-wall.jpg",
    featured: true,
  },
  {
    slug: "gridline-10kw-3ph",
    category: "inverters",
    name: "GRIDLINE On-Grid 10kW 3-Phase",
    tagline: { en: "Net-metering ready string inverter", bn: "নেট মিটারিং উপযোগী স্ট্রিং ইনভার্টার" },
    description: {
      en: "A three-phase on-grid inverter for commercial rooftops and larger homes, with export limiting and remote monitoring.",
      bn: "বাণিজ্যিক ছাদ ও বড় বাসার জন্য থ্রি-ফেজ অন-গ্রিড ইনভার্টার, এক্সপোর্ট লিমিটিং ও রিমোট মনিটরিংসহ।",
    },
    price: 142000,
    keySpec: { en: "10 kW · 3-phase · 98.6%", bn: "১০ কিলোওয়াট · থ্রি-ফেজ · ৯৮.৬%" },
    specs: [
      { label: { en: "Rated output", bn: "রেটেড আউটপুট" }, value: "10 kW" },
      { label: { en: "Max efficiency", bn: "সর্বোচ্চ দক্ষতা" }, value: "98.6%" },
      { label: { en: "MPPT trackers", bn: "MPPT ট্র্যাকার" }, value: "2" },
      { label: { en: "Grid", bn: "গ্রিড" }, value: "3-phase, 400 V" },
      { label: { en: "Protection", bn: "সুরক্ষা" }, value: "IP66" },
    ],
    highlights: {
      en: ["Zero-export control", "Fanless, silent design", "Smart meter support"],
      bn: ["জিরো-এক্সপোর্ট কন্ট্রোল", "ফ্যানবিহীন, নিঃশব্দ", "স্মার্ট মিটার সাপোর্ট"],
    },
    warranty: { en: "5-year standard, extendable to 10", bn: "৫ বছর, ১০ বছর পর্যন্ত বাড়ানো যায়" },
    image: "/media/img/p-inverter-unit.jpg",
  },
  {
    slug: "cella-wall-5kwh",
    category: "batteries",
    name: "CELLA Wall 5.12kWh LiFePO4",
    tagline: { en: "Slim lithium storage for homes", bn: "বাসার জন্য স্লিম লিথিয়াম স্টোরেজ" },
    description: {
      en: "A wall-mounted LiFePO4 battery with built-in BMS, 6,000+ cycles and stackable capacity up to 81 kWh.",
      bn: "বিল্ট-ইন BMS সহ দেয়ালে লাগানো LiFePO4 ব্যাটারি, ৬,০০০+ সাইকেল এবং ৮১ কিলোওয়াট-আওয়ার পর্যন্ত বাড়ানো যায়।",
    },
    price: 165000,
    keySpec: { en: "5.12 kWh · 6,000+ cycles", bn: "৫.১২ কিলোওয়াট-আওয়ার · ৬,০০০+ সাইকেল" },
    specs: [
      { label: { en: "Capacity", bn: "ক্ষমতা" }, value: "5.12 kWh (100 Ah)" },
      { label: { en: "Chemistry", bn: "কেমিস্ট্রি" }, value: "LiFePO4" },
      { label: { en: "Cycle life", bn: "সাইকেল লাইফ" }, value: "6,000+ @ 90% DoD" },
      { label: { en: "Nominal voltage", bn: "ভোল্টেজ" }, value: "51.2 V" },
      { label: { en: "Weight", bn: "ওজন" }, value: "46 kg" },
    ],
    highlights: {
      en: ["Safe iron-phosphate chemistry", "Plug & play with VOLTA", "Stack up to 16 units"],
      bn: ["নিরাপদ আয়রন-ফসফেট কেমিস্ট্রি", "VOLTA-র সাথে প্লাগ অ্যান্ড প্লে", "১৬টি পর্যন্ত যোগ করা যায়"],
    },
    warranty: { en: "10 years", bn: "১০ বছর" },
    image: "/media/img/p-battery-hands.jpg",
    featured: true,
  },
  {
    slug: "cella-rack-10kwh",
    category: "batteries",
    name: "CELLA Rack 10.24kWh",
    tagline: { en: "Rack-mount storage for business", bn: "ব্যবসার জন্য র‍্যাক-মাউন্ট স্টোরেজ" },
    description: {
      en: "High-capacity rack battery for offices, clinics and small factories that can't afford downtime.",
      bn: "অফিস, ক্লিনিক ও ছোট কারখানার জন্য উচ্চ-ক্ষমতার র‍্যাক ব্যাটারি — যেখানে বিদ্যুৎ বন্ধ থাকা চলে না।",
    },
    price: 298000,
    keySpec: { en: "10.24 kWh · 51.2 V", bn: "১০.২৪ কিলোওয়াট-আওয়ার · ৫১.২ ভোল্ট" },
    specs: [
      { label: { en: "Capacity", bn: "ক্ষমতা" }, value: "10.24 kWh (200 Ah)" },
      { label: { en: "Chemistry", bn: "কেমিস্ট্রি" }, value: "LiFePO4" },
      { label: { en: "Cycle life", bn: "সাইকেল লাইফ" }, value: "6,000+ @ 90% DoD" },
      { label: { en: "Communication", bn: "কমিউনিকেশন" }, value: "CAN / RS485" },
    ],
    highlights: {
      en: ["19-inch rack format", "Hot-swappable modules", "Remote BMS monitoring"],
      bn: ["১৯-ইঞ্চি র‍্যাক ফরম্যাট", "হট-সোয়াপ মডিউল", "রিমোট BMS মনিটরিং"],
    },
    warranty: { en: "10 years", bn: "১০ বছর" },
    image: "/media/img/p-battery-rack.jpg",
  },
  {
    slug: "home-kit-3kw-ongrid",
    category: "kits",
    name: "Home Solar Kit 3kW On-Grid",
    tagline: { en: "Cut your bill — everything included", bn: "বিল কমান — সবকিছু একসাথে" },
    description: {
      en: "Six LUMEN 430W modules, a 3 kW on-grid inverter, mounting structure, cables and protection — plus professional installation.",
      bn: "ছয়টি LUMEN ৪৩০ ওয়াট মডিউল, ৩ কিলোওয়াট অন-গ্রিড ইনভার্টার, মাউন্টিং স্ট্রাকচার, ক্যাবল ও প্রোটেকশন — সাথে প্রফেশনাল ইনস্টলেশন।",
    },
    price: 285000,
    compareAt: 310000,
    badge: { en: "Installation included", bn: "ইনস্টলেশনসহ" },
    keySpec: { en: "3 kW · ~12 kWh/day", bn: "৩ কিলোওয়াট · দিনে ~১২ ইউনিট" },
    specs: [
      { label: { en: "System size", bn: "সিস্টেম সাইজ" }, value: "3 kW (6 × 430 W)" },
      { label: { en: "Avg. generation", bn: "গড় উৎপাদন" }, value: "~12 kWh / day" },
      { label: { en: "Roof area", bn: "ছাদের জায়গা" }, value: "~16 m²" },
      { label: { en: "Inverter", bn: "ইনভার্টার" }, value: "3 kW on-grid" },
    ],
    highlights: {
      en: ["Installation & commissioning included", "Net-metering paperwork support", "Payback ~4–5 years"],
      bn: ["ইনস্টলেশন ও কমিশনিং অন্তর্ভুক্ত", "নেট মিটারিং কাগজপত্রে সহায়তা", "পেব্যাক ~৪–৫ বছর"],
    },
    warranty: { en: "System warranty 5 years", bn: "সিস্টেম ওয়ারেন্টি ৫ বছর" },
    image: "/media/img/p-kit-install.jpg",
    featured: true,
  },
  {
    slug: "hybrid-kit-5kw-battery",
    category: "kits",
    name: "Hybrid Home Kit 5kW + 5kWh",
    tagline: { en: "Never lose power again", bn: "লোডশেডিংকে বিদায়" },
    description: {
      en: "A complete hybrid system: 12 LUMEN modules, VOLTA 6kW hybrid inverter and a CELLA 5.12 kWh battery — backup for fans, lights, fridge and Wi-Fi through any outage.",
      bn: "সম্পূর্ণ হাইব্রিড সিস্টেম: ১২টি LUMEN মডিউল, VOLTA ৬ কিলোওয়াট হাইব্রিড ইনভার্টার ও CELLA ৫.১২ কিলোওয়াট-আওয়ার ব্যাটারি — যেকোনো লোডশেডিংয়ে ফ্যান, লাইট, ফ্রিজ ও ওয়াই-ফাই চালু রাখে।",
    },
    price: 598000,
    keySpec: { en: "5 kW solar · 5.12 kWh backup", bn: "৫ কিলোওয়াট সোলার · ৫.১২ কিলোওয়াট-আওয়ার ব্যাকআপ" },
    specs: [
      { label: { en: "System size", bn: "সিস্টেম সাইজ" }, value: "5.2 kW (12 × 430 W)" },
      { label: { en: "Storage", bn: "স্টোরেজ" }, value: "5.12 kWh LiFePO4" },
      { label: { en: "Inverter", bn: "ইনভার্টার" }, value: "VOLTA 6 kW hybrid" },
      { label: { en: "Backup time", bn: "ব্যাকআপ সময়" }, value: "~6–8 h (typical home loads)" },
    ],
    highlights: {
      en: ["Automatic backup during outages", "Monitoring app included", "Expandable storage"],
      bn: ["বিদ্যুৎ গেলে স্বয়ংক্রিয় ব্যাকআপ", "মনিটরিং অ্যাপসহ", "স্টোরেজ বাড়ানো যায়"],
    },
    warranty: { en: "System warranty 5 years", bn: "সিস্টেম ওয়ারেন্টি ৫ বছর" },
    image: "/media/img/p-house-solar.jpg",
  },
  {
    slug: "rooftop-mounting-kit",
    category: "accessories",
    name: "Aluminium Rooftop Mounting (per kW)",
    tagline: { en: "Anodised rails, clamps & anchors", bn: "অ্যানোডাইজড রেল, ক্ল্যাম্প ও অ্যাংকর" },
    description: {
      en: "Corrosion-resistant aluminium mounting for flat and sloped roofs, engineered for cyclone-level wind loads.",
      bn: "সমতল ও ঢালু ছাদের জন্য মরিচারোধী অ্যালুমিনিয়াম মাউন্টিং, ঘূর্ণিঝড়-মাত্রার বাতাস সহ্য করার মতো ডিজাইন।",
    },
    price: 9500,
    keySpec: { en: "Rated to 60 m/s wind", bn: "৬০ মি/সে বাতাস সহনশীল" },
    specs: [
      { label: { en: "Material", bn: "উপাদান" }, value: "AL6005-T5, anodised" },
      { label: { en: "Fasteners", bn: "ফাস্টেনার" }, value: "SUS304 stainless" },
      { label: { en: "Wind load", bn: "বাতাসের লোড" }, value: "60 m/s" },
    ],
    highlights: {
      en: ["Cyclone-rated", "No rust, no painting", "Fast install"],
      bn: ["ঘূর্ণিঝড় সহনশীল", "মরিচা নেই, রং লাগে না", "দ্রুত ইনস্টল"],
    },
    warranty: { en: "12 years", bn: "১২ বছর" },
    image: "/media/img/install-hands.jpg",
  },
  {
    slug: "ci-rooftop-solution",
    category: "commercial",
    name: "C&I Rooftop Solution (50 kW+)",
    tagline: { en: "Turnkey solar for factories", bn: "কারখানার জন্য টার্নকি সোলার" },
    description: {
      en: "Design, supply, installation and O&M for factory and commercial rooftops, with capex, lease or PPA financing.",
      bn: "কারখানা ও বাণিজ্যিক ছাদের জন্য ডিজাইন, সরবরাহ, ইনস্টলেশন ও O&M — ক্যাপেক্স, লিজ বা PPA ফাইন্যান্সিংসহ।",
    },
    price: null,
    keySpec: { en: "50 kW – 5 MW", bn: "৫০ কিলোওয়াট – ৫ মেগাওয়াট" },
    specs: [
      { label: { en: "Scope", bn: "পরিসর" }, value: "EPC + O&M" },
      { label: { en: "Financing", bn: "ফাইন্যান্সিং" }, value: "Capex / Lease / PPA" },
      { label: { en: "Typical payback", bn: "সাধারণ পেব্যাক" }, value: "3.5 – 5 years" },
    ],
    highlights: {
      en: ["Structural roof assessment", "Zero-export or net metering", "Performance guarantee"],
      bn: ["ছাদের কাঠামো যাচাই", "জিরো-এক্সপোর্ট বা নেট মিটারিং", "পারফরম্যান্স গ্যারান্টি"],
    },
    warranty: { en: "Per contract", bn: "চুক্তি অনুযায়ী" },
    image: "/media/img/rooftop-sunset.jpg",
  },
  {
    slug: "helios-tracker",
    category: "commercial",
    name: "HELIOS Single-Axis Tracker",
    tagline: { en: "Up to 25% more energy from every module", bn: "প্রতিটি মডিউল থেকে ২৫% পর্যন্ত বেশি বিদ্যুৎ" },
    description: {
      en: "A single-axis tracking system for utility-scale parks that follows the sun from east to west, paired with TITAN bifacial modules.",
      bn: "ইউটিলিটি-স্কেল পার্কের জন্য সিঙ্গেল-অ্যাক্সিস ট্র্যাকিং সিস্টেম যা পূর্ব থেকে পশ্চিমে সূর্যকে অনুসরণ করে, TITAN বাইফেসিয়াল মডিউলের সাথে।",
    },
    price: null,
    keySpec: { en: "±60° tracking range", bn: "±৬০° ট্র্যাকিং রেঞ্জ" },
    specs: [
      { label: { en: "Tracking range", bn: "ট্র্যাকিং রেঞ্জ" }, value: "±60°" },
      { label: { en: "Modules per row", bn: "প্রতি সারিতে মডিউল" }, value: "Up to 90" },
      { label: { en: "Control", bn: "কন্ট্রোল" }, value: "Astronomical + backtracking" },
    ],
    highlights: {
      en: ["Bifacial-optimised", "Stow mode for storms", "Remote SCADA control"],
      bn: ["বাইফেসিয়াল-উপযোগী", "ঝড়ে স্টো মোড", "রিমোট SCADA কন্ট্রোল"],
    },
    warranty: { en: "Per contract", bn: "চুক্তি অনুযায়ী" },
    image: "/media/img/panels-tilted.jpg",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const featuredProducts = () => products.filter((p) => p.featured);
