import type { Localized } from "@/i18n/config";

/**
 * Product catalogue — quote only (no prices, no cart).
 *
 * Partner-brand models use figures from the manufacturers' public datasheets
 * (`source` holds the URL each model's numbers were taken from). Generic items
 * (storage, controllers, BOS, mounting, whole systems) follow the OSLEOS
 * brochure and are specified per project.
 */

export type CategoryId =
  | "panels"
  | "inverters"
  | "storage"
  | "controllers"
  | "stabilizers"
  | "protection"
  | "mounting"
  | "commercial"
  | "ai"
  | "combo";

export type Product = {
  slug: string;
  category: CategoryId;
  /** Manufacturer; omitted for items OSLEOS specifies and sources per project. */
  brand?: string;
  /** Real model name as the manufacturer markets it. */
  name: string;
  tagline: Localized;
  description: Localized;
  keySpec: Localized;
  specs: { label: Localized; value: string }[];
  highlights: Localized<string[]>;
  /** Brand smart-feature list shown as its own block on the product page (Huawei). */
  features?: Localized<string[]>;
  warranty?: Localized;
  image: string;
  /** Attribution line for photos that need one (CC BY / CC BY-SA). Shown under the image on the product page. */
  imageCredit?: Localized;
  /** Optional "Ideal applications" list shown on the product page. */
  applications?: Localized<string[]>;
  /** CSS object-position for the cropped card/hero image, e.g. "50% 25%" to keep a logo in view. */
  imagePosition?: string;
  /** "contain" shows the whole picture (for composites with text) instead of cropping it to the frame. */
  imageFit?: "contain";
  /** Solar Combo Package details: bundle contents, suitability, price in BDT. */
  combo?: {
    price?: { regular?: number; offer: number };
    suitableFor?: Localized<string[]>;
    includes: Localized<string[]>;
    idealFor?: Localized<string[]>;
    benefits?: Localized<string[]>;
    /** Transportation note; defaults to "subject to discussion". */
    transport?: Localized;
    /** Customisation note; defaults to the standard line. */
    customise?: Localized;
  };
  featured?: boolean;
  /** Where the specs came from (manufacturer datasheet). Not rendered. */
  source?: string;
  /**
   * @deprecated The catalogue is quote-only. Always undefined; kept so the
   * legacy (unused) cart components still type-check.
   */
  price?: never;
};

export const categories: { id: CategoryId; name: Localized; blurb: Localized; image: string }[] = [
  {
    id: "panels",
    name: { en: "Solar Panels", bn: "সোলার প্যানেল" },
    blurb: { en: "Tier-1 N-type modules, 430–630 W", bn: "টিয়ার-১ N-টাইপ মডিউল, ৪৩০–৬৩০ ওয়াট" },
    image: "/media/img/panels-closeup.webp",
  },
  {
    id: "inverters",
    name: { en: "Inverters", bn: "ইনভার্টার" },
    blurb: { en: "Hybrid, off-grid & on-grid, 5–110 kW", bn: "হাইব্রিড, অফ-গ্রিড ও অন-গ্রিড, ৫–১১০ কিলোওয়াট" },
    image: "/media/img/electronics.webp",
  },
  {
    id: "storage",
    name: { en: "Energy Storage", bn: "এনার্জি স্টোরেজ" },
    blurb: { en: "Lead-acid, LiFePO₄ & C&I battery systems", bn: "লেড-অ্যাসিড, LiFePO₄ ও C&I ব্যাটারি সিস্টেম" },
    image: "/media/img/p-battery-rack.webp",
  },
  {
    id: "controllers",
    name: { en: "Charge Controllers", bn: "চার্জ কন্ট্রোলার" },
    blurb: { en: "PWM, MPPT & smart controllers", bn: "PWM, MPPT ও স্মার্ট কন্ট্রোলার" },
    image: "/media/img/install-hands.webp",
  },
  {
    id: "stabilizers",
    name: { en: "Voltage Stabilizers", bn: "ভোল্টেজ স্ট্যাবিলাইজার" },
    blurb: { en: "Steady voltage for homes, farms & factories", bn: "বাসা, খামার ও কারখানার জন্য স্থির ভোল্টেজ" },
    image: "/media/products/stabilizer.webp",
  },
  {
    id: "protection",
    name: { en: "Protection & Accessories", bn: "প্রোটেকশন ও এক্সেসরিজ" },
    blurb: { en: "Breakers, SPDs, isolators, cables", bn: "ব্রেকার, SPD, আইসোলেটর, ক্যাবল" },
    image: "/media/img/electrician.webp",
  },
  {
    id: "mounting",
    name: { en: "Mounting Structures", bn: "মাউন্টিং স্ট্রাকচার" },
    blurb: { en: "Rooftop, ground & elevated", bn: "রুফটপ, গ্রাউন্ড ও এলিভেটেড" },
    image: "/media/products/mount-ground.webp",
  },
  {
    id: "commercial",
    name: { en: "Commercial & Utility", bn: "বাণিজ্যিক ও ইউটিলিটি" },
    blurb: { en: "Complete PV systems & energy solutions", bn: "সম্পূর্ণ পিভি সিস্টেম ও এনার্জি সলিউশন" },
    image: "/media/img/utility-aerial.webp",
  },
  {
    id: "ai",
    name: { en: "AI Integrated Solar Solutions", bn: "এআই ইন্টিগ্রেটেড সোলার সলিউশন" },
    blurb: {
      en: "Solar noise barriers, colored PV glass, robotic cleaning, trackers and more",
      bn: "সোলার নয়েজ ব্যারিয়ার, রঙিন পিভি গ্লাস, রোবটিক ক্লিনিং, ট্র্যাকার ও আরও অনেক কিছু",
    },
    image: "/media/products/solar-noise-barrier.webp",
  },
  {
    id: "combo",
    name: { en: "Solar Combo Package", bn: "সোলার কম্বো প্যাকেজ" },
    blurb: {
      en: "Ready-made panel, inverter and battery bundles for homes",
      bn: "বাসার জন্য প্যানেল, ইনভার্টার ও ব্যাটারির তৈরি প্যাকেজ",
    },
    image: "/media/products/combo-icon.webp",
  },
];

/** Intro line shown above the products of the AI Integrated tab (client wording). */
export const aiIntro: Localized = {
  en: "OSLEOS is developing partnerships with leading global technology providers to bring AI-enabled solar and intelligent energy-storage technologies to Bangladesh.",
  bn: "OSLEOS বিশ্বের শীর্ষস্থানীয় প্রযুক্তি সরবরাহকারীদের সঙ্গে অংশীদারিত্ব গড়ে তুলছে, যাতে এআই-সক্ষম সোলার ও ইন্টেলিজেন্ট এনার্জি-স্টোরেজ প্রযুক্তি বাংলাদেশে নিয়ে আসা যায়।",
};

/* ------------------------------------------------------------------ */
/* Spec labels, shared so the tables read consistently.                */
/* ------------------------------------------------------------------ */

const L = {
  power: { en: "Power range", bn: "পাওয়ার রেঞ্জ" },
  eff: { en: "Max. module efficiency", bn: "সর্বোচ্চ মডিউল দক্ষতা" },
  cells: { en: "Cell technology", bn: "সেল প্রযুক্তি" },
  glass: { en: "Glass", bn: "গ্লাস" },
  bifaciality: { en: "Bifaciality", bn: "বাইফেসিয়ালিটি" },
  dims: { en: "Dimensions", bn: "মাপ" },
  weight: { en: "Weight", bn: "ওজন" },
  tempCo: { en: "Temp. Coefficient (Pmax)", bn: "তাপমাত্রা সহগ (Pmax)" },
  degradation: { en: "Degradation", bn: "ডিগ্রেডেশন" },
  load: { en: "Mechanical load", bn: "মেকানিক্যাল লোড" },
  type: { en: "Type", bn: "ধরন" },
  ratedAc: { en: "Rated AC output", bn: "রেটেড এসি আউটপুট" },
  maxPv: { en: "Max. PV input", bn: "সর্বোচ্চ পিভি ইনপুট" },
  mppt: { en: "MPPT", bn: "MPPT" },
  maxVdc: { en: "Max. DC input voltage", bn: "সর্বোচ্চ ডিসি ইনপুট ভোল্টেজ" },
  battery: { en: "Battery", bn: "ব্যাটারি" },
  charge: { en: "Charge current", bn: "চার্জ কারেন্ট" },
  backup: { en: "Backup switch-over", bn: "ব্যাকআপ সুইচ-ওভার" },
  maxEff: { en: "Max. efficiency", bn: "সর্বোচ্চ দক্ষতা" },
  ip: { en: "Protection rating", bn: "প্রোটেকশন রেটিং" },
  size: { en: "Dimensions / weight", bn: "মাপ / ওজন" },
  grid: { en: "Grid connection", bn: "গ্রিড সংযোগ" },
  capacity: { en: "Capacity", bn: "ক্যাপাসিটি" },
  input: { en: "Input voltage range", bn: "ইনপুট ভোল্টেজ রেঞ্জ" },
  output: { en: "Output voltage", bn: "আউটপুট ভোল্টেজ" },
  protections: { en: "Protections", bn: "প্রোটেকশন" },
  standard: { en: "Standard", bn: "স্ট্যান্ডার্ড" },
  current: { en: "Rated current", bn: "রেটেড কারেন্ট" },
  maxDischarge: { en: "Maximum discharge current (Imax)", bn: "সর্বোচ্চ ডিসচার্জ কারেন্ট (Imax)" },
  voltage: { en: "Rated voltage", bn: "রেটেড ভোল্টেজ" },
  breaking: { en: "Breaking capacity", bn: "ব্রেকিং ক্যাপাসিটি" },
  poles: { en: "Poles", bn: "পোল" },
  systemV: { en: "System voltage", bn: "সিস্টেম ভোল্টেজ" },
  chemistry: { en: "Battery types", bn: "ব্যাটারির ধরন" },
  scope: { en: "Scope", bn: "পরিসর" },
  idealFor: { en: "Ideal for", bn: "উপযোগী" },
  components: { en: "Key components", bn: "মূল কম্পোনেন্ট" },
  model: { en: "Commercial model", bn: "বাণিজ্যিক মডেল" },
  material: { en: "Material", bn: "উপাদান" },
  application: { en: "Application", bn: "ব্যবহার" },
  soundIndex: { en: "Weighted sound reduction index", bn: "ওয়েটেড সাউন্ড রিডাকশন ইনডেক্স" },
  nrc: { en: "Noise Reduction Coefficient", bn: "নয়েজ রিডাকশন কোএফিশিয়েন্ট" },
  certs: { en: "Certification", bn: "সার্টিফিকেশন" },
  cleaning: { en: "Cleaning method", bn: "ক্লিনিং পদ্ধতি" },
  control: { en: "Control", bn: "নিয়ন্ত্রণ" },
  powerSupply: { en: "Power supply", bn: "পাওয়ার সাপ্লাই" },
  runtime: { en: "Run time", bn: "চলার সময়" },
  speed: { en: "Cleaning speed", bn: "ক্লিনিং গতি" },
  sensors: { en: "Sensors", bn: "সেন্সর" },
  detects: { en: "Detects", bn: "যা শনাক্ত করে" },
  signalOut: { en: "Signal output", bn: "সিগনাল আউটপুট" },
  trackRange: { en: "Tracking range", bn: "ট্র্যাকিং রেঞ্জ" },
  trackAcc: { en: "Tracking accuracy", bn: "ট্র্যাকিং নির্ভুলতা" },
  motor: { en: "Drive motor", bn: "ড্রাইভ মোটর" },
  opTemp: { en: "Operating temperature", bn: "অপারেটিং তাপমাত্রা" },
  windSpeed: { en: "Max. wind speed", bn: "সর্বোচ্চ বাতাসের গতি" },
  snowLoad: { en: "Max. snow load", bn: "সর্বোচ্চ তুষার লোড" },
  slope: { en: "Terrain slope tolerance", bn: "জমির ঢাল সহনীয়তা" },
  panels: { en: "Solar panels", bn: "সোলার প্যানেল" },
  inverter: { en: "Hybrid inverter", bn: "হাইব্রিড ইনভার্টার" },
} satisfies Record<string, Localized>;

type Label = keyof typeof L;
const spec = (label: Label, value: string) => ({ label: L[label], value });

/** Huawei smart features (client list, Oct 2026) — shown on every Huawei product. */
const huaweiFeatures: Localized<string[]> = {
  en: ["AI-powered arc-fault protection", "Smart energy management", "Intelligent monitoring", "Smart I-V curve diagnosis", "Intelligent system diagnostics"],
  bn: ["এআই-চালিত আর্ক-ফল্ট প্রোটেকশন", "স্মার্ট এনার্জি ম্যানেজমেন্ট", "ইন্টেলিজেন্ট মনিটরিং", "স্মার্ট I-V কার্ভ ডায়াগনসিস", "ইন্টেলিজেন্ট সিস্টেম ডায়াগনস্টিকস"],
};

const perProject: Localized = { en: "As per manufacturer warranty terms", bn: "প্রস্তুতকারকের ওয়ারেন্টি শর্ত অনুযায়ী" };
const perContract: Localized = { en: "Per contract", bn: "চুক্তি অনুযায়ী" };

/* ------------------------------------------------------------------ */

const catalogue: Product[] = [
  /* ============================ SOLAR PANELS ============================ */
  {
    slug: "trina-vertex-s-plus-neg9r28",
    category: "panels",
    brand: "Trina Solar",
    name: "Vertex S+ TSM-NEG9R.28",
    tagline: { en: "Dual-glass N-type module for home and C&I rooftops", bn: "বাসা ও বাণিজ্যিক ছাদের জন্য ডুয়াল-গ্লাস N-টাইপ মডিউল" },
    description: {
      en: "Trina's compact i-TOPCon module: high output from a small, light panel that suits Bangladesh's crowded city rooftops, with dual-glass durability against heat and humidity.",
      bn: "ট্রিনার কমপ্যাক্ট i-TOPCon মডিউল — ছোট ও হালকা প্যানেলে বেশি উৎপাদন, যা শহরের সীমিত ছাদের জন্য উপযোগী। ডুয়াল-গ্লাস গঠন গরম ও আর্দ্রতায় দীর্ঘ সময় টেকে।",
    },
    keySpec: { en: "425–450 W · up to 22.5%", bn: "৪২৫–৪৫০ ওয়াট · সর্বোচ্চ ২২.৫%" },
    specs: [
      spec("power", "425–450 W"),
      spec("eff", "22.5%"),
      spec("cells", "N-type i-TOPCon, 144 cells"),
      spec("glass", "Dual glass, 1.6 + 1.6 mm"),
      spec("dims", "1762 × 1134 × 30 mm"),
      spec("weight", "21.0 kg"),
      spec("tempCo", "−0.30 %/K"),
      spec("degradation", "1% year 1, 0.4%/yr after"),
    ],
    highlights: {
      en: ["Small, light format for tight rooftops", "5,400 Pa snow / 4,000 Pa wind test load", "N-type: low degradation", "Works with mainstream inverters and optimisers"],
      bn: ["সীমিত ছাদের জন্য ছোট ও হালকা", "৫,৪০০ Pa / ৪,০০০ Pa টেস্ট লোড", "N-টাইপ: কম ডিগ্রেডেশন", "প্রচলিত ইনভার্টার ও অপটিমাইজারের সাথে মানানসই"],
    },
    warranty: { en: "25-year product · 30-year power", bn: "২৫ বছর প্রোডাক্ট · ৩০ বছর পাওয়ার" },
    image: "/media/products/trina-vertex-s-plus-neg9r28.webp",
    source: "https://static.trinasolar.com/sites/default/files/Datasheet_Vertex%20S+_NEG9R.28_EN_2024_C_web.pdf",
  },
  {
    slug: "trina-vertex-n-neg19rc20",
    category: "panels",
    brand: "Trina Solar",
    name: "Vertex N TSM-NEG19RC.20",
    tagline: { en: "Bifacial dual-glass module for factories and solar parks", bn: "কারখানা ও সোলার পার্কের জন্য বাইফেসিয়াল ডুয়াল-গ্লাস মডিউল" },
    description: {
      en: "An N-type TOPCon module built for large rooftops and ground-mount plants. The rear side adds yield from reflected light, and the low temperature coefficient holds output in hot weather.",
      bn: "বড় ছাদ ও গ্রাউন্ড-মাউন্ট প্ল্যান্টের জন্য তৈরি N-টাইপ TOPCon মডিউল। পেছনের দিক প্রতিফলিত আলো থেকে বাড়তি বিদ্যুৎ দেয়, আর কম তাপমাত্রা সহগ গরমেও উৎপাদন ধরে রাখে।",
    },
    keySpec: { en: "590–620 W · bifacial", bn: "৫৯০–৬২০ ওয়াট · বাইফেসিয়াল" },
    specs: [
      spec("power", "590–620 W"),
      spec("eff", "23.0%"),
      spec("cells", "N-type TOPCon, 132 cells"),
      spec("bifaciality", "80 ± 5%"),
      spec("glass", "Dual glass, 2.0 + 2.0 mm"),
      spec("dims", "2382 × 1134 × 30 mm"),
      spec("weight", "33.0 kg"),
      spec("tempCo", "−0.29 %/°C"),
    ],
    highlights: {
      en: ["Up to 30% extra rear-side gain (albedo dependent)", "1% first-year, 0.4% annual degradation", "Resistant to salt mist, ammonia and humidity", "5,400 Pa / 2,400 Pa load rating"],
      bn: ["পেছন দিক থেকে ৩০% পর্যন্ত বাড়তি উৎপাদন (মাটির প্রতিফলন অনুযায়ী)", "প্রথম বছর ১%, পরে বছরে ০.৪% ডিগ্রেডেশন", "লবণাক্ত বাতাস, অ্যামোনিয়া ও আর্দ্রতা প্রতিরোধী", "৫,৪০০ Pa / ২,৪০০ Pa লোড রেটিং"],
    },
    warranty: { en: "12-year product · 30-year power", bn: "১২ বছর প্রোডাক্ট · ৩০ বছর পাওয়ার" },
    image: "/media/products/trina-vertex-n-neg19rc20.webp",
    featured: true,
    source: "https://static.trinasolar.com/sites/default/files/Datasheet_210R_NEG19RC.20_EN_2024A_web.pdf",
  },
  {
    slug: "jinko-tiger-neo-54hl4r-b",
    category: "panels",
    brand: "Jinko Solar",
    name: "Tiger Neo N-type 54HL4R-B",
    tagline: { en: "All-black N-type module for homes", bn: "বাসার জন্য অল-ব্ল্যাক N-টাইপ মডিউল" },
    description: {
      en: "Jinko's all-black Tiger Neo for residential roofs: a clean look, HOT 2.0 N-type cells with low LID/LeTID, and a 25-year product warranty.",
      bn: "বাসার ছাদের জন্য জিঙ্কোর অল-ব্ল্যাক টাইগার নিও — পরিচ্ছন্ন চেহারা, কম LID/LeTID সহ HOT 2.0 N-টাইপ সেল এবং ২৫ বছরের প্রোডাক্ট ওয়ারেন্টি।",
    },
    keySpec: { en: "420–440 W · all-black", bn: "৪২০–৪৪০ ওয়াট · অল-ব্ল্যাক" },
    specs: [
      spec("power", "420–440 W"),
      spec("eff", "22.02%"),
      spec("cells", "N-type mono, 108 cells"),
      spec("glass", "3.2 mm AR-coated tempered"),
      spec("dims", "1762 × 1134 × 30 mm"),
      spec("weight", "22 kg"),
      spec("tempCo", "−0.29 %/°C"),
      spec("load", "6,000 Pa snow / 4,000 Pa wind"),
    ],
    highlights: {
      en: ["All-black frame and backsheet", "SMBB cells for better light capture", "High salt-mist and ammonia resistance", "0.40% annual degradation over 30 years"],
      bn: ["অল-ব্ল্যাক ফ্রেম ও ব্যাকশিট", "SMBB সেলে ভালো আলো শোষণ", "লবণাক্ত বাতাস ও অ্যামোনিয়া প্রতিরোধী", "৩০ বছরে বার্ষিক মাত্র ০.৪০% ডিগ্রেডেশন"],
    },
    warranty: { en: "25-year product · 30-year linear power", bn: "২৫ বছর প্রোডাক্ট · ৩০ বছর লিনিয়ার পাওয়ার" },
    image: "/media/products/jinko-tiger-neo-54hl4r-b.webp",
    featured: true,
    source: "https://jinkosolarcdn.shwebspace.com/uploads/JKM420-440N-54HL4R-B-F1.3-EN.pdf",
  },
  {
    slug: "jinko-tiger-neo-72hl4-bdv",
    category: "panels",
    brand: "Jinko Solar",
    name: "Tiger Neo N-type 72HL4-BDV",
    tagline: { en: "Bifacial dual-glass module for utility and C&I", bn: "ইউটিলিটি ও বাণিজ্যিক প্রকল্পের জন্য বাইফেসিয়াল মডিউল" },
    description: {
      en: "The 72-cell bifacial Tiger Neo is a workhorse for ground-mount and large rooftop projects, with dual-sided generation and strong low-light behaviour from TOPCon cells.",
      bn: "৭২-সেলের বাইফেসিয়াল টাইগার নিও গ্রাউন্ড-মাউন্ট ও বড় ছাদের প্রকল্পের নির্ভরযোগ্য পছন্দ — দুই দিক থেকে উৎপাদন এবং TOPCon সেলের কারণে কম আলোতেও ভালো পারফরম্যান্স।",
    },
    keySpec: { en: "570–590 W · bifacial", bn: "৫৭০–৫৯০ ওয়াট · বাইফেসিয়াল" },
    specs: [
      spec("power", "570–590 W"),
      spec("eff", "22.45%"),
      spec("cells", "N-type TOPCon, 144 half-cells"),
      spec("bifaciality", "80 ± 5%"),
      spec("glass", "Dual glass, 2.0 + 2.0 mm"),
      spec("dims", "2278 × 1134 × 30 mm"),
      spec("weight", "32 kg"),
      spec("tempCo", "−0.29 %/°C"),
    ],
    highlights: {
      en: ["Dual-sided generation lowers LCOE", "Anti-PID guarantee", "5,400 Pa front / 2,400 Pa rear load", "1% first-year, 0.4% annual degradation"],
      bn: ["দুই দিক থেকে উৎপাদনে খরচ কমে", "অ্যান্টি-PID গ্যারান্টি", "৫,৪০০ Pa সামনে / ২,৪০০ Pa পেছনে লোড", "প্রথম বছর ১%, পরে বছরে ০.৪% ডিগ্রেডেশন"],
    },
    warranty: { en: "12-year product · 30-year power", bn: "১২ বছর প্রোডাক্ট · ৩০ বছর পাওয়ার" },
    image: "/media/products/jinko-tiger-neo-72hl4-bdv.webp",
    source: "https://jinkosolarcdn.shwebspace.com/uploads/65d17719/JKM570-590N-72HL4-BDV-F8-EN.pdf",
  },
  {
    slug: "longi-hi-mo-6-lr5-54hth",
    category: "panels",
    brand: "LONGi",
    name: "Hi-MO 6 LR5-54HTH",
    tagline: { en: "Back-contact (HPBC) module for rooftops", bn: "ছাদের জন্য ব্যাক-কন্টাক্ট (HPBC) মডিউল" },
    description: {
      en: "LONGi's HPBC cells move the contacts to the rear of the cell, so more of the front catches light. A 108-cell size that fits homes, shops and offices.",
      bn: "লঙ্গির HPBC সেলে কন্টাক্টগুলো সেলের পেছনে থাকে, তাই সামনের পুরো অংশ আলো ধরে। বাসা, দোকান ও অফিসের জন্য মানানসই ১০৮-সেলের মাপ।",
    },
    keySpec: { en: "440–450 W · up to 23.0%", bn: "৪৪০–৪৫০ ওয়াট · সর্বোচ্চ ২৩.০%" },
    specs: [
      spec("power", "440–450 W"),
      spec("eff", "23.0%"),
      spec("cells", "HPBC mono, 108 half-cells"),
      spec("glass", "3.2 mm coated tempered"),
      spec("dims", "1722 × 1134 × 30 mm"),
      spec("weight", "20.8 kg"),
      spec("tempCo", "−0.29 %/°C"),
      spec("load", "5,400 Pa front / 2,400 Pa rear"),
    ],
    highlights: {
      en: ["Back-contact cells, clean front face", "Compact 1722 mm length", "25 mm hail tested", "0.40% annual degradation"],
      bn: ["ব্যাক-কন্টাক্ট সেল, পরিষ্কার সামনের অংশ", "কমপ্যাক্ট ১৭২২ মিমি দৈর্ঘ্য", "২৫ মিমি শিলাবৃষ্টি পরীক্ষিত", "বছরে ০.৪০% ডিগ্রেডেশন"],
    },
    warranty: { en: "25-year power warranty", bn: "২৫ বছর পাওয়ার ওয়ারেন্টি" },
    image: "/media/products/longi-hi-mo-6-lr5-54hth.webp",
    source: "https://www.solar4ever.com.au/Brochures/LonGi%20-%20LR5-54HTH-440M.pdf",
  },
  {
    slug: "longi-hi-mo-7-lr5-72hgd",
    category: "panels",
    brand: "LONGi",
    name: "Hi-MO 7 LR5-72HGD",
    tagline: { en: "Bifacial module for utility power plants", bn: "ইউটিলিটি পাওয়ার প্ল্যান্টের জন্য বাইফেসিয়াল মডিউল" },
    description: {
      en: "Hi-MO 7 pairs HPDC cells with a dual-glass bifacial build and a −0.28 %/°C temperature coefficient, one of the better figures for hot climates.",
      bn: "Hi-MO 7-এ HPDC সেল, ডুয়াল-গ্লাস বাইফেসিয়াল গঠন এবং −০.২৮ %/°C তাপমাত্রা সহগ — গরম আবহাওয়ার জন্য অন্যতম ভালো মান।",
    },
    keySpec: { en: "560–590 W · bifacial", bn: "৫৬০–৫৯০ ওয়াট · বাইফেসিয়াল" },
    specs: [
      spec("power", "560–590 W"),
      spec("eff", "22.8%"),
      spec("cells", "HPDC, 144 half-cells"),
      spec("bifaciality", "80 ± 5%"),
      spec("glass", "Dual glass, 2.0 + 2.0 mm"),
      spec("dims", "2278 × 1134 × 30 mm"),
      spec("weight", "31.8 kg"),
      spec("tempCo", "−0.28 %/°C"),
    ],
    highlights: {
      en: ["High bifaciality for ground-mount plants", "Below 1% first-year degradation", "0.4% per year from year 2 to 30", "5,400 Pa / 2,400 Pa load rating"],
      bn: ["গ্রাউন্ড-মাউন্ট প্ল্যান্টে উচ্চ বাইফেসিয়ালিটি", "প্রথম বছর ১%-এর কম ডিগ্রেডেশন", "২য় থেকে ৩০তম বছর বছরে ০.৪%", "৫,৪০০ Pa / ২,৪০০ Pa লোড রেটিং"],
    },
    warranty: { en: "12-year product · 30-year power", bn: "১২ বছর প্রোডাক্ট · ৩০ বছর পাওয়ার" },
    image: "/media/products/longi-hi-mo-7-lr5-72hgd.webp",
    source: "https://static.longi.com/L_Gi_LE_PM_T_PMD_059_F139_LR_5_72_HGD_560_590_M_V1_30_30_and_15_V19_3_EN_8fdcd1a7f4.pdf",
  },
  {
    slug: "ja-solar-deepblue-4-pro-jam54d41-lb",
    category: "panels",
    brand: "JA Solar",
    name: "DeepBlue 4.0 Pro JAM54D41 LB",
    tagline: { en: "All-black bifacial module for homes", bn: "বাসার জন্য অল-ব্ল্যাক বাইফেসিয়াল মডিউল" },
    description: {
      en: "JA Solar's n-type double-glass module in a residential size, all-black and bifacial, so raised or light-coloured roofs add rear-side yield.",
      bn: "বাসার মাপে জে-এ সোলারের n-টাইপ ডাবল-গ্লাস মডিউল — অল-ব্ল্যাক ও বাইফেসিয়াল, তাই উঁচু স্ট্রাকচার বা হালকা রঙের ছাদে পেছন দিক থেকেও বিদ্যুৎ আসে।",
    },
    keySpec: { en: "430–455 W · all-black", bn: "৪৩০–৪৫৫ ওয়াট · অল-ব্ল্যাক" },
    specs: [
      spec("power", "430–455 W"),
      spec("eff", "22.8%"),
      spec("cells", "N-type mono, 108 half-cells"),
      spec("bifaciality", "80 ± 10%"),
      spec("glass", "Double glass, 1.6 + 1.6 mm"),
      spec("dims", "1762 × 1134 × 30 mm"),
      spec("weight", "22 kg"),
      spec("tempCo", "−0.290 %/°C"),
    ],
    highlights: {
      en: ["All-black, double-glass build", "Rear-side gain on elevated mounts", "5,400 Pa / 2,400 Pa load rating", "1500 V DC system voltage"],
      bn: ["অল-ব্ল্যাক, ডাবল-গ্লাস গঠন", "উঁচু মাউন্টে পেছন দিক থেকে বাড়তি উৎপাদন", "৫,৪০০ Pa / ২,৪০০ Pa লোড রেটিং", "১৫০০ ভোল্ট ডিসি সিস্টেম ভোল্টেজ"],
    },
    warranty: { en: "12-year product · 30-year power", bn: "১২ বছর প্রোডাক্ট · ৩০ বছর পাওয়ার" },
    image: "/media/products/ja-solar-deepblue-4-pro-jam54d41-lb.webp",
    source: "https://www.jasolar.eu/fileadmin/data/products/4.0/JAM54D41_LB.pdf",
  },
  {
    slug: "ja-solar-deepblue-4-pro-jam72d40-mb",
    category: "panels",
    brand: "JA Solar",
    name: "DeepBlue 4.0 Pro JAM72D40 MB",
    tagline: { en: "Bifacial module for C&I roofs and solar parks", bn: "বাণিজ্যিক ছাদ ও সোলার পার্কের জন্য বাইফেসিয়াল মডিউল" },
    description: {
      en: "A 72-cell n-type TOPCon double-glass module for commercial and utility projects, reaching 23.4% efficiency at the top power bin.",
      bn: "বাণিজ্যিক ও ইউটিলিটি প্রকল্পের জন্য ৭২-সেলের n-টাইপ TOPCon ডাবল-গ্লাস মডিউল — সর্বোচ্চ পাওয়ার বিনে ২৩.৪% দক্ষতা।",
    },
    keySpec: { en: "580–605 W · up to 23.4%", bn: "৫৮০–৬০৫ ওয়াট · সর্বোচ্চ ২৩.৪%" },
    specs: [
      spec("power", "580–605 W"),
      spec("eff", "23.4%"),
      spec("cells", "N-type TOPCon, 144 half-cells"),
      spec("bifaciality", "80 ± 5%"),
      spec("glass", "Double glass, 2.0 + 2.0 mm"),
      spec("dims", "2278 × 1134 × 30 mm"),
      spec("weight", "31.8 kg"),
      spec("tempCo", "−0.290 %/°C"),
    ],
    highlights: {
      en: ["Tracker-compatible mounting holes", "1% first-year, 0.4% annual degradation", "5,400 Pa / 2,400 Pa load rating", "IP68 junction box"],
      bn: ["ট্র্যাকার-উপযোগী মাউন্টিং হোল", "প্রথম বছর ১%, পরে বছরে ০.৪% ডিগ্রেডেশন", "৫,৪০০ Pa / ২,৪০০ Pa লোড রেটিং", "IP68 জংশন বক্স"],
    },
    warranty: { en: "12-year product · 30-year power", bn: "১২ বছর প্রোডাক্ট · ৩০ বছর পাওয়ার" },
    image: "/media/products/ja-solar-deepblue-4-pro-jam72d40-mb.webp",
    source: "https://www.jasolar.eu/fileadmin/data/products/4.0/JAM72D40_MB.pdf",
  },
  {
    slug: "canadian-solar-tophiku6-cs6-1-54tm",
    category: "panels",
    brand: "Canadian Solar",
    name: "TOPHiKu6 All-Black CS6.1-54TM",
    tagline: { en: "All-black TOPCon module with heavy-load rating", bn: "উচ্চ লোড রেটিংসহ অল-ব্ল্যাক TOPCon মডিউল" },
    description: {
      en: "Canadian Solar's residential TOPCon module: all-black, up to 470 W, and rated for very high wind loads, useful for exposed rooftops in cyclone-prone districts.",
      bn: "ক্যানাডিয়ান সোলারের আবাসিক TOPCon মডিউল — অল-ব্ল্যাক, ৪৭০ ওয়াট পর্যন্ত, এবং খুব বেশি বাতাসের লোডে রেটেড; ঘূর্ণিঝড়প্রবণ এলাকার খোলা ছাদে কাজে আসে।",
    },
    keySpec: { en: "445–470 W · up to 23.0%", bn: "৪৪৫–৪৭০ ওয়াট · সর্বোচ্চ ২৩.০%" },
    specs: [
      spec("power", "445–470 W"),
      spec("eff", "23.0%"),
      spec("cells", "N-type TOPCon, 108 half-cells"),
      spec("glass", "3.2 mm AR-coated tempered"),
      spec("dims", "1800 × 1134 × 35 mm"),
      spec("weight", "23 kg"),
      spec("tempCo", "−0.29 %/°C"),
      spec("load", "8,100 Pa snow / 6,000 Pa wind"),
    ],
    highlights: {
      en: ["Rated for 6,000 Pa wind load", "Anti-LeTID and anti-PID", "1% first-year, 0.4% annual degradation", "All-black appearance"],
      bn: ["৬,০০০ Pa বাতাসের লোডে রেটেড", "অ্যান্টি-LeTID ও অ্যান্টি-PID", "প্রথম বছর ১%, পরে বছরে ০.৪% ডিগ্রেডেশন", "অল-ব্ল্যাক চেহারা"],
    },
    warranty: { en: "Up to 25-year product · 30-year power", bn: "২৫ বছর পর্যন্ত প্রোডাক্ট · ৩০ বছর পাওয়ার" },
    image: "/media/products/canadian-solar-tophiku6-cs6-1-54tm.webp",
    source: "https://static.csisolar.com/wp-content/uploads/sites/3/2024/01/25141819/CS-Datasheet-TOPHiKu6-All-Black_CS6.1-54TM-H_v1.1C25_F23_P1_NA-US-445-470W.pdf",
  },
  {
    slug: "canadian-solar-topbihiku6-cs6-2-66tb",
    category: "panels",
    brand: "Canadian Solar",
    name: "TOPBiHiKu6 CS6.2-66TB",
    tagline: { en: "Bifacial TOPCon module up to 630 W", bn: "৬৩০ ওয়াট পর্যন্ত বাইফেসিয়াল TOPCon মডিউল" },
    description: {
      en: "A high-power bifacial module for utility and large C&I arrays, with up to 85% bifaciality and a hail rating of 35 mm ice balls.",
      bn: "ইউটিলিটি ও বড় বাণিজ্যিক অ্যারের জন্য উচ্চ-ক্ষমতার বাইফেসিয়াল মডিউল — ৮৫% পর্যন্ত বাইফেসিয়ালিটি এবং ৩৫ মিমি শিলাবৃষ্টি পরীক্ষিত।",
    },
    keySpec: { en: "600–630 W · up to 23.3%", bn: "৬০০–৬৩০ ওয়াট · সর্বোচ্চ ২৩.৩%" },
    specs: [
      spec("power", "600–630 W"),
      spec("eff", "23.3%"),
      spec("cells", "N-type TOPCon, 132 cells"),
      spec("bifaciality", "Up to 85%"),
      spec("glass", "Dual glass, 2.0 + 2.0 mm"),
      spec("dims", "2382 × 1134 × 30 mm"),
      spec("weight", "32.8 kg"),
      spec("tempCo", "−0.29 %/°C"),
    ],
    highlights: {
      en: ["Up to 85% power bifaciality", "Tested with 35 mm hail", "5,400 Pa / 2,400 Pa load rating", "1% first-year, 0.4% annual degradation"],
      bn: ["৮৫% পর্যন্ত বাইফেসিয়ালিটি", "৩৫ মিমি শিলাবৃষ্টি পরীক্ষিত", "৫,৪০০ Pa / ২,৪০০ Pa লোড রেটিং", "প্রথম বছর ১%, পরে বছরে ০.৪% ডিগ্রেডেশন"],
    },
    warranty: { en: "12-year product · 30-year power", bn: "১২ বছর প্রোডাক্ট · ৩০ বছর পাওয়ার" },
    image: "/media/products/canadian-solar-topbihiku6-cs6-2-66tb.webp",
    source: "https://natec.com/wp-content/uploads/2024/07/CS-Datasheet-TOPBiHiKu6_CS6.2-66TB_v1.3_F67_EN_600-630W.pdf",
  },
  {
    slug: "astronergy-astro-n7s-chsm54rns",
    category: "panels",
    brand: "Astronergy",
    name: "ASTRO N7s CHSM54RNs(DG)(BLH)/F-BH",
    tagline: { en: "All-black bifacial TOPCon 4.0 module", bn: "অল-ব্ল্যাক বাইফেসিয়াল TOPCon 4.0 মডিউল" },
    description: {
      en: "Astronergy's residential module uses zero-busbar interconnection and TOPCon 4.0 cells in a sleek all-black, dual-glass format under 2 m².",
      bn: "অ্যাস্ট্রোনার্জির আবাসিক মডিউলে জিরো-বাসবার সংযোগ ও TOPCon 4.0 সেল — ২ বর্গমিটারের কম আকারে মসৃণ অল-ব্ল্যাক ডুয়াল-গ্লাস ডিজাইন।",
    },
    keySpec: { en: "440–460 W · up to 23.0%", bn: "৪৪০–৪৬০ ওয়াট · সর্বোচ্চ ২৩.০%" },
    specs: [
      spec("power", "440–460 W"),
      spec("eff", "23.0%"),
      spec("cells", "N-type TOPCon 4.0, 108 cells"),
      spec("glass", "Dual glass, 1.6 + 1.6 mm"),
      spec("dims", "1762 × 1134 × 30 mm"),
      spec("weight", "21.5 kg"),
      spec("tempCo", "−0.29 %/°C"),
      spec("degradation", "≤1% year 1, ≤0.4%/yr after"),
    ],
    highlights: {
      en: ["Zero-busbar tiling-film interconnect", "All-black, blends into rooftops", "Under 2 m², easy to carry and install", "5,400 Pa / 2,400 Pa load rating"],
      bn: ["জিরো-বাসবার টাইলিং-ফিল্ম সংযোগ", "অল-ব্ল্যাক, ছাদের সাথে মানিয়ে যায়", "২ বর্গমিটারের কম, বহন ও ইনস্টল সহজ", "৫,৪০০ Pa / ২,৪০০ Pa লোড রেটিং"],
    },
    warranty: { en: "25-year product · 30-year power", bn: "২৫ বছর প্রোডাক্ট · ৩০ বছর পাওয়ার" },
    image: "/media/products/astronergy-astro-n7s-chsm54rns.webp",
    source: "https://www.astronergy.com/wp-content/uploads/2024/03/440460ASTRO-N7s_CHSM54RNsDGBLHF-BH_1762%C3%971134%C3%9730_EN_20240601.pdf",
  },
  {
    slug: "astronergy-astro-n5-chsm72n",
    category: "panels",
    brand: "Astronergy",
    name: "ASTRO N5 CHSM72N(DG)/F-BH",
    tagline: { en: "Bifacial 72-cell module for large arrays", bn: "বড় অ্যারের জন্য ৭২-সেলের বাইফেসিয়াল মডিউল" },
    description: {
      en: "A dual-glass bifacial TOPCon 4.0 module for factory roofs and ground-mount plants, with a 15-year product warranty.",
      bn: "কারখানার ছাদ ও গ্রাউন্ড-মাউন্ট প্ল্যান্টের জন্য ডুয়াল-গ্লাস বাইফেসিয়াল TOPCon 4.0 মডিউল, ১৫ বছরের প্রোডাক্ট ওয়ারেন্টিসহ।",
    },
    keySpec: { en: "580–600 W · up to 23.2%", bn: "৫৮০–৬০০ ওয়াট · সর্বোচ্চ ২৩.২%" },
    specs: [
      spec("power", "580–600 W"),
      spec("eff", "23.2%"),
      spec("cells", "N-type TOPCon 4.0, 144 cells"),
      spec("glass", "Dual glass, 2.0 + 2.0 mm"),
      spec("dims", "2278 × 1134 × 30 mm"),
      spec("weight", "32.1 kg"),
      spec("tempCo", "−0.29 %/°C"),
      spec("degradation", "≤1% year 1, ≤0.4%/yr after"),
    ],
    highlights: {
      en: ["SMBB design cuts resistive loss", "Bifacial dual-glass build", "1500 V DC system voltage", "5,400 Pa / 2,400 Pa load rating"],
      bn: ["SMBB ডিজাইনে কম লস", "বাইফেসিয়াল ডুয়াল-গ্লাস গঠন", "১৫০০ ভোল্ট ডিসি সিস্টেম ভোল্টেজ", "৫,৪০০ Pa / ২,৪০০ Pa লোড রেটিং"],
    },
    warranty: { en: "15-year product · 30-year power", bn: "১৫ বছর প্রোডাক্ট · ৩০ বছর পাওয়ার" },
    image: "/media/products/astronergy-astro-n5-chsm72n.webp",
    source: "https://www.astronergy.com/wp-content/uploads/2023/08/580600ASTRO-N5_CHSM72NDGF-BH_2278x1134x30_EN_20240601-1.pdf",
  },

  /* ============================== INVERTERS ============================= */
  {
    slug: "sungrow-sh10rt",
    category: "inverters",
    brand: "Sungrow",
    name: "SH10RT",
    tagline: { en: "Three-phase hybrid inverter with battery backup", bn: "ব্যাটারি ব্যাকআপসহ থ্রি-ফেজ হাইব্রিড ইনভার্টার" },
    description: {
      en: "A residential and small-business hybrid that runs solar, a high-voltage lithium battery and the grid together, switching to backup in under 20 ms during load-shedding.",
      bn: "বাসা ও ছোট ব্যবসার জন্য হাইব্রিড ইনভার্টার — সোলার, হাই-ভোল্টেজ লিথিয়াম ব্যাটারি ও গ্রিড একসাথে চালায়, লোডশেডিংয়ে ২০ মিলিসেকেন্ডের কম সময়ে ব্যাকআপে যায়।",
    },
    keySpec: { en: "10 kW · 3-phase hybrid", bn: "১০ কিলোওয়াট · থ্রি-ফেজ হাইব্রিড" },
    specs: [
      spec("type", "Three-phase hybrid"),
      spec("ratedAc", "10,000 W"),
      spec("maxPv", "15,000 W recommended"),
      spec("mppt", "2 × MPPT, 200–950 V"),
      spec("battery", "Li-ion, 150–600 V, 30 A"),
      spec("backup", "< 20 ms"),
      spec("maxEff", "98.4%"),
      spec("ip", "IP65"),
      spec("size", "460 × 540 × 170 mm · 27 kg"),
    ],
    highlights: {
      en: ["Supports 100% unbalanced backup loads", "Up to 5 units in parallel", "Natural cooling, 30 dB(A)", "iSolarCloud monitoring"],
      bn: ["১০০% আনব্যালান্সড ব্যাকআপ লোড সাপোর্ট", "৫টি পর্যন্ত ইউনিট প্যারালালে", "প্রাকৃতিক কুলিং, মাত্র ৩০ dB(A)", "iSolarCloud মনিটরিং"],
    },
    warranty: perProject,
    image: "/media/products/sungrow-sh10rt.webp",
    source: "https://info-support.sungrowpower.com/application/pdf/2023/04/10/DS_20230403_SH5.0RT%20SH10RT_Datasheet_V15_EN%EF%BC%88AU%EF%BC%89.pdf",
  },
  {
    slug: "sungrow-sg110cx",
    category: "inverters",
    brand: "Sungrow",
    name: "SG110CX",
    tagline: { en: "110 kW string inverter for C&I and utility", bn: "বাণিজ্যিক ও ইউটিলিটির জন্য ১১০ কিলোওয়াট স্ট্রিং ইনভার্টার" },
    description: {
      en: "A nine-MPPT string inverter for factory rooftops and solar parks, with fuse-free string monitoring, PID recovery and a C5 anti-corrosion rating.",
      bn: "কারখানার ছাদ ও সোলার পার্কের জন্য ৯-MPPT স্ট্রিং ইনভার্টার — ফিউজ-ফ্রি স্ট্রিং মনিটরিং, PID রিকভারি এবং C5 অ্যান্টি-করোশন রেটিং।",
    },
    keySpec: { en: "110 kVA · 9 MPPTs", bn: "১১০ kVA · ৯টি MPPT" },
    specs: [
      spec("type", "Three-phase on-grid string"),
      spec("ratedAc", "110 kVA @ 45 °C"),
      spec("mppt", "9 × MPPT, 200–1000 V, 26 A each"),
      spec("maxVdc", "1,100 V"),
      spec("maxEff", "98.7% (Euro 98.5%)"),
      spec("ip", "IP66 · C5"),
      spec("protections", "DC Type I+II / AC Type II SPD"),
      spec("size", "1051 × 660 × 362.5 mm · 89 kg"),
    ],
    highlights: {
      en: ["Compatible with bifacial modules", "Smart I-V curve diagnosis", "Q-at-night reactive power", "Aluminium or copper AC cables"],
      bn: ["বাইফেসিয়াল মডিউলের সাথে মানানসই", "স্মার্ট I-V কার্ভ ডায়াগনসিস", "রাতে রিঅ্যাকটিভ পাওয়ার সাপোর্ট", "অ্যালুমিনিয়াম বা কপার এসি ক্যাবল"],
    },
    warranty: perProject,
    image: "/media/products/sungrow-sg110cx.webp",
    source: "https://www.vpsolar.com/download/catalog/Inverter/sungrow/SG110CX/Datasheet/Datasheet-Sungrow-SG110CX_EN.pdf",
  },
  {
    slug: "huawei-sun2000-10ktl-m1",
    category: "inverters",
    brand: "Huawei",
    name: "SUN2000-10KTL-M1",
    tagline: { en: "Battery-ready three-phase inverter for homes", bn: "বাসার জন্য ব্যাটারি-রেডি থ্রি-ফেজ ইনভার্টার" },
    description: {
      en: "Huawei's residential three-phase inverter with active arc-fault protection. Add a LUNA2000 battery later without changing the inverter.",
      bn: "অ্যাকটিভ আর্ক-ফল্ট প্রোটেকশনসহ হুয়াওয়ের আবাসিক থ্রি-ফেজ ইনভার্টার। পরে ইনভার্টার না বদলেই LUNA2000 ব্যাটারি যোগ করা যায়।",
    },
    keySpec: { en: "10 kW · battery-ready", bn: "১০ কিলোওয়াট · ব্যাটারি-রেডি" },
    specs: [
      spec("type", "Three-phase, battery-ready"),
      spec("ratedAc", "10,000 W (11,000 VA max)"),
      spec("maxPv", "15,000 Wp recommended"),
      spec("mppt", "2 × MPPT, 140–980 V, 13.5 A"),
      spec("battery", "LUNA2000 (600–980 V)"),
      spec("maxEff", "98.6%"),
      spec("size", "525 × 470 × 146.5 mm · 17 kg"),
    ],
    highlights: {
      en: ["AFCI active arcing protection", "Up to 30% more energy with optimisers", "Natural convection, no fans", "FusionSolar app monitoring"],
      bn: ["AFCI অ্যাকটিভ আর্কিং প্রোটেকশন", "অপটিমাইজারে ৩০% পর্যন্ত বেশি বিদ্যুৎ", "ফ্যানবিহীন প্রাকৃতিক কুলিং", "FusionSolar অ্যাপে মনিটরিং"],
    },
    features: huaweiFeatures,
    warranty: perProject,
    image: "/media/products/huawei-sun2000-10ktl-m1.webp",
    featured: true,
    source: "https://solar.huawei.com/download?p=%2F-%2Fmedia%2FSolar%2Fdatasheet%2FSUN2000-3_4_5_6_8_10KTL-M1_High_Current_Version.pdf",
  },
  {
    slug: "huawei-sun2000-100ktl-m2",
    category: "inverters",
    brand: "Huawei",
    name: "SUN2000-100KTL-M2",
    tagline: { en: "100 kW smart PV controller for C&I", bn: "বাণিজ্যিক প্রকল্পের জন্য ১০০ কিলোওয়াট স্মার্ট পিভি কন্ট্রোলার" },
    description: {
      en: "Ten MPPTs, string-level monitoring and smart I-V diagnosis make this Huawei's go-to inverter for factory rooftops and commercial plants.",
      bn: "১০টি MPPT, স্ট্রিং-লেভেল মনিটরিং ও স্মার্ট I-V ডায়াগনসিস — কারখানার ছাদ ও বাণিজ্যিক প্ল্যান্টের জন্য হুয়াওয়ের জনপ্রিয় ইনভার্টার।",
    },
    keySpec: { en: "100 kW · 10 MPPTs", bn: "১০০ কিলোওয়াট · ১০টি MPPT" },
    specs: [
      spec("type", "Three-phase on-grid string"),
      spec("ratedAc", "100 kW (110 kVA max)"),
      spec("mppt", "10 × MPPT, 200–1000 V, 30 A each"),
      spec("maxVdc", "1,100 V"),
      spec("maxEff", "98.6% @ 400 V"),
      spec("ip", "IP66"),
      spec("protections", "AFCI, DC/AC Type II SPD"),
      spec("size", "1035 × 700 × 365 mm · ≤ 93 kg"),
    ],
    highlights: {
      en: ["Smart string-level disconnector", "Smart I-V curve diagnosis", "MBUS power-line communication", "Smart air cooling"],
      bn: ["স্মার্ট স্ট্রিং-লেভেল ডিসকানেক্টর", "স্মার্ট I-V কার্ভ ডায়াগনসিস", "MBUS পাওয়ার-লাইন কমিউনিকেশন", "স্মার্ট এয়ার কুলিং"],
    },
    features: huaweiFeatures,
    warranty: perProject,
    image: "/media/products/huawei-sun2000-100ktl-m2.webp",
    source: "https://solar.huawei.com/admin/asset/v1/pro/view/c5056ea20b95424fad3c62f0a5e64a84.pdf",
  },
  {
    slug: "solis-s6-eh1p6k-l-plus",
    category: "inverters",
    brand: "Solis",
    name: "S6-EH1P6K-L-PLUS",
    tagline: { en: "Single-phase low-voltage hybrid inverter", bn: "সিঙ্গেল-ফেজ লো-ভোল্টেজ হাইব্রিড ইনভার্টার" },
    description: {
      en: "Built for unstable grids: it works with 48 V lithium or lead-acid batteries, switches to backup in under 10 ms and handles 200% overload for 10 s to start pumps and ACs.",
      bn: "অস্থির গ্রিডের জন্য তৈরি — ৪৮ ভোল্ট লিথিয়াম বা লেড-অ্যাসিড ব্যাটারির সাথে চলে, ১০ মিলিসেকেন্ডের কম সময়ে ব্যাকআপে যায় এবং পাম্প ও এসি চালু করতে ১০ সেকেন্ড ২০০% ওভারলোড সামলায়।",
    },
    keySpec: { en: "6 kW · single-phase hybrid", bn: "৬ কিলোওয়াট · সিঙ্গেল-ফেজ হাইব্রিড" },
    specs: [
      spec("type", "Single-phase hybrid, low-voltage battery"),
      spec("ratedAc", "6 kW"),
      spec("maxPv", "12 kW recommended array"),
      spec("mppt", "2 × MPPT, 90–435 V"),
      spec("battery", "Li-ion / lead-acid, 40–60 V, 135 A"),
      spec("backup", "< 10 ms"),
      spec("maxEff", "96.2%"),
      spec("ip", "IP66"),
    ],
    highlights: {
      en: ["Up to 6 units in parallel", "Generator input with auto control", "Works PV-only without a battery", "7-inch LCD, Wi-Fi + Bluetooth"],
      bn: ["৬টি পর্যন্ত ইউনিট প্যারালালে", "অটো কন্ট্রোলসহ জেনারেটর ইনপুট", "ব্যাটারি ছাড়াও শুধু সোলারে চলে", "৭-ইঞ্চি LCD, Wi-Fi + ব্লুটুথ"],
    },
    warranty: perProject,
    image: "/media/products/solis-s6-eh1p6k-l-plus.webp",
    source: "https://www.solisinverters.com/dataFile/402880ed936308610193ae4709df1171",
  },
  {
    slug: "solis-100k-5g",
    category: "inverters",
    brand: "Solis",
    name: "Solis-100K-5G",
    tagline: { en: "100 kW three-phase string inverter", bn: "১০০ কিলোওয়াট থ্রি-ফেজ স্ট্রিং ইনভার্টার" },
    description: {
      en: "A ten-MPPT commercial inverter with I-V curve scanning, anti-PID and fuse-free design, suited to large rooftops and multi-megawatt plants.",
      bn: "১০টি MPPT, I-V কার্ভ স্ক্যানিং, অ্যান্টি-PID ও ফিউজ-ফ্রি ডিজাইনসহ বাণিজ্যিক ইনভার্টার — বড় ছাদ ও মেগাওয়াট প্ল্যান্টের জন্য।",
    },
    keySpec: { en: "100 kW · 10 MPPTs", bn: "১০০ কিলোওয়াট · ১০টি MPPT" },
    specs: [
      spec("type", "Three-phase on-grid string"),
      spec("ratedAc", "100 kW (110 kVA max)"),
      spec("maxPv", "150 kW recommended"),
      spec("mppt", "10 × MPPT, 180–1000 V, 26 A each"),
      spec("maxEff", "98.7% (EU 98.3%)"),
      spec("ip", "IP66"),
      spec("size", "1099.5 × 567 × 344.5 mm · 84 kg"),
    ],
    highlights: {
      en: ["Smart I-V curve diagnosis", "Anti-PID function", "Type II DC/AC surge protection", "Intelligent redundant fan cooling"],
      bn: ["স্মার্ট I-V কার্ভ ডায়াগনসিস", "অ্যান্টি-PID ফাংশন", "টাইপ II ডিসি/এসি সার্জ প্রোটেকশন", "রিডান্ড্যান্ট ফ্যান কুলিং"],
    },
    warranty: perProject,
    image: "/media/products/solis-100k-5g.webp",
    source: "https://www.bangasolar.com/assets/datasheet/solis/Datasheet_Solis_100K-5G.pdf",
  },
  {
    slug: "goodwe-gw10k-et-20",
    category: "inverters",
    brand: "GoodWe",
    name: "ET G2 GW10K-ET-20",
    tagline: { en: "Three-phase high-voltage hybrid inverter", bn: "থ্রি-ফেজ হাই-ভোল্টেজ হাইব্রিড ইনভার্টার" },
    description: {
      en: "GoodWe's latest ET hybrid with UPS-level switching under 10 ms, AI-driven arc-fault detection and IP66 protection for outdoor walls.",
      bn: "গুডউইর সর্বশেষ ET হাইব্রিড — ১০ মিলিসেকেন্ডের কম UPS-লেভেল সুইচিং, AI-চালিত আর্ক-ফল্ট শনাক্তকরণ এবং বাইরের দেয়ালের জন্য IP66 প্রোটেকশন।",
    },
    keySpec: { en: "10 kW · 3-phase hybrid", bn: "১০ কিলোওয়াট · থ্রি-ফেজ হাইব্রিড" },
    specs: [
      spec("type", "Three-phase hybrid, high-voltage battery"),
      spec("ratedAc", "10,000 W"),
      spec("maxPv", "16,000 W"),
      spec("mppt", "120–850 V, 16 A per MPPT"),
      spec("battery", "Li-ion, 150–720 V, 40 A"),
      spec("backup", "< 10 ms"),
      spec("maxEff", "98.2%"),
      spec("ip", "IP66"),
      spec("size", "496 × 460 × 221 mm · 25 kg"),
    ],
    highlights: {
      en: ["UPS-level backup switching", "AI-driven AFCI", "Dry contact for external loads", "Remote shutdown built in"],
      bn: ["UPS-লেভেলের ব্যাকআপ সুইচিং", "AI-চালিত AFCI", "বাইরের লোডের জন্য ড্রাই কন্টাক্ট", "বিল্ট-ইন রিমোট শাটডাউন"],
    },
    warranty: perProject,
    image: "/media/products/goodwe-gw10k-et-20.webp",
    source: "https://en.goodwe.com/Ftp/EN/Downloads/Datasheet/GW_ET-G2_Datasheet-EN.pdf",
  },
  {
    slug: "goodwe-gw100k-gt",
    category: "inverters",
    brand: "GoodWe",
    name: "GT Series GW100K-GT",
    tagline: { en: "100 kW string inverter with string monitoring", bn: "স্ট্রিং মনিটরিংসহ ১০০ কিলোওয়াট স্ট্রিং ইনভার্টার" },
    description: {
      en: "A lightweight, high-density C&I inverter with 42 A per MPPT, ready for high-current modules and large factory roofs.",
      bn: "হালকা ও উচ্চ-ঘনত্বের বাণিজ্যিক ইনভার্টার — প্রতি MPPT-তে ৪২ অ্যাম্পিয়ার, উচ্চ-কারেন্টের মডিউল ও বড় কারখানার ছাদের জন্য প্রস্তুত।",
    },
    keySpec: { en: "100 kW · 98.8% max", bn: "১০০ কিলোওয়াট · সর্বোচ্চ ৯৮.৮%" },
    specs: [
      spec("type", "Three-phase on-grid string"),
      spec("ratedAc", "100 kW (110 kVA max)"),
      spec("mppt", "180–1000 V, 42 A per MPPT"),
      spec("maxVdc", "1,100 V"),
      spec("maxEff", "98.8% (Euro 98.4%)"),
      spec("ip", "IP66 (C5 optional)"),
      spec("size", "930 × 650 × 300 mm · 85 kg"),
    ],
    highlights: {
      en: ["String-level current monitoring", "Suits high-current bifacial modules", "Integrated DC switch", "OT/DT terminals up to 240 mm²"],
      bn: ["স্ট্রিং-লেভেল কারেন্ট মনিটরিং", "উচ্চ-কারেন্টের বাইফেসিয়াল মডিউলের উপযোগী", "বিল্ট-ইন ডিসি সুইচ", "২৪০ মিমি² পর্যন্ত OT/DT টার্মিনাল"],
    },
    warranty: perProject,
    image: "/media/products/goodwe-gw100k-gt.webp",
    source: "https://en.goodwe.com/Public/Uploads/uploadfile/files/20250609/GW_GT_Datasheet-EN.pdf",
  },
  {
    slug: "growatt-spf-6000-es-plus",
    category: "inverters",
    brand: "Growatt",
    name: "SPF 6000 ES Plus",
    tagline: { en: "Off-grid inverter with dual MPPT charger", bn: "ডুয়াল MPPT চার্জারসহ অফ-গ্রিড ইনভার্টার" },
    description: {
      en: "A popular 48 V off-grid inverter for homes and shops: two MPPT inputs, grid or solar priority, and up to six units in parallel as the load grows.",
      bn: "বাসা ও দোকানের জন্য জনপ্রিয় ৪৮ ভোল্ট অফ-গ্রিড ইনভার্টার — দুটি MPPT ইনপুট, গ্রিড বা সোলার অগ্রাধিকার, আর লোড বাড়লে ছয়টি পর্যন্ত ইউনিট প্যারালালে।",
    },
    keySpec: { en: "6 kW · 48 V off-grid", bn: "৬ কিলোওয়াট · ৪৮ ভোল্ট অফ-গ্রিড" },
    specs: [
      spec("type", "Single-phase off-grid"),
      spec("ratedAc", "6,000 VA / 6,000 W"),
      spec("maxPv", "8,000 W"),
      spec("mppt", "2 × MPPT, 120–450 V (500 V max)"),
      spec("battery", "48 V lithium / lead-acid"),
      spec("charge", "100 A solar · 80 A AC"),
      spec("maxEff", "93% (peak)"),
      spec("size", "460 × 395 × 132 mm · 13.5 kg"),
    ],
    highlights: {
      en: ["Up to 6 units in parallel", "10 ms transfer time", "Dust-proof filter", "Two AC inputs with transfer switch"],
      bn: ["৬টি পর্যন্ত ইউনিট প্যারালালে", "১০ মিলিসেকেন্ড ট্রান্সফার টাইম", "ধুলো-প্রতিরোধী ফিল্টার", "ট্রান্সফার সুইচসহ দুটি এসি ইনপুট"],
    },
    warranty: perProject,
    image: "/media/products/growatt-spf-6000-es-plus.webp",
    source: "https://sikosolar.com/wp-content/uploads/2023/02/SPF-6000-ES-Plus-datasheet.pdf",
  },
  {
    slug: "growatt-max-100ktl3-x-lv",
    category: "inverters",
    brand: "Growatt",
    name: "MAX 100KTL3-X LV",
    tagline: { en: "100 kW C&I string inverter", bn: "১০০ কিলোওয়াট বাণিজ্যিক স্ট্রিং ইনভার্টার" },
    description: {
      en: "Ten fuse-free MPPTs with smart I-V scanning and intelligent string monitoring, sealed to IP66 for dusty, humid sites.",
      bn: "স্মার্ট I-V স্ক্যান ও ইন্টেলিজেন্ট স্ট্রিং মনিটরিংসহ ১০টি ফিউজ-ফ্রি MPPT — ধুলো ও আর্দ্র সাইটের জন্য IP66 সিল করা।",
    },
    keySpec: { en: "100 kW · 10 MPPTs", bn: "১০০ কিলোওয়াট · ১০টি MPPT" },
    specs: [
      spec("type", "Three-phase on-grid string"),
      spec("ratedAc", "100 kW (110 kVA max)"),
      spec("mppt", "10 × MPPT, 180–1000 V, 32 A each"),
      spec("maxVdc", "1,100 V"),
      spec("maxEff", "98.8% (Euro 98.4%)"),
      spec("ip", "IP66"),
      spec("size", "970 × 640 × 345 mm · 84 kg"),
    ],
    highlights: {
      en: ["Fuse-free design", "Smart I/V scan and diagnosis", "AC & DC Type II SPD", "AFCI and anti-PID optional"],
      bn: ["ফিউজ-ফ্রি ডিজাইন", "স্মার্ট I/V স্ক্যান ও ডায়াগনসিস", "এসি ও ডিসি টাইপ II SPD", "AFCI ও অ্যান্টি-PID ঐচ্ছিক"],
    },
    warranty: perProject,
    image: "/media/products/growatt-max-100ktl3-x-lv.webp",
    source: "https://shop.erene.de/media/89/bf/bd/1701854681/data-sheet-MAX-100-125KTL3-X-LV-ENG.pdf",
  },
  {
    slug: "crown-xavier-6kw",
    category: "inverters",
    brand: "Crown",
    name: "Xavier 6KW",
    tagline: { en: "48 V solar inverter with 120 A MPPT", bn: "১২০ অ্যাম্পিয়ার MPPT-সহ ৪৮ ভোল্ট সোলার ইনভার্টার" },
    description: {
      en: "Crown's widely used 6 kW inverter for homes and small offices: pure sine wave, dual outputs for load management, and a battery-independent design.",
      bn: "বাসা ও ছোট অফিসের জন্য ক্রাউনের বহুল ব্যবহৃত ৬ কিলোওয়াট ইনভার্টার — পিওর সাইন ওয়েভ, লোড ম্যানেজমেন্টের জন্য ডুয়াল আউটপুট এবং ব্যাটারি ছাড়াও চলার ডিজাইন।",
    },
    keySpec: { en: "6 kW · 48 V", bn: "৬ কিলোওয়াট · ৪৮ ভোল্ট" },
    specs: [
      spec("type", "Single-phase solar inverter"),
      spec("ratedAc", "6,000 VA / 6,000 W"),
      spec("maxPv", "6,500 W"),
      spec("mppt", "60–450 V (500 V max)"),
      spec("battery", "48 V DC"),
      spec("charge", "120 A solar · 100 A AC"),
      spec("maxEff", "93% (peak)"),
      spec("size", "107 × 322.6 × 420.3 mm · 10.5 kg"),
    ],
    highlights: {
      en: ["12,000 VA surge power", "Dual outputs for smart load control", "Wi-Fi / RS-485 / CAN", "10–20 ms transfer time"],
      bn: ["১২,০০০ VA সার্জ পাওয়ার", "স্মার্ট লোড কন্ট্রোলের জন্য ডুয়াল আউটপুট", "Wi-Fi / RS-485 / CAN", "১০–২০ মিলিসেকেন্ড ট্রান্সফার টাইম"],
    },
    warranty: perProject,
    image: "/media/products/crown-xavier-6kw.webp",
    source: "https://crownmicroglobal.com/wp-content/uploads/2024/04/Xavier-4-6KW.pdf",
  },
  {
    slug: "crown-volmore-vmgi-20kw",
    category: "inverters",
    brand: "Crown",
    name: "Volmore VMGI-20KW",
    tagline: { en: "20 kW three-phase on-grid inverter", bn: "২০ কিলোওয়াট থ্রি-ফেজ অন-গ্রিড ইনভার্টার" },
    description: {
      en: "A compact three-phase grid-tie inverter for shops, offices and small factories, with anti-islanding, string fault detection and an IP66 enclosure.",
      bn: "দোকান, অফিস ও ছোট কারখানার জন্য কমপ্যাক্ট থ্রি-ফেজ গ্রিড-টাই ইনভার্টার — অ্যান্টি-আইল্যান্ডিং, স্ট্রিং ফল্ট শনাক্তকরণ ও IP66 এনক্লোজারসহ।",
    },
    keySpec: { en: "20 kW · 3-phase on-grid", bn: "২০ কিলোওয়াট · থ্রি-ফেজ অন-গ্রিড" },
    specs: [
      spec("type", "Three-phase on-grid"),
      spec("ratedAc", "20,000 W (22,000 VA max)"),
      spec("mppt", "2 × MPPT, 140–1000 V, 30 A each"),
      spec("maxVdc", "1,100 V"),
      spec("maxEff", "98.6% (Euro 98.3%)"),
      spec("ip", "IP66"),
      spec("size", "380 × 483 × 193 mm · 20.7 kg"),
    ],
    highlights: {
      en: ["DC Type II / AC Type III SPD", "String fault detection", "RS485 / Wi-Fi / 4G monitoring", "Transformer-less, fan cooled"],
      bn: ["ডিসি টাইপ II / এসি টাইপ III SPD", "স্ট্রিং ফল্ট শনাক্তকরণ", "RS485 / Wi-Fi / 4G মনিটরিং", "ট্রান্সফরমার-লেস, ফ্যান কুলিং"],
    },
    warranty: { en: "10-year warranty (manufacturer T&C)", bn: "১০ বছর ওয়ারেন্টি (প্রস্তুতকারকের শর্তে)" },
    image: "/media/products/crown-volmore-vmgi-20kw.webp",
    source: "https://crownmicroglobal.com/wp-content/uploads/2026/07/Crown-Catalogue-Web-2026.pdf",
  },
  {
    slug: "deye-sun-10k-sg04lp3-eu",
    category: "inverters",
    brand: "Deye",
    name: "SUN-10K-SG04LP3-EU",
    tagline: { en: "Three-phase hybrid for 48 V batteries", bn: "৪৮ ভোল্ট ব্যাটারির জন্য থ্রি-ফেজ হাইব্রিড" },
    description: {
      en: "Deye's three-phase low-voltage hybrid runs lead-acid or lithium batteries, stores energy from a diesel generator and scales to ten units in parallel.",
      bn: "ডেয়ের থ্রি-ফেজ লো-ভোল্টেজ হাইব্রিড লেড-অ্যাসিড বা লিথিয়াম ব্যাটারিতে চলে, ডিজেল জেনারেটর থেকেও চার্জ নেয় এবং ১০টি পর্যন্ত ইউনিট প্যারালালে বাড়ানো যায়।",
    },
    keySpec: { en: "10 kW · 3-phase hybrid", bn: "১০ কিলোওয়াট · থ্রি-ফেজ হাইব্রিড" },
    specs: [
      spec("type", "Three-phase hybrid, low-voltage battery"),
      spec("ratedAc", "10,000 W (11,000 W max)"),
      spec("maxPv", "13,000 W"),
      spec("mppt", "2 × MPPT, 200–650 V"),
      spec("battery", "Lead-acid or Li-ion, 40–60 V"),
      spec("ip", "IP65"),
      spec("size", "422 × 699.3 × 279 mm"),
    ],
    highlights: {
      en: ["100% unbalanced output per phase", "Up to 10 units in parallel", "Generator charging support", "Six charge/discharge time slots"],
      bn: ["প্রতি ফেজে ১০০% আনব্যালান্সড আউটপুট", "১০টি পর্যন্ত ইউনিট প্যারালালে", "জেনারেটর থেকে চার্জিং সাপোর্ট", "ছয়টি চার্জ/ডিসচার্জ টাইম স্লট"],
    },
    warranty: { en: "5-year manufacturer warranty", bn: "৫ বছর প্রস্তুতকারকের ওয়ারেন্টি" },
    image: "/media/products/deye-sun-10k-sg04lp3-eu.webp",
    featured: true,
    source: "https://www.deyeinverter.com/deyeinverter/2025/05/16/datasheet_sun-5-12k-sg04lp3.pdf",
  },
  {
    slug: "deye-sun-50k-g03",
    category: "inverters",
    brand: "Deye",
    name: "SUN-50K-G03",
    tagline: { en: "50 kW three-phase string inverter", bn: "৫০ কিলোওয়াট থ্রি-ফেজ স্ট্রিং ইনভার্টার" },
    description: {
      en: "A four-MPPT grid-tie inverter for mid-size commercial rooftops, with zero-export control for sites without net metering.",
      bn: "মাঝারি আকারের বাণিজ্যিক ছাদের জন্য ৪-MPPT গ্রিড-টাই ইনভার্টার — নেট মিটারিং নেই এমন সাইটে জিরো-এক্সপোর্ট কন্ট্রোলসহ।",
    },
    keySpec: { en: "50 kW · 4 MPPTs", bn: "৫০ কিলোওয়াট · ৪টি MPPT" },
    specs: [
      spec("type", "Three-phase on-grid string"),
      spec("ratedAc", "50 kW (55 kW max)"),
      spec("maxPv", "65 kW"),
      spec("mppt", "4 × MPPT, 200–850 V"),
      spec("maxVdc", "1,000 V"),
      spec("maxEff", "98.7% (Euro 98%)"),
      spec("ip", "IP65"),
      spec("size", "647.5 × 537 × 303.5 mm · 44.5 kg"),
    ],
    highlights: {
      en: ["Zero-export application", "Type II DC/AC SPD", "Anti-PID (optional)", "Designed lifetime over 20 years"],
      bn: ["জিরো-এক্সপোর্ট অ্যাপ্লিকেশন", "টাইপ II ডিসি/এসি SPD", "অ্যান্টি-PID (ঐচ্ছিক)", "২০ বছরের বেশি ডিজাইন লাইফ"],
    },
    warranty: perProject,
    image: "/media/products/deye-sun-50k-g03.webp",
    source: "https://www.deyeinverter.com/deyeinverter/2021/03/22/%E3%80%90b%E3%80%91threephasesun-30-33-35-40-45-50k-g03-1.pdf",
  },

  /* ============================ ENERGY STORAGE ========================== */
  {
    slug: "lead-acid-solar-battery",
    category: "storage",
    name: "Lead-Acid Solar Battery",
    tagline: { en: "Reliable, cost-effective backup solution", bn: "নির্ভরযোগ্য ও সাশ্রয়ী ব্যাকআপ সমাধান" },
    description: {
      en: "A proven battery technology for solar backup and off-grid systems where a lower initial cost is important. OSLEOS batteries can be configured for 12V, 24V, 48V, and other system voltage requirements.",
      bn: "সোলার ব্যাকআপ ও অফ-গ্রিড সিস্টেমের জন্য পরীক্ষিত ব্যাটারি প্রযুক্তি, যেখানে প্রাথমিক খরচ কম রাখা জরুরি। OSLEOS ব্যাটারি ১২, ২৪, ৪৮ ভোল্টসহ প্রয়োজনীয় অন্যান্য সিস্টেম ভোল্টেজের জন্য কনফিগার করা যায়।",
    },
    keySpec: { en: "12V / 24V / 48V Systems", bn: "১২ভি / ২৪ভি / ৪৮ভি সিস্টেম" },
    specs: [
      spec("capacity", "Various Ah / kWh ratings"),
      spec("systemV", "12 V, 24 V, 48 V and more"),
      spec("chemistry", "Tubular, GEL, AGM"),
      spec("application", "Basic to moderate backup"),
    ],
    highlights: {
      en: ["Lower initial cost", "Widely used and easy to service", "Available in multiple capacities", "Compatible with most solar inverters"],
      bn: ["কম প্রাথমিক খরচ", "বহুল ব্যবহৃত, সার্ভিস সহজ", "অনেক ক্যাপাসিটিতে পাওয়া যায়", "বেশিরভাগ সোলার ইনভার্টারের সাথে চলে"],
    },
    warranty: perProject,
    image: "/media/products/battery-leadacid.webp",
  },
  {
    slug: "lifepo4-wall-battery",
    category: "storage",
    name: "LiFePO₄ Lithium Wall Battery",
    tagline: { en: "Long-life lithium storage for homes and offices", bn: "বাসা ও অফিসের জন্য দীর্ঘস্থায়ী লিথিয়াম স্টোরেজ" },
    description: {
      en: "Modular lithium iron phosphate storage with high usable capacity and far longer cycle life than lead-acid. We confirm inverter and BMS compatibility before supply.",
      bn: "মডুলার লিথিয়াম আয়রন ফসফেট স্টোরেজ — বেশি ব্যবহারযোগ্য ক্যাপাসিটি এবং লেড-অ্যাসিডের চেয়ে অনেক বেশি সাইকেল লাইফ। সরবরাহের আগে ইনভার্টার ও BMS কম্প্যাটিবিলিটি নিশ্চিত করি।",
    },
    keySpec: { en: "Modular · high cycle life", bn: "মডুলার · দীর্ঘ সাইকেল লাইফ" },
    specs: [
      spec("capacity", "Modular, scalable"),
      spec("systemV", "Low- and high-voltage options"),
      spec("chemistry", "LiFePO₄ with BMS"),
      spec("application", "Hybrid and off-grid systems"),
    ],
    highlights: {
      en: ["Long cycle life", "High usable capacity", "Lower weight than lead-acid", "Little to no maintenance"],
      bn: ["দীর্ঘ সাইকেল লাইফ", "বেশি ব্যবহারযোগ্য ক্যাপাসিটি", "লেড-অ্যাসিডের চেয়ে হালকা", "প্রায় রক্ষণাবেক্ষণহীন"],
    },
    warranty: perProject,
    image: "/media/products/battery-lifepo4.webp",
  },
  {
    slug: "ci-battery-storage-system",
    category: "storage",
    name: "C&I Battery Energy Storage System",
    tagline: { en: "Rack-mounted storage for business continuity", bn: "ব্যবসা সচল রাখতে র‍্যাক-মাউন্টেড স্টোরেজ" },
    description: {
      en: "Large-capacity storage for commercial, industrial and high-demand sites that need extended backup, energy management or integration with solar generation.",
      bn: "বাণিজ্যিক, শিল্প ও বেশি চাহিদার সাইটের জন্য বড় ক্যাপাসিটির স্টোরেজ — দীর্ঘ ব্যাকআপ, এনার্জি ম্যানেজমেন্ট বা সোলারের সাথে সমন্বয়ের জন্য।",
    },
    keySpec: { en: "Scalable to project size", bn: "প্রকল্প অনুযায়ী স্কেলযোগ্য" },
    specs: [
      spec("capacity", "Small commercial to utility scale"),
      spec("systemV", "Configured per project"),
      spec("chemistry", "Lithium or other suitable"),
      spec("application", "High loads, extended backup"),
    ],
    highlights: {
      en: ["Supports large electrical loads", "Scales with your project", "Integrates with solar generation", "Keeps operations running"],
      bn: ["বড় বৈদ্যুতিক লোড সাপোর্ট", "প্রকল্পের সাথে বাড়ানো যায়", "সোলারের সাথে সমন্বিত", "কার্যক্রম সচল রাখে"],
    },
    warranty: perProject,
    image: "/media/products/battery-rack.webp",
  },

  {
    slug: "huawei-luna2000-5-15-s0",
    category: "storage",
    brand: "Huawei",
    name: "LUNA2000-5/10/15-S0 Smart Energy Storage System",
    tagline: { en: "Modular lithium storage for Huawei inverters", bn: "হুয়াওয়ে ইনভার্টারের জন্য মডুলার লিথিয়াম স্টোরেজ" },
    description: {
      en: "Huawei's modular LiFePO₄ battery with an energy optimiser in every 5 kWh module, so each module charges and discharges on its own. Start at 5 kWh and scale up to 30 kWh using multiple battery modules with compatible SUN2000 inverters.",
      bn: "হুয়াওয়ের মডুলার LiFePO₄ ব্যাটারি — প্রতিটি ৫ কিলোওয়াট-ঘণ্টা মডিউলে আলাদা এনার্জি অপটিমাইজার, তাই প্রতিটি মডিউল নিজে নিজে চার্জ ও ডিসচার্জ হয়। ৫ কিলোওয়াট-ঘণ্টা দিয়ে শুরু করে SUN2000 ইনভার্টারের সাথে ৩০ কিলোওয়াট-ঘণ্টা পর্যন্ত বাড়ানো যায়।",
    },
    keySpec: { en: "5–30 kWh · LiFePO₄", bn: "৫–৩০ কিলোওয়াট-ঘণ্টা · LiFePO₄" },
    specs: [
      spec("capacity", "5 kWh per module · 5–15 kWh per pack · up to 30 kWh"),
      spec("chemistry", "LiFePO₄ (LFP)"),
      spec("application", "Huawei SUN2000 hybrid inverters"),
      spec("ip", "IP66 · natural cooling"),
      spec("size", "670 × 150 × 600 mm · 63.8 kg (5 kWh)"),
    ],
    highlights: {
      en: ["Each 5 kWh module optimised separately", "100% depth of discharge", "Five-layer safety protection", "Scales from 5 to 30 kWh"],
      bn: ["প্রতিটি ৫ কিলোওয়াট-ঘণ্টা মডিউল আলাদাভাবে অপটিমাইজড", "১০০% ডেপথ অব ডিসচার্জ", "পাঁচ স্তরের নিরাপত্তা সুরক্ষা", "৫ থেকে ৩০ কিলোওয়াট-ঘণ্টা পর্যন্ত বাড়ানো যায়"],
    },
    features: huaweiFeatures,
    warranty: { en: "10 years (subject to Huawei warranty terms)", bn: "১০ বছর (হুয়াওয়ের ওয়ারেন্টি শর্ত সাপেক্ষে)" },
    image: "/media/products/huawei-luna2000-5-15-s0.webp",
    source: "https://solar.huawei.com/en/products/luna2000-5-10-15-s0/specs/",
  },
  /* ========================== CHARGE CONTROLLERS ======================== */
  {
    slug: "mppt-charge-controller",
    category: "controllers",
    name: "MPPT Solar Charge Controller",
    tagline: { en: "Harvests more solar energy in changing weather conditions", bn: "বদলানো আবহাওয়ায় বেশি সোলার বিদ্যুৎ সংগ্রহ" },
    description: {
      en: "Advanced OSLEOS MPPT technology tracks the maximum power point of solar panels to capture more energy and improve charging performance. A strong choice for Bangladesh's heat, humidity, monsoon clouds, and load-shedding conditions.",
      bn: "উন্নত OSLEOS MPPT প্রযুক্তি প্যানেলের সর্বোচ্চ পাওয়ার পয়েন্ট ট্র্যাক করে বেশি বিদ্যুৎ সংগ্রহ করে এবং চার্জিং কার্যক্ষমতা বাড়ায় — বাংলাদেশের গরম, আর্দ্রতা, বর্ষার মেঘ ও লোডশেডিংয়ের জন্য ভালো পছন্দ।",
    },
    keySpec: { en: "10–60 A · 12/24/48 V", bn: "১০–৬০ অ্যাম্পিয়ার · ১২/২৪/৪৮ ভোল্ট" },
    specs: [
      spec("current", "10A / 20A / 30A / 40A / 60A"),
      spec("systemV", "12V / 24V / 48V DC systems"),
      spec("chemistry", "Lead-acid (Tubular, GEL, AGM) and LiFePO₄ batteries"),
      spec("application", "Residential, commercial, telecom"),
    ],
    highlights: {
      en: ["Higher efficiency than PWM", "Better battery charging", "Suitable for larger solar systems", "Protects against overcharging and deep discharge"],
      bn: ["PWM-এর চেয়ে বেশি দক্ষ", "ভালো ব্যাটারি চার্জিং", "বড় সিস্টেমের উপযোগী", "ওভারচার্জ ও ডিপ ডিসচার্জ থেকে সুরক্ষা"],
    },
    warranty: perProject,
    image: "/media/products/cc-mppt.webp",
  },
  {
    slug: "pwm-charge-controller",
    category: "controllers",
    name: "PWM Solar Charge Controller",
    tagline: { en: "Simple, affordable control for small solar systems", bn: "ছোট সোলার সিস্টেমের জন্য সহজ ও সাশ্রয়ী কন্ট্রোল" },
    description: {
      en: "A simple and reliable controller widely used in small solar home systems for lighting, fans, and entry-level backup applications.",
      bn: "ছোট সোলার হোম সিস্টেমে বাতি, ফ্যান ও প্রাথমিক ব্যাকআপের জন্য বহুল ব্যবহৃত সহজ ও নির্ভরযোগ্য কন্ট্রোলার।",
    },
    keySpec: { en: "12V / 24V Systems", bn: "১২ / ২৪ ভোল্ট সিস্টেম" },
    specs: [
      spec("current", "10A / 20A / 30A"),
      spec("systemV", "12V / 24V"),
      spec("chemistry", "Lead-acid (GEL, AGM, Tubular)"),
      spec("application", "Homes, shops, and solar lighting systems"),
    ],
    highlights: {
      en: ["Cost-effective", "Easy to use", "USB outputs on many models", "Extends battery life"],
      bn: ["সাশ্রয়ী", "ব্যবহার সহজ", "অনেক মডেলে USB আউটপুট", "ব্যাটারির আয়ু বাড়ায়"],
    },
    warranty: perProject,
    image: "/media/products/cc-pwm.webp",
  },
  {
    slug: "smart-hybrid-charge-controller",
    category: "controllers",
    name: "Smart Hybrid Charge Controller",
    tagline: { en: "Intelligent charging with display and monitoring", bn: "ডিসপ্লে ও মনিটরিংসহ স্মার্ট চার্জিং" },
    description: {
      en: "Intelligent charging profiles, a clear display, and monitoring features for offices, remote sites, and hybrid setups with multiple battery types.",
      bn: "স্মার্ট চার্জিং প্রোফাইল, পরিষ্কার ডিসপ্লে ও মনিটরিং — অফিস, দূরবর্তী সাইট এবং বিভিন্ন ব্যাটারির হাইব্রিড সেটআপের জন্য।",
    },
    keySpec: { en: "Multi-battery support", bn: "একাধিক ব্যাটারি সাপোর্ট" },
    specs: [
      spec("current", "20–60 A"),
      spec("systemV", "12 V / 24 V / 48 V"),
      spec("chemistry", "Lead-acid, GEL, AGM, LiFePO₄"),
      spec("application", "Offices, remote and hybrid sites"),
    ],
    highlights: {
      en: ["Smart monitoring", "Better control", "Flexible operation", "Selectable battery profiles"],
      bn: ["স্মার্ট মনিটরিং", "ভালো নিয়ন্ত্রণ", "নমনীয় অপারেশন", "ব্যাটারি প্রোফাইল নির্বাচন"],
    },
    warranty: perProject,
    image: "/media/products/cc-smart.webp",
  },
  {
    slug: "solar-street-light-controller",
    category: "controllers",
    name: "Solar Street Light Controller",
    tagline: { en: "Automatic dusk-to-dawn lighting control", bn: "স্বয়ংক্রিয় সন্ধ্যা-থেকে-ভোর আলো নিয়ন্ত্রণ" },
    description: {
      en: "Switches street, garden and security lights on at dusk and off at dawn, with battery protection and load management.",
      bn: "সন্ধ্যায় রাস্তা, বাগান ও নিরাপত্তা বাতি জ্বালায় এবং ভোরে নেভায় — ব্যাটারি সুরক্ষা ও লোড ম্যানেজমেন্টসহ।",
    },
    keySpec: { en: "PV · battery · load", bn: "পিভি · ব্যাটারি · লোড" },
    specs: [
      spec("systemV", "12 V / 24 V"),
      spec("application", "Street, pathway and security lights"),
      spec("protections", "Battery over-charge / over-discharge"),
    ],
    highlights: {
      en: ["Automatic operation", "Reliable lighting control", "Built for outdoor use", "Protects the battery"],
      bn: ["স্বয়ংক্রিয় অপারেশন", "নির্ভরযোগ্য আলো নিয়ন্ত্রণ", "বাইরের ব্যবহারের জন্য তৈরি", "ব্যাটারি সুরক্ষা"],
    },
    warranty: perProject,
    image: "/media/products/cc-street.webp",
  },

  /* ========================= VOLTAGE STABILIZERS ======================== */
  {
    slug: "chint-tnd1-svc-stabilizer",
    category: "stabilizers",
    brand: "CHINT",
    name: "TND1 (SVC) Single-Phase Voltage Regulator",
    tagline: { en: "Servo stabilizer for homes and small businesses", bn: "বাসা ও ছোট ব্যবসার জন্য সার্ভো স্ট্যাবিলাইজার" },
    description: {
      en: "A servo-motor stabilizer that holds output at 220 V ±4% while the grid swings between 160 and 250 V, protecting inverters and appliances.",
      bn: "সার্ভো-মোটর স্ট্যাবিলাইজার — গ্রিড ১৬০ থেকে ২৫০ ভোল্টের মধ্যে ওঠানামা করলেও আউটপুট ২২০ ভোল্ট ±৪% ধরে রাখে, ইনভার্টার ও যন্ত্রপাতি সুরক্ষিত রাখে।",
    },
    keySpec: { en: "0.5–30 kVA · 220 V ±4%", bn: "০.৫–৩০ kVA · ২২০ ভোল্ট ±৪%" },
    specs: [
      spec("capacity", "0.5–30 kVA"),
      spec("input", "160–250 V"),
      spec("output", "220 V ±4%"),
      spec("protections", "Over-voltage 246 V, under-voltage 180 V"),
      spec("type", "Servo motor, single-phase"),
    ],
    highlights: {
      en: ["Output waveform distortion ≤ 1%", "Compact and light", "Low power loss", "Over/under-voltage cut-off"],
      bn: ["আউটপুট ওয়েভফর্ম ডিস্টরশন ≤ ১%", "কমপ্যাক্ট ও হালকা", "কম পাওয়ার লস", "ওভার/আন্ডার-ভোল্টেজ কাট-অফ"],
    },
    warranty: perProject,
    image: "/media/products/chint-tnd1-svc-stabilizer.webp",
    source: "https://www.chintglobal.com/global/en/products/low-voltage/iec/secondary-power-distribution/tns1.html",
  },
  {
    slug: "zhengxi-svc-servo-stabilizer",
    category: "stabilizers",
    brand: "Zhengxi",
    name: "SVC Servo Voltage Stabilizer",
    tagline: { en: "Wide-input stabilizer for weak rural grids", bn: "দুর্বল গ্রামীণ গ্রিডের জন্য ওয়াইড-ইনপুট স্ট্যাবিলাইজার" },
    description: {
      en: "Handles very low grid voltage, down to 80 V, and still delivers a steady 220 V, which suits rural homes, clinics and small businesses.",
      bn: "গ্রিডের ভোল্টেজ ৮০ ভোল্ট পর্যন্ত নেমে গেলেও স্থির ২২০ ভোল্ট দেয় — গ্রামের বাসা, ক্লিনিক ও ছোট ব্যবসার জন্য উপযোগী।",
    },
    keySpec: { en: "1–5 kVA · 80–260 V input", bn: "১–৫ kVA · ৮০–২৬০ ভোল্ট ইনপুট" },
    specs: [
      spec("capacity", "1–5 kVA"),
      spec("input", "80–260 V"),
      spec("output", "220 V ±2–3%"),
      spec("protections", "Over/under-voltage, overload, over-temperature, short circuit"),
      spec("type", "Servo motor, single-phase"),
    ],
    highlights: {
      en: ["Very wide input range", "Tight output regulation", "Full protection suite", "Wall-mount or floor-standing"],
      bn: ["খুব বিস্তৃত ইনপুট রেঞ্জ", "নিখুঁত আউটপুট নিয়ন্ত্রণ", "সম্পূর্ণ প্রোটেকশন", "দেয়ালে বা মেঝেতে বসানো যায়"],
    },
    warranty: perProject,
    image: "/media/products/zhengxi-svc-servo-stabilizer.webp",
    source: "https://www.zx-ele.com/servo-voltage-stabilizers/",
  },
  {
    slug: "delixi-sbw-three-phase-stabilizer",
    category: "stabilizers",
    brand: "Delixi Electric",
    name: "SBW Three-Phase Compensated Voltage Stabilizer",
    tagline: { en: "High-power stabilizer for factories and solar plants", bn: "কারখানা ও সোলার প্ল্যান্টের জন্য হাই-পাওয়ার স্ট্যাবিলাইজার" },
    description: {
      en: "A compensation-type stabilizer for industrial loads and rural solar installations, with no waveform distortion and protection against over-voltage, phase loss and wrong phase order.",
      bn: "শিল্প লোড ও গ্রামীণ সোলার ইনস্টলেশনের জন্য কম্পেনসেশন-টাইপ স্ট্যাবিলাইজার — ওয়েভফর্ম বিকৃতি নেই, ওভার-ভোল্টেজ, ফেজ লস ও ভুল ফেজ-ক্রম থেকে সুরক্ষা।",
    },
    keySpec: { en: "10–2,000 kVA · 3-phase", bn: "১০–২,০০০ kVA · থ্রি-ফেজ" },
    specs: [
      spec("capacity", "10–2,000 kVA"),
      spec("type", "Column-type voltage regulator + compensation transformer"),
      spec("protections", "Over-voltage, phase loss, phase order, fault"),
      spec("application", "Factories, cold storage, solar plants"),
    ],
    highlights: {
      en: ["Large capacity, high efficiency", "No waveform distortion", "Handles instantaneous overload", "Manual / auto switch-over"],
      bn: ["বড় ক্যাপাসিটি, উচ্চ দক্ষতা", "ওয়েভফর্মে কোনো বিকৃতি নেই", "তাৎক্ষণিক ওভারলোড সামলায়", "ম্যানুয়াল / অটো সুইচ-ওভার"],
    },
    warranty: perProject,
    image: "/media/products/delixi-sbw-three-phase-stabilizer.webp",
    source: "https://www.delixielc.com/power-management/voltage-stabilizer/3-phase-voltage-stabilizer.html",
  },
  {
    slug: "sako-svc-5000va-stabilizer",
    category: "stabilizers",
    brand: "SAKO",
    name: "SVC-5000VA Servo Voltage Stabilizer",
    tagline: { en: "Servo stabilizer for homes, shops and offices", bn: "বাসা, দোকান ও অফিসের জন্য সার্ভো স্ট্যাবিলাইজার" },
    description: {
      en: "A single-phase servo-motor stabilizer that keeps output at 220 V ±3% while the grid moves between 150 and 250 V, protecting ACs, fridges, pumps and solar inverters.",
      bn: "সিঙ্গেল-ফেজ সার্ভো-মোটর স্ট্যাবিলাইজার — গ্রিড ১৫০ থেকে ২৫০ ভোল্টের মধ্যে ওঠানামা করলেও আউটপুট ২২০ ভোল্ট ±৩% রাখে; এসি, ফ্রিজ, পাম্প ও সোলার ইনভার্টার সুরক্ষিত রাখে।",
    },
    keySpec: { en: "5 kVA · 220 V ±3%", bn: "৫ kVA · ২২০ ভোল্ট ±৩%" },
    specs: [
      spec("capacity", "5,000 VA"),
      spec("input", "150–250 V"),
      spec("output", "220 V ±3%"),
      spec("protections", "Over- and under-voltage"),
      spec("type", "Servo motor, single-phase"),
    ],
    highlights: {
      en: ["Servo-controlled, smooth regulation", "Meter display", "Quiet operation (≤ 50 dB)", "50 / 60 Hz"],
      bn: ["সার্ভো নিয়ন্ত্রিত, মসৃণ রেগুলেশন", "মিটার ডিসপ্লে", "নিঃশব্দ অপারেশন (≤ ৫০ dB)", "৫০ / ৬০ হার্জ"],
    },
    warranty: perProject,
    image: "/media/products/sako-svc-5000va-stabilizer.webp",
    source: "https://sakobd.com/product/sako-svc-5000va-voltage-stabilizer/",
  },
  {
    slug: "sako-sbw-150kva-stabilizer",
    category: "stabilizers",
    brand: "SAKO",
    name: "SBW-150kVA Three-Phase Voltage Stabilizer",
    tagline: { en: "Industrial stabilizer for factories and large buildings", bn: "কারখানা ও বড় ভবনের জন্য ইন্ডাস্ট্রিয়াল স্ট্যাবিলাইজার" },
    description: {
      en: "A servo-controlled three-phase stabilizer for production lines, machinery and commercial buildings, holding 380/400/415 V ±3% with overload and bypass protection.",
      bn: "প্রোডাকশন লাইন, মেশিনারি ও বাণিজ্যিক ভবনের জন্য সার্ভো-নিয়ন্ত্রিত থ্রি-ফেজ স্ট্যাবিলাইজার — ওভারলোড ও বাইপাস সুরক্ষাসহ ৩৮০/৪০০/৪১৫ ভোল্ট ±৩% ধরে রাখে।",
    },
    keySpec: { en: "150 kVA · 3-phase · >95%", bn: "১৫০ kVA · থ্রি-ফেজ · >৯৫%" },
    specs: [
      spec("capacity", "150 kVA (120 kW)"),
      spec("input", "304–456 V, 3-phase"),
      spec("output", "380 / 400 / 415 V ±3%"),
      spec("maxEff", "> 95%"),
      spec("protections", "Over/under-voltage, overload, manual/auto bypass (optional)"),
      spec("type", "Servo motor, three-phase"),
    ],
    highlights: {
      en: ["High accuracy for industrial loads", "Efficiency above 95%", "Overload protection", "Optional auto bypass"],
      bn: ["শিল্প লোডের জন্য উচ্চ নির্ভুলতা", "৯৫%-এর বেশি দক্ষতা", "ওভারলোড সুরক্ষা", "ঐচ্ছিক অটো বাইপাস"],
    },
    warranty: perProject,
    image: "/media/products/sako-sbw-150kva-stabilizer.webp",
    source: "https://sakoregulator.com/product/sako-sbw-150kva-avr/",
  },
  {
    slug: "cnc-svc-n-wall-mounted-stabilizer",
    category: "stabilizers",
    brand: "CNC Electric",
    name: "SVC-N Single-Phase Wall-Mounted Voltage Stabilizer",
    tagline: { en: "Wide-input stabilizer with digital display", bn: "ডিজিটাল ডিসপ্লেসহ ওয়াইড-ইনপুট স্ট্যাবিলাইজার" },
    description: {
      en: "A wall-mounted stabilizer that accepts 100–260 V and delivers 220 V ±3%, with a digital display of input, output and load, suited to homes and offices with weak or unstable supply.",
      bn: "দেয়ালে বসানো স্ট্যাবিলাইজার — ১০০–২৬০ ভোল্ট ইনপুট নিয়ে ২২০ ভোল্ট ±৩% দেয়; ইনপুট, আউটপুট ও লোডের ডিজিটাল ডিসপ্লেসহ, দুর্বল বা অস্থির লাইনের বাসা ও অফিসের জন্য উপযোগী।",
    },
    keySpec: { en: "0.5–30 kVA · 100–260 V input", bn: "০.৫–৩০ kVA · ১০০–২৬০ ভোল্ট ইনপুট" },
    specs: [
      spec("capacity", "0.5–30 kVA"),
      spec("input", "100–260 V"),
      spec("output", "220 V ±3%"),
      spec("maxEff", "98%"),
      spec("protections", "Over/under-voltage, overload, over-current, over-temperature, short circuit"),
      spec("type", "Single-phase, wall-mounted"),
    ],
    highlights: {
      en: ["Very wide 100–260 V input", "Digital voltage and load display", "Response under 1 s", "Full protection suite"],
      bn: ["খুব বিস্তৃত ১০০–২৬০ ভোল্ট ইনপুট", "ডিজিটাল ভোল্টেজ ও লোড ডিসপ্লে", "১ সেকেন্ডের কম রেসপন্স", "সম্পূর্ণ প্রোটেকশন"],
    },
    warranty: perProject,
    image: "/media/products/cnc-svc-n-wall-mounted-stabilizer.webp",
    source: "https://www.cncele.com/svc-n-single-phase-wall-mounted-voltage-stabilizer-product/",
  },
  {
    slug: "cnc-svc-three-phase-stabilizer",
    category: "stabilizers",
    brand: "CNC Electric",
    name: "SVC Three-Phase High-Accuracy Voltage Stabilizer",
    tagline: { en: "Balanced three-phase supply for machines and buildings", bn: "মেশিন ও ভবনের জন্য ব্যালান্সড থ্রি-ফেজ সাপ্লাই" },
    description: {
      en: "A servo stabilizer that regulates each phase separately to hold 380 V ±3%, for workshops, factories, lifts, pumps and commercial buildings.",
      bn: "প্রতিটি ফেজ আলাদাভাবে নিয়ন্ত্রণ করে ৩৮০ ভোল্ট ±৩% ধরে রাখা সার্ভো স্ট্যাবিলাইজার — ওয়ার্কশপ, কারখানা, লিফট, পাম্প ও বাণিজ্যিক ভবনের জন্য।",
    },
    keySpec: { en: "1.5–100 kVA · 3-phase", bn: "১.৫–১০০ kVA · থ্রি-ফেজ" },
    specs: [
      spec("capacity", "1.5–100 kVA"),
      spec("input", "280–430 V, 3-phase"),
      spec("output", "380 V ±3%"),
      spec("maxEff", "≥ 90%"),
      spec("protections", "Over-voltage, over-current"),
      spec("type", "Servo motor, per-phase regulation"),
    ],
    highlights: {
      en: ["Each phase regulated separately", "No waveform distortion", "Response ≤ 1 s", "3-phase 4-wire or 3-wire"],
      bn: ["প্রতিটি ফেজ আলাদাভাবে নিয়ন্ত্রিত", "ওয়েভফর্মে কোনো বিকৃতি নেই", "রেসপন্স ≤ ১ সেকেন্ড", "থ্রি-ফেজ ফোর-ওয়্যার বা থ্রি-ওয়্যার"],
    },
    warranty: perProject,
    image: "/media/products/cnc-svc-three-phase-stabilizer.webp",
    source: "https://www.cncele.com/svc-three-phase-high-accuracy-automatic-ac-voltage-stabilizer-product/",
  },
  {
    slug: "tengen-tnd-single-phase-stabilizer",
    category: "stabilizers",
    brand: "Tengen",
    name: "TND Single-Phase Automatic Voltage Stabilizer",
    tagline: { en: "Servo stabilizer for homes and small businesses", bn: "বাসা ও ছোট ব্যবসার জন্য সার্ভো স্ট্যাবিলাইজার" },
    description: {
      en: "A servo-driven contact regulator that holds 220 V ±3% from a 160–250 V supply and cuts the output on over-voltage or short circuit to protect equipment.",
      bn: "সার্ভো-চালিত কন্টাক্ট রেগুলেটর — ১৬০–২৫০ ভোল্ট সাপ্লাই থেকে ২২০ ভোল্ট ±৩% ধরে রাখে এবং ওভার-ভোল্টেজ বা শর্ট সার্কিটে আউটপুট বন্ধ করে যন্ত্রপাতি সুরক্ষিত রাখে।",
    },
    keySpec: { en: "0.5–30 kVA · 220 V ±3%", bn: "০.৫–৩০ kVA · ২২০ ভোল্ট ±৩%" },
    specs: [
      spec("capacity", "0.5–30 kVA"),
      spec("input", "160–250 V"),
      spec("output", "220 V ±3%"),
      spec("maxEff", "> 90%"),
      spec("protections", "Output over-voltage (246 ±4 V), short circuit"),
      spec("type", "Servo motor, single-phase"),
    ],
    highlights: {
      en: ["Good output waveform", "Regulates faster than 10 V per second", "High load adaptability", "Automatic output cut-off on faults"],
      bn: ["ভালো আউটপুট ওয়েভফর্ম", "প্রতি সেকেন্ডে ১০ ভোল্টের বেশি গতিতে নিয়ন্ত্রণ", "উচ্চ লোড সহনশীলতা", "ত্রুটিতে স্বয়ংক্রিয় আউটপুট বন্ধ"],
    },
    warranty: perProject,
    image: "/media/products/tengen-tnd-single-phase-stabilizer.webp",
    source: "https://www.tengenglobal.com/public/uploads/uxupload/handbook/Voltage%20stabilizer%20TND%20TNS%20Catalog.pdf",
  },
  {
    slug: "tengen-tns-three-phase-stabilizer",
    category: "stabilizers",
    brand: "Tengen",
    name: "TNS Three-Phase Automatic Voltage Stabilizer",
    tagline: { en: "Three-phase stabilizer for factories and commercial sites", bn: "কারখানা ও বাণিজ্যিক সাইটের জন্য থ্রি-ফেজ স্ট্যাবিলাইজার" },
    description: {
      en: "Holds 380 V ±3% from a 280–430 V three-phase supply for machine tools, lifts, air-conditioning and other industrial loads.",
      bn: "২৮০–৪৩০ ভোল্ট থ্রি-ফেজ সাপ্লাই থেকে ৩৮০ ভোল্ট ±৩% ধরে রাখে — মেশিন টুল, লিফট, এয়ার-কন্ডিশনিং ও অন্যান্য শিল্প লোডের জন্য।",
    },
    keySpec: { en: "1.5–75 kVA · 3-phase", bn: "১.৫–৭৫ kVA · থ্রি-ফেজ" },
    specs: [
      spec("capacity", "1.5–75 kVA"),
      spec("input", "280–430 V, 3-phase 4-wire"),
      spec("output", "380 V ±3%"),
      spec("maxEff", "> 90%"),
      spec("protections", "Output over-voltage (430 ±7 V), short circuit"),
      spec("type", "Servo motor, three-phase"),
    ],
    highlights: {
      en: ["Wide three-phase input range", "Smooth, stepless regulation", "Automatic output cut-off on faults", "Sized to your load with margin"],
      bn: ["বিস্তৃত থ্রি-ফেজ ইনপুট রেঞ্জ", "মসৃণ, ধাপহীন নিয়ন্ত্রণ", "ত্রুটিতে স্বয়ংক্রিয় আউটপুট বন্ধ", "লোড অনুযায়ী মার্জিন রেখে সাইজিং"],
    },
    warranty: perProject,
    image: "/media/products/tengen-tns-three-phase-stabilizer.webp",
    source: "https://www.tengenglobal.com/public/uploads/uxupload/handbook/Voltage%20stabilizer%20TND%20TNS%20Catalog.pdf",
  },

  /* ======================= PROTECTION & ACCESSORIES ===================== */
  {
    slug: "huawei-sun2000-450w-p2",
    category: "protection",
    brand: "Huawei",
    name: "SUN2000-450W-P2 Smart PV Optimizer",
    tagline: { en: "Module-level optimiser for more energy and safety", bn: "বেশি বিদ্যুৎ ও নিরাপত্তার জন্য মডিউল-লেভেল অপটিমাইজার" },
    description: {
      en: "Fitted behind each panel, it lets every module work at its own best point, so shade or dirt on one panel no longer pulls down the whole string, and it shows each module's output in the FusionSolar app.",
      bn: "প্রতিটি প্যানেলের পেছনে বসানো হয়, ফলে প্রতিটি মডিউল নিজের সেরা পয়েন্টে কাজ করে — একটি প্যানেলে ছায়া বা ময়লা পড়লেও পুরো স্ট্রিং আর পিছিয়ে পড়ে না; FusionSolar অ্যাপে প্রতিটি মডিউলের উৎপাদন দেখা যায়।",
    },
    keySpec: { en: "450 W · 99.5% max. efficiency", bn: "৪৫০ ওয়াট · সর্বোচ্চ ৯৯.৫% দক্ষতা" },
    specs: [
      spec("power", "450 W rated input"),
      spec("input", "10–80 V MPPT range"),
      spec("current", "14.5 A max. short-circuit input"),
      spec("maxEff", "99.5% (99.0% weighted)"),
      spec("ip", "IP68"),
    ],
    highlights: {
      en: ["Module-level MPPT", "Less loss from shading and soiling", "Module-level monitoring and auto-mapping", "Arc-fault pinpointing"],
      bn: ["মডিউল-লেভেল MPPT", "ছায়া ও ময়লায় কম ক্ষতি", "মডিউল-লেভেল মনিটরিং ও অটো-ম্যাপিং", "আর্ক-ফল্টের সঠিক অবস্থান শনাক্ত"],
    },
    features: huaweiFeatures,
    warranty: perProject,
    image: "/media/products/huawei-sun2000-450w-p2.webp",
    source: "https://solar.huawei.com/en/products/sun2000-450w-p2-600w-p/specs/",
  },
  {
    slug: "cnc-ycb8-63pv-dc-mcb",
    category: "protection",
    brand: "CNC Electric",
    name: "YCB8-63PV DC Miniature Circuit Breaker",
    tagline: { en: "DC breaker for PV strings", bn: "পিভি স্ট্রিংয়ের জন্য ডিসি ব্রেকার" },
    description: {
      en: "Isolation, overload and short-circuit protection for the DC side of a solar system, including reverse current from faulty strings.",
      bn: "সোলার সিস্টেমের ডিসি অংশে আইসোলেশন, ওভারলোড ও শর্ট-সার্কিট সুরক্ষা — ত্রুটিপূর্ণ স্ট্রিংয়ের রিভার্স কারেন্টসহ।",
    },
    keySpec: { en: "Up to DC 1000 V · 63 A", bn: "ডিসি ১০০০ ভোল্ট পর্যন্ত · ৬৩ অ্যাম্পিয়ার" },
    specs: [
      spec("voltage", "Up to DC 1000 V"),
      spec("current", "Up to 63 A"),
      spec("breaking", "6 kA"),
      spec("standard", "IEC/EN 60947-2"),
    ],
    highlights: {
      en: ["Made for PV systems", "DIN-rail modular design", "Isolation and short-circuit protection", "Also suits other DC systems"],
      bn: ["পিভি সিস্টেমের জন্য তৈরি", "DIN-রেল মডুলার ডিজাইন", "আইসোলেশন ও শর্ট-সার্কিট সুরক্ষা", "অন্যান্য ডিসি সিস্টেমেও চলে"],
    },
    warranty: perProject,
    image: "/media/products/cnc-ycb8-63pv-dc-mcb.webp",
    source: "https://www.cncele.com/dc-mcb-for-solar-ycb8-63pv-product/",
  },
  {
    slug: "chint-nu6-ii-spd",
    category: "protection",
    brand: "CHINT",
    name: "NU6-II Surge Protective Device",
    tagline: { en: "Type 2 surge protection for AC boards", bn: "এসি বোর্ডের জন্য টাইপ ২ সার্জ প্রোটেকশন" },
    description: {
      en: "Guards inverters and loads against lightning-induced and switching surges, an important layer in Bangladesh's storm season.",
      bn: "বজ্রপাত ও সুইচিং সার্জ থেকে ইনভার্টার ও লোড রক্ষা করে — বাংলাদেশের ঝড়ের মৌসুমে গুরুত্বপূর্ণ সুরক্ষা।",
    },
    keySpec: { en: "Type 2 · up to 100 kA", bn: "টাইপ ২ · ১০০ kA পর্যন্ত" },
    specs: [
      spec("poles", "1P / 2P / 3P / 4P"),
      spec("voltage", "230/400 V AC; Uc 385–460 V"),
      spec("maxDischarge", "40 / 60 / 100 kA (8/20 µs)"),
      spec("protections", "Up 1.8–2 kV"),
      spec("standard", "IEC 61643-11"),
    ],
    highlights: {
      en: ["Protects inverter AC output", "Multiple discharge ratings", "DIN-rail mounting", "Pairs with CHINT breakers"],
      bn: ["ইনভার্টারের এসি আউটপুট সুরক্ষা", "বিভিন্ন ডিসচার্জ রেটিং", "DIN-রেলে বসানো", "CHINT ব্রেকারের সাথে মানানসই"],
    },
    warranty: perProject,
    image: "/media/products/chint-nu6-ii-spd.webp",
    source: "https://www.chint.cz/engdetail.php?id=43",
  },
  {
    slug: "tengen-tgb1n-63-mcb",
    category: "protection",
    brand: "Tengen",
    name: "TGB1N-63 Miniature Circuit Breaker",
    tagline: { en: "AC breaker for distribution boards", bn: "ডিস্ট্রিবিউশন বোর্ডের জন্য এসি ব্রেকার" },
    description: {
      en: "Overload and short-circuit protection for the AC side, from the inverter output to the building's distribution board.",
      bn: "এসি অংশে ওভারলোড ও শর্ট-সার্কিট সুরক্ষা — ইনভার্টারের আউটপুট থেকে ভবনের ডিস্ট্রিবিউশন বোর্ড পর্যন্ত।",
    },
    keySpec: { en: "1–63 A · 6 kA", bn: "১–৬৩ অ্যাম্পিয়ার · ৬ kA" },
    specs: [
      spec("poles", "1P / 2P / 3P / 4P"),
      spec("current", "1–63 A"),
      spec("voltage", "230/400 V AC"),
      spec("breaking", "6 kA"),
      spec("standard", "IEC 60898-1 · B / C / D curves"),
    ],
    highlights: {
      en: ["Choice of trip curves", "DIN-rail mounting", "Wide current range", "For homes, shops and panels"],
      bn: ["বিভিন্ন ট্রিপ কার্ভ", "DIN-রেলে বসানো", "বিস্তৃত কারেন্ট রেঞ্জ", "বাসা, দোকান ও প্যানেলের জন্য"],
    },
    warranty: perProject,
    image: "/media/products/tengen-tgb1n-63-mcb.webp",
    source: "https://www.tengenglobal.com/proModMin/32.html",
  },
  {
    slug: "pv-dc-isolator-switch",
    category: "protection",
    name: "PV DC Isolator Switch",
    tagline: { en: "Safe disconnection of the DC side", bn: "ডিসি অংশ নিরাপদে বিচ্ছিন্ন করা" },
    description: {
      en: "Lets technicians safely disconnect the solar array from the inverter for maintenance. AC isolators do the same between inverter and load or grid.",
      bn: "রক্ষণাবেক্ষণের সময় সোলার অ্যারে নিরাপদে ইনভার্টার থেকে বিচ্ছিন্ন করতে সাহায্য করে। এসি আইসোলেটর একই কাজ করে ইনভার্টার ও লোড/গ্রিডের মাঝে।",
    },
    keySpec: { en: "DC & AC isolators", bn: "ডিসি ও এসি আইসোলেটর" },
    specs: [
      spec("type", "Rotary isolator in weatherproof enclosure"),
      spec("application", "Between array and inverter"),
    ],
    highlights: {
      en: ["Safety", "Isolation", "Easier maintenance", "Sized to your string voltage"],
      bn: ["নিরাপত্তা", "আইসোলেশন", "সহজ রক্ষণাবেক্ষণ", "স্ট্রিং ভোল্টেজ অনুযায়ী নির্বাচন"],
    },
    image: "/media/products/dc-isolator.webp",
  },
  {
    slug: "pv-dc-combiner-box",
    category: "protection",
    name: "PV DC Combiner Box",
    tagline: { en: "Combines strings with DC protection", bn: "ডিসি সুরক্ষাসহ স্ট্রিং একত্র করে" },
    description: {
      en: "Combines multiple solar strings into one output and houses the DC fuses, breakers and surge protection in one enclosure.",
      bn: "একাধিক সোলার স্ট্রিং একটি আউটপুটে একত্র করে এবং ডিসি ফিউজ, ব্রেকার ও সার্জ প্রোটেকশন এক এনক্লোজারে রাখে।",
    },
    keySpec: { en: "Built to string count", bn: "স্ট্রিং সংখ্যা অনুযায়ী তৈরি" },
    specs: [
      spec("components", "Fuses / DC MCB, SPD, isolator"),
      spec("application", "Multi-string rooftops and plants"),
    ],
    highlights: {
      en: ["Combining", "Protection", "Efficiency", "Neat, labelled wiring"],
      bn: ["স্ট্রিং একত্রকরণ", "সুরক্ষা", "দক্ষতা", "পরিপাটি ও লেবেলযুক্ত ওয়্যারিং"],
    },
    image: "/media/products/combiner-box.webp",
  },
  {
    slug: "solar-cable-mc4-connectors",
    category: "protection",
    name: "Solar DC Cable & MC4 Connectors",
    tagline: { en: "UV-resistant cabling and secure DC joints", bn: "ইউভি-প্রতিরোধী ক্যাবল ও নিরাপদ ডিসি সংযোগ" },
    description: {
      en: "Durable, UV-resistant PV cable and MC4-type connectors for safe, low-loss panel-to-system connections.",
      bn: "টেকসই, ইউভি-প্রতিরোধী পিভি ক্যাবল ও MC4-টাইপ কানেক্টর — প্যানেল থেকে সিস্টেম পর্যন্ত নিরাপদ ও কম-লসের সংযোগ।",
    },
    keySpec: { en: "Red / Black PV Cable · MC4 Connectors", bn: "লাল / কালো পিভি ক্যাবল · MC4" },
    specs: [
      spec("type", "PV cable (red / black), MC4-type connectors"),
      spec("application", "PV array wiring to combiner box and inverter"),
    ],
    highlights: {
      en: ["Efficient power transmission", "Durability", "Safety", "Sized for voltage drop"],
      bn: ["দক্ষ বিদ্যুৎ পরিবহন", "স্থায়িত্ব", "নিরাপত্তা", "ভোল্টেজ ড্রপ অনুযায়ী সাইজ"],
    },
    image: "/media/products/cables.webp",
  },
  {
    slug: "earthing-lightning-protection",
    category: "protection",
    name: "Earthing & Grounding Kit",
    tagline: { en: "Grounding for safety and fault protection", bn: "নিরাপত্তা ও ফল্ট সুরক্ষার জন্য আর্থিং" },
    description: {
      en: "Copper earth rods, clamps and earth conductors that bond frames, structures and equipment for safety and fault protection.",
      bn: "কপার আর্থ রড, ক্ল্যাম্প ও আর্থ কন্ডাক্টর — ফ্রেম, স্ট্রাকচার ও যন্ত্রপাতি সংযুক্ত করে নিরাপত্তা ও ফল্ট সুরক্ষা দেয়।",
    },
    keySpec: { en: "Rods, clamps, conductors", bn: "রড, ক্ল্যাম্প, কন্ডাক্টর" },
    specs: [
      spec("components", "Earth rod, clamp, earth cable"),
      spec("application", "Module frames, structures, inverters, boards"),
    ],
    highlights: {
      en: ["Safety", "Grounding", "Protection", "Tested on handover"],
      bn: ["নিরাপত্তা", "গ্রাউন্ডিং", "সুরক্ষা", "হস্তান্তরের সময় পরীক্ষিত"],
    },
    image: "/media/products/earthing.webp",
  },

  /* ========================= MOUNTING STRUCTURES ======================== */
  {
    slug: "rooftop-mounting-structure",
    category: "mounting",
    name: "Rooftop Mounting Structure",
    tagline: { en: "For RCC and metal-sheet roofs", bn: "আরসিসি ও মেটাল-শিট ছাদের জন্য" },
    description: {
      en: "Installed on building rooftops to save space and capture maximum sunlight, designed around roof strength, wind load, drainage and maintenance access.",
      bn: "ভবনের ছাদে বসানো হয় জায়গা বাঁচাতে ও সর্বোচ্চ রোদ পেতে — ছাদের শক্তি, বাতাসের লোড, পানি নিষ্কাশন ও রক্ষণাবেক্ষণের সুবিধা মাথায় রেখে ডিজাইন করা।",
    },
    keySpec: { en: "South-facing, site-specific tilt", bn: "দক্ষিণমুখী, সাইট অনুযায়ী টিল্ট" },
    specs: [
      spec("material", "Corrosion-resistant steel / aluminium"),
      spec("application", "Homes, offices, factory sheds"),
    ],
    highlights: {
      en: ["Structural check before design", "Wind-load consideration", "No water-logging on the roof", "Safe cleaning access"],
      bn: ["ডিজাইনের আগে কাঠামো যাচাই", "বাতাসের লোড বিবেচনা", "ছাদে পানি জমে না", "পরিষ্কারের জন্য নিরাপদ প্রবেশ"],
    },
    image: "/media/products/mount-roof.webp",
  },
  {
    slug: "ground-mounting-structure",
    category: "mounting",
    name: "Ground Mounting Structure",
    tagline: { en: "For open land and solar parks", bn: "খোলা জমি ও সোলার পার্কের জন্য" },
    description: {
      en: "Strong ground structures for large or open areas, with row spacing that limits shading and helps airflow and cleaning.",
      bn: "বড় বা খোলা জায়গার জন্য মজবুত গ্রাউন্ড স্ট্রাকচার — সারির মাঝে এমন দূরত্ব যাতে ছায়া কম পড়ে, বাতাস চলে ও পরিষ্কার সহজ হয়।",
    },
    keySpec: { en: "Engineered foundations", bn: "প্রকৌশলভিত্তিক ফাউন্ডেশন" },
    specs: [
      spec("material", "Corrosion-resistant steel / aluminium"),
      spec("application", "Solar parks, farms, factory land"),
    ],
    highlights: {
      en: ["Suits bifacial modules", "Correct tilt and spacing", "Flood and drainage aware", "Built for storms"],
      bn: ["বাইফেসিয়াল মডিউলের উপযোগী", "সঠিক টিল্ট ও দূরত্ব", "বন্যা ও নিষ্কাশন বিবেচনা", "ঝড় সহনশীল"],
    },
    image: "/media/products/mount-ground.webp",
  },
  {
    slug: "elevated-mounting-structure",
    category: "mounting",
    name: "Elevated / Canopy Structure",
    tagline: { en: "Solar above, usable space below", bn: "উপরে সোলার, নিচে ব্যবহারযোগ্য জায়গা" },
    description: {
      en: "Mounted on elevated frames or sheds so the space underneath stays usable for parking, drying yards, walkways or rooftop gardens.",
      bn: "উঁচু ফ্রেম বা শেডে বসানো, তাই নিচের জায়গা পার্কিং, শুকানোর উঠান, হাঁটার পথ বা ছাদবাগানে ব্যবহার করা যায়।",
    },
    keySpec: { en: "Carports, sheds, rooftop canopies", bn: "কারপোর্ট, শেড, ছাদের ক্যানোপি" },
    specs: [
      spec("material", "Galvanised steel structure"),
      spec("application", "Parking, rooftops with other uses"),
    ],
    highlights: {
      en: ["Uses space twice", "Rear-side gain for bifacial panels", "Designed for wind load", "Clean cable routing"],
      bn: ["একই জায়গার দ্বৈত ব্যবহার", "বাইফেসিয়াল প্যানেলে বাড়তি উৎপাদন", "বাতাসের লোড অনুযায়ী ডিজাইন", "পরিপাটি ক্যাবল রাউটিং"],
    },
    image: "/media/products/mount-elevated.webp",
  },

  /* ======================== COMMERCIAL & UTILITY ======================== */
  {
    slug: "on-grid-solar-system",
    category: "commercial",
    name: "On-Grid Solar System",
    tagline: { en: "Cut the bill, stay on the grid", bn: "বিল কমান, গ্রিডের সাথেই থাকুন" },
    description: {
      en: "Solar power is used by the building first; the grid covers the rest, and surplus can be exported under net metering where applicable.",
      bn: "সোলারের বিদ্যুৎ আগে ভবনে ব্যবহার হয়; বাকিটা গ্রিড থেকে আসে, আর প্রযোজ্য ক্ষেত্রে নেট মিটারিংয়ে বাড়তি বিদ্যুৎ গ্রিডে পাঠানো যায়।",
    },
    keySpec: { en: "Panels · grid-tied inverter · meter", bn: "প্যানেল · গ্রিড-টাই ইনভার্টার · মিটার" },
    specs: [
      spec("components", "PV modules, grid-tied inverter, net meter, BOS"),
      spec("idealFor", "Homes, offices, businesses with reliable grid"),
      spec("battery", "Not required"),
    ],
    highlights: {
      en: ["Lowest cost per kWh", "Net-metering ready", "No battery maintenance", "Does not run during outages"],
      bn: ["প্রতি ইউনিটে সবচেয়ে কম খরচ", "নেট মিটারিং-রেডি", "ব্যাটারি রক্ষণাবেক্ষণ নেই", "বিদ্যুৎ বিভ্রাটে চলে না"],
    },
    warranty: perContract,
    image: "/media/img/house-modern.webp",
  },
  {
    slug: "off-grid-solar-system",
    category: "commercial",
    name: "Off-Grid Solar System",
    tagline: { en: "Independent power where the grid can't reach", bn: "যেখানে গ্রিড নেই, সেখানে নিজস্ব বিদ্যুৎ" },
    description: {
      en: "Solar charges the battery and an off-grid inverter supplies the loads, including at night and in low-sun periods. For remote sites and places that need their own power.",
      bn: "সোলার ব্যাটারি চার্জ করে এবং অফ-গ্রিড ইনভার্টার লোডে বিদ্যুৎ দেয় — রাতে ও কম রোদেও। দূরবর্তী সাইট ও নিজস্ব বিদ্যুৎ দরকার এমন জায়গার জন্য।",
    },
    keySpec: { en: "Panels · controller · battery · inverter", bn: "প্যানেল · কন্ট্রোলার · ব্যাটারি · ইনভার্টার" },
    specs: [
      spec("components", "PV modules, charge controller, battery, off-grid inverter"),
      spec("idealFor", "Remote areas, islands, telecom, farms"),
      spec("battery", "Required"),
    ],
    highlights: {
      en: ["Works during outages", "No grid connection needed", "Sized to your loads", "Expandable later"],
      bn: ["বিদ্যুৎ বিভ্রাটেও চলে", "গ্রিড সংযোগ লাগে না", "লোড অনুযায়ী সাইজ", "পরে বাড়ানো যায়"],
    },
    warranty: perContract,
    image: "/media/img/p-house-solar.webp",
  },
  {
    slug: "hybrid-solar-system",
    category: "commercial",
    name: "Hybrid Solar System",
    tagline: { en: "Solar savings plus battery backup", bn: "সোলার সাশ্রয় ও ব্যাটারি ব্যাকআপ একসাথে" },
    description: {
      en: "Combines solar, battery storage and the grid through a hybrid inverter: solar in normal operation, stored energy for the evening and backup for selected loads during load-shedding.",
      bn: "হাইব্রিড ইনভার্টারের মাধ্যমে সোলার, ব্যাটারি ও গ্রিড একসাথে — স্বাভাবিক সময়ে সোলার, সন্ধ্যায় জমানো বিদ্যুৎ এবং লোডশেডিংয়ে নির্বাচিত লোডে ব্যাকআপ।",
    },
    keySpec: { en: "Panels · hybrid inverter · battery", bn: "প্যানেল · হাইব্রিড ইনভার্টার · ব্যাটারি" },
    specs: [
      spec("components", "PV modules, hybrid inverter, battery, BOS"),
      spec("idealFor", "Homes and businesses that want savings and backup"),
      spec("battery", "Required"),
    ],
    highlights: {
      en: ["Works during outages", "Uses the grid when needed", "Smart energy management", "Most popular choice in Bangladesh"],
      bn: ["বিদ্যুৎ বিভ্রাটেও চলে", "দরকার হলে গ্রিড ব্যবহার করে", "স্মার্ট এনার্জি ম্যানেজমেন্ট", "বাংলাদেশে সবচেয়ে জনপ্রিয়"],
    },
    warranty: perContract,
    image: "/media/img/house-evening.webp",
  },
  {
    slug: "hybrid-factory-power",
    category: "commercial",
    name: "Hybrid Factory Power",
    tagline: { en: "Solar + grid + battery + generator", bn: "সোলার + গ্রিড + ব্যাটারি + জেনারেটর" },
    description: {
      en: "A modern factory shouldn't depend on one source. We integrate solar, battery, grid and generator into one engineered system, configured to your load profile and operating hours.",
      bn: "আধুনিক কারখানা এক উৎসের ওপর নির্ভর করা উচিত নয়। আপনার লোড প্রোফাইল ও চালুর সময় অনুযায়ী সোলার, ব্যাটারি, গ্রিড ও জেনারেটর একটি প্রকৌশল সিস্টেমে যুক্ত করি।",
    },
    keySpec: { en: "One power strategy, multiple sources", bn: "এক পাওয়ার কৌশল, একাধিক উৎস" },
    specs: [
      spec("components", "PV, battery, grid, diesel generator, controls"),
      spec("idealFor", "Factories, workshops, warehouses, cold storage"),
    ],
    highlights: {
      en: ["Lower energy costs", "Less generator fuel", "Better power reliability", "Improved operational continuity"],
      bn: ["কম বিদ্যুৎ খরচ", "জেনারেটরের জ্বালানি কম", "বেশি নির্ভরযোগ্য বিদ্যুৎ", "নিরবচ্ছিন্ন উৎপাদন"],
    },
    warranty: perContract,
    image: "/media/products/sol-hybrid-factory.webp",
  },
  {
    slug: "solar-coldchain",
    category: "commercial",
    name: "Solar Cold Chain System",
    tagline: { en: "Protect your cold storage, reduce energy cost", bn: "কোল্ড স্টোরেজ সুরক্ষিত, বিদ্যুৎ খরচ কম" },
    description: {
      en: "Solar solutions designed around refrigeration loads and operating needs, not just a fixed capacity, with storage, grid integration, backup and monitoring.",
      bn: "নির্দিষ্ট ক্যাপাসিটি নয় — রেফ্রিজারেশন লোড ও কার্যক্রমের প্রয়োজন অনুযায়ী ডিজাইন করা সোলার সমাধান; স্টোরেজ, গ্রিড সমন্বয়, ব্যাকআপ ও মনিটরিংসহ।",
    },
    keySpec: { en: "Designed around refrigeration loads", bn: "রেফ্রিজারেশন লোড অনুযায়ী ডিজাইন" },
    specs: [
      spec("components", "Solar PV, battery storage, grid integration, backup, monitoring"),
      spec("idealFor", "Cold storage, frozen food, fisheries, food processing, agri storage"),
    ],
    highlights: {
      en: ["Food safety", "Lower operating costs", "Uninterrupted operation", "A more sustainable business"],
      bn: ["খাদ্য নিরাপত্তা", "কম পরিচালন খরচ", "নিরবচ্ছিন্ন কার্যক্রম", "আরও টেকসই ব্যবসা"],
    },
    warranty: perContract,
    image: "/media/products/sol-coldchain.webp",
  },
  {
    slug: "solar-irrigation",
    category: "commercial",
    name: "Solar Irrigation",
    tagline: { en: "Harvest sunlight, not diesel", bn: "ডিজেল নয়, সূর্যের আলো দিয়ে সেচ" },
    description: {
      en: "Solar panels, a pump controller and an efficient pump deliver water to the fields and cut dependence on diesel and grid power. Irrigation-as-a-Service is possible for selected projects.",
      bn: "সোলার প্যানেল, পাম্প কন্ট্রোলার ও দক্ষ পাম্প মাঠে পানি পৌঁছে দেয় এবং ডিজেল ও গ্রিডের ওপর নির্ভরতা কমায়। নির্বাচিত প্রকল্পে সেচ-সেবা মডেলও সম্ভব।",
    },
    keySpec: { en: "Panels · pump controller · pump", bn: "প্যানেল · পাম্প কন্ট্রোলার · পাম্প" },
    specs: [
      spec("components", "PV modules, solar pump controller, water pump"),
      spec("idealFor", "Agriculture, fisheries, farms, rural irrigation, water supply"),
      spec("model", "Purchase or Irrigation-as-a-Service (selected projects)"),
    ],
    highlights: {
      en: ["Lower operating costs", "Higher productivity", "No diesel logistics", "A more sustainable future"],
      bn: ["কম পরিচালন খরচ", "বেশি উৎপাদনশীলতা", "ডিজেল আনা-নেওয়ার ঝামেলা নেই", "আরও টেকসই ভবিষ্যৎ"],
    },
    warranty: perContract,
    image: "/media/products/sol-irrigation.webp",
  },
  {
    slug: "solar-water-pumping-system",
    category: "commercial",
    name: "Solar-Powered Water Pumping System",
    tagline: { en: "Irrigation and water supply for off-grid areas", bn: "অফ-গ্রিড এলাকায় সেচ ও পানি সরবরাহ" },
    description: {
      en: "PV modules power an MPPT pump controller and inverter to drive a submersible pump. Automatic level sensors control pumping based on tank requirements.",
      bn: "পিভি মডিউল MPPT পাম্প কন্ট্রোলার ও ইনভার্টারকে বিদ্যুৎ দেয়, যা সাবমার্সিবল পাম্প চালায়। স্বয়ংক্রিয় লেভেল সেন্সর ট্যাংকের প্রয়োজন অনুযায়ী পাম্প নিয়ন্ত্রণ করে।",
    },
    keySpec: { en: "Designed according to required flow rate and storage capacity", bn: "প্রয়োজনীয় প্রবাহ ও স্টোরেজ ক্যাপাসিটি অনুযায়ী ডিজাইন" },
    specs: [
      spec("components", "PV array, MPPT pump controller, inverter, submersible pump, tank, level sensor, HDPE pipe"),
      spec("capacity", "Configured according to water demand, pump head, and storage requirements"),
      spec("idealFor", "Remote farms, off-grid water supply"),
    ],
    highlights: {
      en: ["Clean, renewable energy", "Automatic water-level control", "Low operating cost", "Sized from head, flow and site survey"],
      bn: ["পরিচ্ছন্ন নবায়নযোগ্য শক্তি", "স্বয়ংক্রিয় পানির লেভেল নিয়ন্ত্রণ", "কম পরিচালন খরচ", "হেড, প্রবাহ ও সাইট জরিপ অনুযায়ী সাইজ"],
    },
    warranty: perContract,
    image: "/media/products/sol-water-pump.webp",
  },
  {
    slug: "solar-parking",
    category: "commercial",
    name: "Solar Parking",
    tagline: { en: "Park, charge and power it with the sun", bn: "পার্ক করুন, চার্জ দিন, সূর্যের শক্তিতে" },
    description: {
      en: "Solar carports turn ordinary parking into energy-generating infrastructure, with optional battery storage and EV charging.",
      bn: "সোলার কারপোর্ট সাধারণ পার্কিংকে বিদ্যুৎ-উৎপাদনকারী অবকাঠামোতে রূপ দেয় — ঐচ্ছিক ব্যাটারি স্টোরেজ ও ইভি চার্জিংসহ।",
    },
    keySpec: { en: "Solar canopy · storage · EV charging", bn: "সোলার ক্যানোপি · স্টোরেজ · ইভি চার্জিং" },
    specs: [
      spec("components", "Solar canopy, optional battery, EV chargers"),
      spec("idealFor", "Shopping malls, hotels, corporate offices, universities, hospitals"),
    ],
    highlights: {
      en: ["Shade and power from one structure", "Lower carbon emissions", "Cost savings", "Future-ready infrastructure"],
      bn: ["একই কাঠামোয় ছায়া ও বিদ্যুৎ", "কম কার্বন নিঃসরণ", "খরচ সাশ্রয়", "ভবিষ্যৎ-উপযোগী অবকাঠামো"],
    },
    warranty: perContract,
    image: "/media/products/sol-parking.webp",
  },
  {
    slug: "energy-guardian",
    category: "commercial",
    name: "Energy Guardian",
    tagline: { en: "Your energy, monitored, analysed and optimised", bn: "আপনার বিদ্যুৎ — মনিটর, বিশ্লেষণ ও অপটিমাইজড" },
    description: {
      en: "Installing solar is only the beginning. Ongoing monitoring and maintenance show how your system performs, with monthly reports and alerts.",
      bn: "সোলার বসানো কেবল শুরু। নিয়মিত মনিটরিং ও রক্ষণাবেক্ষণে বোঝা যায় সিস্টেম কেমন চলছে — মাসিক রিপোর্ট ও অ্যালার্টসহ।",
    },
    keySpec: { en: "Monthly monitoring & O&M", bn: "মাসিক মনিটরিং ও O&M" },
    specs: [
      spec("scope", "Solar generation, grid use, generator use, battery performance, savings, alerts, maintenance"),
      spec("idealFor", "Any OSLEOS or third-party solar system"),
    ],
    highlights: {
      en: ["Monthly energy report", "Performance alerts", "Maintenance recommendations", "Estimated energy savings"],
      bn: ["মাসিক এনার্জি রিপোর্ট", "পারফরম্যান্স অ্যালার্ট", "রক্ষণাবেক্ষণ পরামর্শ", "আনুমানিক বিদ্যুৎ সাশ্রয়"],
    },
    warranty: perContract,
    image: "/media/products/sol-guardian.webp",
  },
  {
    slug: "solar-lift",
    category: "commercial",
    name: "Solar Lift",
    tagline: { en: "Power your passenger elevator with solar", bn: "সোলারে চলুক আপনার প্যাসেঞ্জার লিফট" },
    description: {
      en: "Solar engineering and elevator engineering together, to reduce the grid electricity used by passenger lifts. Each design follows an assessment of the lift, building and available solar.",
      bn: "সোলার ও লিফট প্রকৌশল একসাথে — প্যাসেঞ্জার লিফটের গ্রিড বিদ্যুৎ ব্যবহার কমাতে। প্রতিটি ডিজাইন লিফট, ভবন ও উপলব্ধ সোলার যাচাইয়ের পর করা হয়।",
    },
    keySpec: { en: "PV · hybrid power · lift drive", bn: "পিভি · হাইব্রিড পাওয়ার · লিফট ড্রাইভ" },
    specs: [
      spec("components", "Solar PV, solar/hybrid power system, elevator drive & control"),
      spec("idealFor", "Residential and commercial buildings, hotels, hospitals, offices"),
    ],
    highlights: {
      en: ["Less grid electricity", "More use of rooftop solar", "Energy-efficient lift operation", "Project-specific engineering"],
      bn: ["গ্রিড বিদ্যুৎ ব্যবহার কম", "ছাদের সোলারের বেশি ব্যবহার", "বিদ্যুৎ-সাশ্রয়ী লিফট চালনা", "প্রকল্পভিত্তিক প্রকৌশল"],
    },
    warranty: perContract,
    image: "/media/products/sol-lift.webp",
  },
  {
    slug: "solar-water-heater",
    category: "commercial",
    name: "ETC Solar Water Heater",
    tagline: { en: "Hot water from the sun, all day", bn: "সারাদিন সূর্যের তাপে গরম পানি" },
    description: {
      en: "Evacuated tube collectors capture sunlight and heat the water stored in an insulated stainless-steel tank, cutting the electricity, gas or diesel spent on hot water. Sized to your daily demand for hotels, hospitals, factories, hostels and homes.",
      bn: "ভ্যাকুয়াম টিউব কালেক্টর সূর্যের আলো ধরে ইনসুলেটেড স্টেইনলেস-স্টিল ট্যাংকের পানি গরম করে, ফলে গরম পানির জন্য বিদ্যুৎ, গ্যাস বা ডিজেলের খরচ কমে। হোটেল, হাসপাতাল, কারখানা, হোস্টেল ও বাসার দৈনিক চাহিদা অনুযায়ী সাইজ করা হয়।",
    },
    keySpec: { en: "Vacuum tubes · insulated stainless-steel tank", bn: "ভ্যাকুয়াম টিউব · ইনসুলেটেড স্টেইনলেস-স্টিল ট্যাংক" },
    specs: [
      spec("components", "Evacuated tube collectors, insulated stainless-steel tank, stand, piping"),
      spec("idealFor", "Hotels, hospitals, factories, hostels, homes"),
      spec("battery", "Not required"),
    ],
    highlights: {
      en: ["Advanced heat insulation ring", "Horizontal foaming technology", "Solder-joint-free design", "Heat-loss protection"],
      bn: ["অ্যাডভান্সড হিট ইনসুলেশন রিং", "হরিজন্টাল ফোমিং প্রযুক্তি", "সোল্ডার-জয়েন্ট-ফ্রি ডিজাইন", "তাপ-ক্ষয় থেকে সুরক্ষা"],
    },
    warranty: perContract,
    image: "/media/products/solar-water-heater.webp",
    imagePosition: "50% 25%",
  },
  {
    slug: "solar-farm",
    category: "commercial",
    name: "Solar Farm",
    tagline: { en: "Utility-scale solar, built end to end", bn: "ইউটিলিটি-স্কেল সোলার, শুরু থেকে শেষ পর্যন্ত" },
    description: {
      en: "Ground-mounted PV plants that feed clean power into the grid, delivered as one EPC package from site survey and design to supply, installation, grid connection and commissioning. Each plant is engineered around the site, the grid connection point and the offtake arrangement.",
      bn: "গ্রাউন্ড-মাউন্টেড পিভি প্ল্যান্ট গ্রিডে পরিচ্ছন্ন বিদ্যুৎ সরবরাহ করে — সাইট জরিপ ও ডিজাইন থেকে সরবরাহ, ইনস্টলেশন, গ্রিড সংযোগ ও কমিশনিং পর্যন্ত একটি EPC প্যাকেজে। প্রতিটি প্ল্যান্ট সাইট, গ্রিড সংযোগ পয়েন্ট ও বিদ্যুৎ বিক্রির ব্যবস্থা অনুযায়ী ডিজাইন করা হয়।",
    },
    keySpec: { en: "Ground-mounted PV · grid connection · EPC", bn: "গ্রাউন্ড-মাউন্টেড পিভি · গ্রিড সংযোগ · EPC" },
    specs: [
      spec("components", "PV modules, ground-mount structures, inverters, transformer & grid connection, monitoring"),
      spec("scope", "Site survey, design, supply, installation, grid connection, commissioning (EPC)"),
      spec("idealFor", "Utility and independent power producers, industrial estates, large landowners"),
    ],
    highlights: {
      en: ["Clean, large-scale generation", "Single EPC partner", "Designed around the site and grid point", "Remote monitoring"],
      bn: ["বড় আকারে পরিচ্ছন্ন বিদ্যুৎ উৎপাদন", "একজন EPC অংশীদার", "সাইট ও গ্রিড পয়েন্ট অনুযায়ী ডিজাইন", "রিমোট মনিটরিং"],
    },
    warranty: perContract,
    image: "/media/products/solar-farm.webp",
  },
  {
    slug: "solar-street-light",
    category: "commercial",
    name: "Solar Street Light",
    tagline: { en: "Light the road, no grid needed", bn: "গ্রিড ছাড়াই আলোকিত রাস্তা" },
    description: {
      en: "An LED street light with its own PV panel, LiFePO₄ battery and smart controller, available as an all-in-one or split unit. It charges by day and switches on automatically from dusk to dawn, with no trenching or electricity bill.",
      bn: "নিজস্ব পিভি প্যানেল, LiFePO₄ ব্যাটারি ও স্মার্ট কন্ট্রোলারসহ LED স্ট্রিট লাইট — অল-ইন-ওয়ান বা স্প্লিট ইউনিট। দিনে চার্জ হয় এবং সন্ধ্যা থেকে ভোর পর্যন্ত নিজে থেকে জ্বলে; ক্যাবল খোঁড়া বা বিদ্যুৎ বিলের ঝামেলা নেই।",
    },
    keySpec: { en: "LED · PV panel · LiFePO₄ battery · smart controller", bn: "LED · পিভি প্যানেল · LiFePO₄ ব্যাটারি · স্মার্ট কন্ট্রোলার" },
    specs: [
      spec("type", "All-in-one or split (separate panel and pole-mounted lamp)"),
      spec("components", "LED luminaire, PV panel, LiFePO₄ battery, smart controller, pole"),
      spec("idealFor", "Roads, villages, campuses, factories, parks, car parks"),
    ],
    highlights: {
      en: ["Dusk-to-dawn automatic operation", "No cabling or electricity bill", "Quick, low-cost installation", "Works through load-shedding"],
      bn: ["সন্ধ্যা থেকে ভোর স্বয়ংক্রিয় চালু-বন্ধ", "ক্যাবলিং বা বিদ্যুৎ বিল নেই", "দ্রুত ও কম খরচে ইনস্টলেশন", "লোডশেডিংয়েও জ্বলে"],
    },
    warranty: perContract,
    image: "/media/products/solar-street-light.webp",
  },
  {
    slug: "solar-powered-cameras",
    category: "commercial",
    name: "Solar Powered Cameras",
    tagline: { en: "Security where there is no power point", bn: "যেখানে বিদ্যুৎ সংযোগ নেই, সেখানেও নিরাপত্তা" },
    description: {
      en: "CCTV and IP cameras powered by their own PV panel and battery, for sites with no mains supply. Wireless 4G or Wi-Fi links and night vision keep remote sites watched around the clock.",
      bn: "নিজস্ব পিভি প্যানেল ও ব্যাটারিতে চলা CCTV ও IP ক্যামেরা, যেখানে মেইন বিদ্যুৎ নেই সেসব সাইটের জন্য। ওয়্যারলেস 4G বা Wi-Fi সংযোগ ও নাইট ভিশনে দূরবর্তী সাইট চব্বিশ ঘণ্টা নজরে থাকে।",
    },
    keySpec: { en: "Camera · PV panel · battery · 4G / Wi-Fi", bn: "ক্যামেরা · পিভি প্যানেল · ব্যাটারি · 4G / Wi-Fi" },
    specs: [
      spec("components", "CCTV/IP camera with night vision, PV panel, battery, charge controller, 4G or Wi-Fi link"),
      spec("idealFor", "Farms, construction sites, remote substations, fisheries, off-grid properties"),
      spec("battery", "Required"),
    ],
    highlights: {
      en: ["No mains power or cabling", "Night vision", "Remote viewing over 4G or Wi-Fi", "Runs through power cuts"],
      bn: ["মেইন বিদ্যুৎ বা ক্যাবলিং লাগে না", "নাইট ভিশন", "4G বা Wi-Fi-তে দূর থেকে দেখা যায়", "বিদ্যুৎ গেলেও চলে"],
    },
    warranty: perContract,
    image: "/media/products/solar-powered-cameras.webp",
  },
  /* ===================== AI INTEGRATED SOLAR SOLUTIONS ===================== */
  {
    slug: "solar-noise-barrier",
    category: "ai",
    brand: "Trina Solar",
    name: "TEG Solar Noise Barrier",
    tagline: { en: "A roadside noise barrier that also generates power", bn: "শব্দ আটকানোর পাশাপাশি বিদ্যুৎ উৎপাদনকারী রোডসাইড ব্যারিয়ার" },
    description: {
      en: "Trina Solar's solar noise barrier combines a photovoltaic module with sound-proofing and sound-absorbing materials, so one structure cuts road noise and produces clean electricity. It is built for roads near residential areas, schools and hospitals, and suits both new construction and renovation of existing noise barriers.",
      bn: "ট্রিনা সোলারের সোলার নয়েজ ব্যারিয়ারে পিভি মডিউলের সঙ্গে শব্দ-নিরোধক ও শব্দ-শোষক উপাদান যুক্ত, ফলে একই কাঠামো সড়কের শব্দ কমায় এবং পরিচ্ছন্ন বিদ্যুৎ তৈরি করে। আবাসিক এলাকা, স্কুল ও হাসপাতালের পাশের সড়কের জন্য তৈরি; নতুন নির্মাণ ও বিদ্যমান ব্যারিয়ার সংস্কার দুটোতেই ব্যবহার করা যায়।",
    },
    keySpec: { en: "35 dB sound reduction · NRC 0.9 · TÜV & CTC certified", bn: "৩৫ ডিবি শব্দ হ্রাস · NRC ০.৯ · TÜV ও CTC সার্টিফাইড" },
    specs: [
      spec("soundIndex", "35 dB"),
      spec("nrc", "0.9"),
      spec("certs", "TÜV and CTC certified (first BIPV CTC product certification)"),
      spec("type", "Vertical and angled, serrated, semi-enclosure and full-enclosure formats"),
      spec("cells", "Trinasolar high-efficiency cells"),
      spec("application", "Roads near residential areas, schools and hospitals"),
    ],
    highlights: {
      en: ["PV module and noise barrier in one structure", "Fire-, wind- and seismic-resistant", "For new builds and renovations", "Clean, low-carbon electricity"],
      bn: ["একই কাঠামোতে পিভি মডিউল ও নয়েজ ব্যারিয়ার", "আগুন, বাতাস ও ভূমিকম্প সহনশীল", "নতুন নির্মাণ ও সংস্কার দুটোর জন্য", "পরিচ্ছন্ন, কম-কার্বন বিদ্যুৎ"],
    },
    warranty: perContract,
    image: "/media/products/solar-noise-barrier.webp",
    source: "https://www.trinasolar.com/en-glb/teg-solar-noise-barrier/",
  },
  {
    slug: "colored-pv-glass",
    category: "ai",
    brand: "Trina Solar",
    name: "Colored Photovoltaic Glass",
    tagline: { en: "Building facades that generate electricity, in colour", bn: "রঙিন ভবন-ফ্যাসাড, যা নিজেই বিদ্যুৎ তৈরি করে" },
    description: {
      en: "Colorful photovoltaic building material from Trina Solar, made with N-type TOPCon cells and laminated tempered glass. It replaces conventional cladding on facades, canopies, balustrades, shading structures and skylights, with colours and textures that can be customised to the architecture.",
      bn: "ট্রিনা সোলারের রঙিন ফটোভোল্টাইক বিল্ডিং ম্যাটেরিয়াল, যা N-টাইপ TOPCon সেল ও টেম্পারড গ্লাস দিয়ে তৈরি। ভবনের ফ্যাসাড, ক্যানোপি, বেলুস্ট্রেড, শেডিং স্ট্রাকচার ও স্কাইলাইটে সাধারণ ক্ল্যাডিংয়ের জায়গা নেয়; স্থাপত্য অনুযায়ী রঙ ও টেক্সচার কাস্টমাইজ করা যায়।",
    },
    keySpec: { en: "195–205 Wp/m² · N-type TOPCon cells", bn: "১৯৫–২০৫ Wp/m² · N-টাইপ TOPCon সেল" },
    specs: [
      spec("glass", "Not less than 5.0 mm tempered glass with PVB film"),
      spec("power", "195–205 Wp/m²"),
      spec("cells", "N-type TOPCon"),
      spec("standard", "Meets curtain-wall specifications; compatible with PV and building standards"),
      spec("application", "Facades, canopies, balustrades, shading, skylights"),
    ],
    highlights: {
      en: ["Extensive colour and texture customisation", "Fire- and weather-resistant", "Same lifespan as the building material", "Clean, low-carbon electricity"],
      bn: ["রঙ ও টেক্সচার ব্যাপকভাবে কাস্টমাইজযোগ্য", "আগুন ও আবহাওয়া সহনশীল", "ভবনের উপকরণের সমান আয়ু", "পরিচ্ছন্ন, কম-কার্বন বিদ্যুৎ"],
    },
    warranty: perContract,
    image: "/media/products/colored-pv-glass.webp",
    source: "https://www.trinasolar.com/en-glb/teg-colored-photovoltaic-glass",
  },
  {
    slug: "robotic-panel-cleaning",
    category: "ai",
    name: "Automated Robotic Solar Panel Cleaning System",
    tagline: { en: "Robots that keep panels clean without water or crews", bn: "পানি বা কর্মী ছাড়াই প্যানেল পরিষ্কার রাখে রোবট" },
    description: {
      en: "A hanging-type cleaning robot (model TAR03a) that dry-cleans PV rows with polymer roller brushes. It is controlled from a mobile app or a platform, can run on a self-sensing mode, and recharges from solar, so large plants and remote sites stay clean without manual washing. Length can be customised to the panel size.",
      bn: "ঝুলন্ত ধরনের ক্লিনিং রোবট (মডেল TAR03a), যা পলিমার রোলার ব্রাশ দিয়ে ড্রাই-ক্লিনিং করে। মোবাইল অ্যাপ বা প্ল্যাটফর্ম থেকে নিয়ন্ত্রণ করা যায়, সেলফ-সেন্সিং মোডেও চলে এবং সোলার থেকে নিজে চার্জ নেয়; ফলে বড় প্ল্যান্ট ও দূরবর্তী সাইট হাতে ধোয়া ছাড়াই পরিষ্কার থাকে। প্যানেলের মাপ অনুযায়ী দৈর্ঘ্য কাস্টমাইজ করা যায়।",
    },
    keySpec: { en: "Dry cleaning · up to 20 m/min · 8–10 h per charge", bn: "ড্রাই ক্লিনিং · সর্বোচ্চ ২০ মি/মিনিট · প্রতি চার্জে ৮–১০ ঘণ্টা" },
    specs: [
      spec("type", "Hanging-type automatic cleaning robot (model TAR03a)"),
      spec("cleaning", "Dry cleaning with polymer roller brushes"),
      spec("control", "Mobile app or platform; self-sensing mode"),
      spec("powerSupply", "Lithium battery, solar self-charging"),
      spec("runtime", "8–10 hours per charge"),
      spec("speed", "Up to 20 m/min"),
      spec("weight", "Approx. 49 kg"),
      spec("idealFor", "Large-scale solar installations, remote plants, desert sites"),
    ],
    highlights: {
      en: ["Waterless dry cleaning", "App or platform control", "Solar self-charging", "Modular brush, simple to adjust as it wears"],
      bn: ["পানি ছাড়া ড্রাই ক্লিনিং", "অ্যাপ বা প্ল্যাটফর্ম থেকে নিয়ন্ত্রণ", "সোলার থেকে নিজে চার্জ", "মডুলার ব্রাশ, ক্ষয়ে গেলে সহজে অ্যাডজাস্ট করা যায়"],
    },
    warranty: perContract,
    image: "/media/products/robotic-panel-cleaning.webp",
    // Specs: Hunan Teamants TAR03a listing. A second client URL (todos-china.com) only says it supplies
    // "automatic solar panel cleaning robots" and gives no specs or usable images.
    source: "https://teamants.en.made-in-china.com/product/XTSUYGuPXsVN/China-Fully-Automatic-Solar-Panel-Cleaning-System-for-Optimal-Energy-Output.html",
  },
  {
    slug: "panel-breakage-sensors",
    category: "ai",
    name: "Solar System Breakage Sensors",
    tagline: { en: "Vision and laser sensors that catch breakage early", bn: "ভাঙন আগেই ধরে ফেলে ভিশন ও লেজার সেন্সর" },
    description: {
      en: "Machine-vision and laser sensors that check solar wafers and cells for broken edges and fine breakouts, and reject damaged parts before they break up completely and damage other material. Used on solar production lines for position checking and fracture control.",
      bn: "মেশিন-ভিশন ও লেজার সেন্সর সোলার ওয়েফার ও সেলের ভাঙা কিনারা ও সূক্ষ্ম ফাটল পরীক্ষা করে এবং ক্ষতিগ্রস্ত অংশ পুরোপুরি ভেঙে অন্য উপাদান নষ্ট করার আগেই বাদ দেয়। সোলার প্রোডাকশন লাইনে পজিশন চেক ও ফ্র্যাকচার কন্ট্রোলে ব্যবহৃত হয়।",
    },
    keySpec: { en: "Sub-pixel edge inspection · 4–20 mA / RS485 output", bn: "সাব-পিক্সেল কিনারা পরীক্ষা · 4–20 mA / RS485 আউটপুট" },
    specs: [
      spec("sensors", "VISOR Solar vision sensor; FT 10-RLH sub-miniature scanner; FT 50-RLA laser distance sensor"),
      spec("detects", "Broken edges and fine breakouts, to sub-pixel accuracy; wafer position and slot occupation"),
      spec("signalOut", "FT 50-RLA: 4–20 mA analog or RS485, programmable switching zones"),
      spec("size", "FT 10-RLH housing 21 x 14 x 8 mm"),
      spec("application", "Solar wafer and cell production lines"),
    ],
    highlights: {
      en: ["Finds broken edges and fine breakouts", "Rejects damaged parts early", "Less material waste and fewer line stoppages", "Compact sensor housings"],
      bn: ["ভাঙা কিনারা ও সূক্ষ্ম ফাটল শনাক্ত করে", "ক্ষতিগ্রস্ত অংশ আগেই বাদ দেয়", "কম অপচয় ও কম লাইন-বন্ধ", "কমপ্যাক্ট সেন্সর হাউজিং"],
    },
    warranty: perContract,
    image: "/media/products/panel-breakage-sensors.webp",
    source: "https://fortop.co.uk/knowledge/application-examples/sensopart-fracture-control-solar-industry/",
  },
  {
    slug: "sun-tracking-solar",
    category: "ai",
    name: "Self-Rotating Solar Panels with Sun-Tracking Axis",
    tagline: { en: "Panels that follow the sun across the day", bn: "সারাদিন সূর্যের সঙ্গে ঘুরে চলা প্যানেল" },
    description: {
      en: "A single-axis tracker rotates the panel rows to follow the sun, raising the energy captured from the same modules. The model listed here (WTT-2P) uses a multi-actuator drive and an intelligent AI algorithm, is designed for commercial and utility-scale plants, and tolerates sloping terrain.",
      bn: "সিঙ্গেল-অ্যাক্সিস ট্র্যাকার প্যানেলের সারিকে ঘুরিয়ে সূর্যকে অনুসরণ করে, ফলে একই মডিউল থেকে বেশি শক্তি পাওয়া যায়। এখানে তালিকাভুক্ত মডেলে (WTT-2P) মাল্টি-অ্যাকচুয়েটর ড্রাইভ ও ইন্টেলিজেন্ট এআই অ্যালগরিদম আছে; বাণিজ্যিক ও ইউটিলিটি-স্কেল প্ল্যান্টের জন্য তৈরি এবং ঢালু জমিতেও চলে।",
    },
    keySpec: { en: "±60° tracking · ±1° accuracy · up to 72 kWp per row", bn: "±৬০° ট্র্যাকিং · ±১° নির্ভুলতা · প্রতি সারিতে ৭২ kWp পর্যন্ত" },
    specs: [
      spec("type", "One-portrait horizontal single-axis tracker (WTT-2P)"),
      spec("capacity", "Up to 72 kWp per row (600 W modules)"),
      spec("trackRange", "±60° (customisable)"),
      spec("trackAcc", "±1°"),
      spec("motor", "24 V DC motor"),
      spec("opTemp", "-30 °C to +60 °C"),
      spec("windSpeed", "60 m/s"),
      spec("snowLoad", "1.6 kN/m²"),
      spec("slope", "10–20% north-south"),
      spec("application", "Commercial and utility-scale solar plants"),
    ],
    highlights: {
      en: ["Intelligent AI tracking algorithm", "Supplier-stated generation gain of 15–30%", "Handles sloping terrain", "Simple installation and maintenance"],
      bn: ["ইন্টেলিজেন্ট এআই ট্র্যাকিং অ্যালগরিদম", "সরবরাহকারীর দাবি অনুযায়ী উৎপাদন ১৫–৩০% বেশি", "ঢালু জমিতেও উপযোগী", "সহজ ইনস্টলেশন ও রক্ষণাবেক্ষণ"],
    },
    warranty: perContract,
    image: "/media/products/sun-tracking-solar.webp",
    imageCredit: { en: "Photo: Vinaykumar8687, CC BY-SA 4.0, via Wikimedia Commons", bn: "ছবি: Vinaykumar8687, CC BY-SA 4.0, Wikimedia Commons" },
    source: "https://xmwintop.en.made-in-china.com/product/SZfGjDBTnhAM/China-Single-Axis-Solar-Tracker-Bracket-Kit.html",
  },
  {
    slug: "underwater-solar",
    category: "ai",
    name: "Underwater & Floating Solar Panels",
    tagline: { en: "Solar on water: no land, cooler panels, less evaporation", bn: "পানির ওপর সোলার: জমি লাগে না, প্যানেল ঠান্ডা থাকে, বাষ্পীভবন কম" },
    description: {
      en: "Floating PV places panels on lakes, reservoirs, ponds and near-coastal water, avoiding land acquisition and bringing generation closer to demand. Water cooling gives a higher energy yield, and over agricultural reservoirs the cover reduces evaporation and can power irrigation pumping. Fully submerged panels are a specialist, low-power option; their efficiency falls as water depth increases.",
      bn: "ফ্লোটিং পিভিতে প্যানেল বসে হ্রদ, জলাধার, পুকুর বা উপকূলের কাছাকাছি পানিতে — জমি অধিগ্রহণ লাগে না, চাহিদার কাছাকাছি উৎপাদন সম্ভব। পানির শীতলকরণে উৎপাদন বাড়ে; কৃষি-জলাধারে প্যানেলের আচ্ছাদন বাষ্পীভবন কমায় এবং সেচের পাম্প চালাতে পারে। পুরোপুরি ডুবন্ত প্যানেল বিশেষ ও কম-শক্তির বিকল্প; পানির গভীরতা বাড়লে এর দক্ষতা কমে।",
    },
    keySpec: { en: "Floating PV on lakes, reservoirs and ponds", bn: "হ্রদ, জলাধার ও পুকুরে ভাসমান পিভি" },
    specs: [
      spec("type", "Floating PV on the water surface; submerged PV for specialist low-power uses"),
      spec("components", "PV modules, floats, anchoring and mooring, cabling, inverters"),
      spec("application", "Lakes, hydropower and agricultural reservoirs, industrial ponds, near-coastal water"),
      spec("scope", "Site and water-body survey, design, supply, installation, commissioning"),
    ],
    highlights: {
      en: ["No land acquisition", "Water cooling raises energy yield", "Reduces evaporation in agricultural reservoirs", "Can power irrigation pumping"],
      bn: ["জমি অধিগ্রহণ লাগে না", "পানির শীতলকরণে উৎপাদন বাড়ে", "কৃষি-জলাধারে বাষ্পীভবন কমে", "সেচের পাম্প চালাতে পারে"],
    },
    warranty: perContract,
    image: "/media/products/underwater-solar.webp",
    // World Bank / ESMAP / SERIS "Where Sun Meets Water" (floating PV) + KFUPM experiment on submerged PV
    // (PV efficiency decreases with water depth; rises as water temperature falls).
    source: "https://www.worldbank.org/en/topic/energy/publication/where-sun-meets-water",
  },
  {
    slug: "solar-tile",
    category: "ai",
    name: "Solar Tile (Metal / Tin Roof Integrated Solar)",
    tagline: { en: "The roof itself generates the power", bn: "ছাদই নিজে বিদ্যুৎ তৈরি করে" },
    description: {
      en: "Solar tiles and metal-roof panels with PV cells built into the roofing surface, so the roof covering and the solar array are one layer instead of panels bolted on top. Suited to homes, shops and farm buildings with tin or metal roofs where a low-profile, tidy finish matters. Each roof is surveyed and specified individually.",
      bn: "সোলার টাইল ও মেটাল-রুফ প্যানেলে পিভি সেল ছাদের উপরিতলেই বসানো থাকে, ফলে ওপরে প্যানেল বসানোর বদলে ছাদের আচ্ছাদন ও সোলার অ্যারে এক স্তরেই হয়। টিন বা মেটাল ছাদের বাসা, দোকান ও খামারঘরে, যেখানে পরিপাটি, কম উচ্চতার ফিনিশ গুরুত্বপূর্ণ, সেখানে উপযোগী। প্রতিটি ছাদ আলাদাভাবে জরিপ করে স্পেসিফাই করা হয়।",
    },
    keySpec: { en: "Roofing and PV in one layer · specified per roof", bn: "ছাদ ও পিভি এক স্তরে · ছাদ অনুযায়ী স্পেসিফিকেশন" },
    specs: [
      spec("type", "Roof-integrated PV tile or steel/metal roof panel with integrated solar cells"),
      spec("material", "Steel or metal roofing base with integrated PV cells"),
      spec("idealFor", "Homes, shops and farm buildings with tin or metal roofs"),
      spec("scope", "Roof survey, layout design, supply, installation and grid or hybrid connection"),
    ],
    highlights: {
      en: ["Roof and solar in one layer", "Low-profile, tidy look", "No separate mounting frame on top of the roof", "Sized to your roof and load"],
      bn: ["ছাদ ও সোলার এক স্তরে", "কম উচ্চতার, পরিপাটি চেহারা", "ছাদের ওপর আলাদা মাউন্টিং ফ্রেম লাগে না", "আপনার ছাদ ও লোড অনুযায়ী সাইজ"],
    },
    warranty: perContract,
    image: "/media/products/solar-tile.webp",
    // No client URL; no manufacturer datasheet used, so no figures. Needs a datasheet from the chosen supplier.
  },

  {
    slug: "self-cleaning-solar",
    category: "commercial",
    name: "Self-Cleaning Solar System",
    tagline: { en: "Cleaner panels, less washing, steadier output", bn: "পরিষ্কার প্যানেল, কম ধোয়া, স্থির উৎপাদন" },
    description: {
      en: "Dust and dirt on panel glass cut output, especially in dry, dusty conditions. A self-cleaning system pairs a hydrophobic anti-soiling glass coating, which makes rain bead up and roll off with loose dust, with optional automated cleaning for sites that need more. In a Duke University experiment on coated glass slides, soiling fell by 31%, and by 50% when dew was suppressed.",
      bn: "প্যানেলের কাচে ধুলো-ময়লা জমলে উৎপাদন কমে, বিশেষ করে শুকনো ও ধুলোময় পরিবেশে। সেল্ফ-ক্লিনিং সিস্টেমে হাইড্রোফোবিক অ্যান্টি-সয়লিং গ্লাস কোটিং থাকে, যাতে বৃষ্টির পানি ফোঁটা হয়ে ধুলোসহ গড়িয়ে পড়ে; আরও প্রয়োজনে স্বয়ংক্রিয় ক্লিনিং যোগ করা যায়। ডিউক বিশ্ববিদ্যালয়ের এক পরীক্ষায় কোটেড গ্লাস স্লাইডে ময়লা জমা ৩১% এবং শিশির আটকালে ৫০% কমেছে।",
    },
    keySpec: { en: "Hydrophobic anti-soiling coating · optional automated cleaning", bn: "হাইড্রোফোবিক অ্যান্টি-সয়লিং কোটিং · ঐচ্ছিক স্বয়ংক্রিয় ক্লিনিং" },
    specs: [
      spec("components", "Hydrophobic anti-soiling glass coating; optional robotic or automated cleaning"),
      spec("idealFor", "Utility and commercial plants in dusty or low-rainfall areas, hard-to-reach rooftops"),
      spec("scope", "Site soiling assessment, coating or cleaning-system selection, installation"),
    ],
    highlights: {
      en: ["Rain carries loose dust away", "Less manual washing", "Steadier energy output", "Combines with robotic cleaning"],
      bn: ["বৃষ্টিতে আলগা ধুলো ধুয়ে যায়", "হাতে ধোয়া কম", "স্থির বিদ্যুৎ উৎপাদন", "রোবটিক ক্লিনিংয়ের সঙ্গে যুক্ত করা যায়"],
    },
    warranty: perContract,
    image: "/media/products/self-cleaning-solar.webp",
    imageCredit: { en: "Photo: Oregon Department of Transportation, CC BY 2.0, via Wikimedia Commons", bn: "ছবি: Oregon Department of Transportation, CC BY 2.0, Wikimedia Commons" },
    // Figures: Duke University (Bergin lab) study of hydrophobic coating on slides: 31 ± 15% soiling reduction,
    // 50 ± 13% with dew suppression. Image requires credit (CC BY 2.0): Oregon Department of Transportation.
    source: "https://bergin.pratt.duke.edu/publications/reduction-solar-pv-soiling-loss-using-hydrophobic-coating-and-without-dew-suppression",
  },
  {
    slug: "wind-solar-hybrid-system",
    category: "commercial",
    name: "Wind–Solar Hybrid Power Generation System",
    tagline: { en: "Harnessing the power of the sun and wind", bn: "সূর্য ও বাতাসের শক্তি একসাথে কাজে লাগানো" },
    description: {
      en: "What happens when sunlight is insufficient for solar panels or wind speeds are too low for wind turbines? A Wind–Solar Hybrid Power Generation System offers an effective solution by combining solar photovoltaic (PV) panels and wind turbines to harness two renewable energy sources in one integrated system. Since solar and wind resources can complement each other under varying weather conditions, this hybrid system helps improve energy availability and reduce dependence on a single power source. By integrating intelligent power management, battery storage, and backup solutions where required, it can deliver a more reliable and sustainable electricity supply.",
      bn: "সূর্যের আলো যখন সোলার প্যানেলের জন্য যথেষ্ট নয়, বা বাতাসের গতি উইন্ড টারবাইনের জন্য খুব কম, তখন কী হবে? উইন্ড–সোলার হাইব্রিড পাওয়ার জেনারেশন সিস্টেম সোলার ফটোভোল্টাইক (পিভি) প্যানেল ও উইন্ড টারবাইন একসাথে যুক্ত করে দুটি নবায়নযোগ্য উৎসের শক্তি একটি সমন্বিত সিস্টেমে কাজে লাগায়। বিভিন্ন আবহাওয়ায় সোলার ও বাতাস একে অপরের পরিপূরক হতে পারে, ফলে এই হাইব্রিড সিস্টেম বিদ্যুতের প্রাপ্যতা বাড়ায় এবং একক উৎসের ওপর নির্ভরতা কমায়। ইন্টেলিজেন্ট পাওয়ার ম্যানেজমেন্ট, ব্যাটারি স্টোরেজ এবং প্রয়োজনে ব্যাকআপ সমাধান যুক্ত করে এটি আরও নির্ভরযোগ্য ও টেকসই বিদ্যুৎ সরবরাহ দিতে পারে।",
    },
    keySpec: { en: "Solar PV + wind turbine · battery storage · intelligent management", bn: "সোলার পিভি + উইন্ড টারবাইন · ব্যাটারি স্টোরেজ · ইন্টেলিজেন্ট ম্যানেজমেন্ট" },
    specs: [
      spec("components", "Solar PV panels, wind turbines, intelligent power management, battery storage, backup where required"),
      spec("type", "Wind–solar hybrid, off-grid capable"),
      spec("capacity", "Designed to the energy demand, system capacity and site conditions"),
      spec("idealFor", "Remote communities, factories, farms, telecom towers, coastal areas and islands, commercial buildings"),
    ],
    highlights: {
      en: [
        "Complementary energy generation: combines solar and wind power to maximise the use of available renewable energy",
        "Improved power reliability: reduces reliance on a single energy source when sunlight or wind availability fluctuates",
        "Battery storage integration: stores excess electricity for periods of low solar and wind generation",
        "Reduced electricity costs: helps reduce dependence on grid electricity and conventional fuel-powered generators",
        "Clean and sustainable energy: generates electricity from renewable resources, helping reduce carbon emissions and environmental impact",
        "Flexible system configuration: can be designed to meet different energy demands, system capacities and site conditions",
        "Off-grid capability: a practical power solution where conventional grid electricity is unavailable or unreliable",
        "Intelligent energy management: coordinates solar generation, wind generation, battery charging and connected loads",
        "Scalable design: can be configured for small installations or larger commercial and industrial applications",
      ],
      bn: [
        "পরিপূরক শক্তি উৎপাদন: সোলার ও বাতাসের শক্তি মিলিয়ে উপলব্ধ নবায়নযোগ্য শক্তির সর্বোচ্চ ব্যবহার",
        "বিদ্যুতের নির্ভরযোগ্যতা বৃদ্ধি: রোদ বা বাতাসের প্রাপ্যতা ওঠানামা করলেও একক উৎসের ওপর নির্ভরতা কমে",
        "ব্যাটারি স্টোরেজ সংযোজন: সোলার ও বাতাসের উৎপাদন কম থাকার সময়ের জন্য বাড়তি বিদ্যুৎ জমা রাখে",
        "বিদ্যুৎ খরচ কম: গ্রিড বিদ্যুৎ ও প্রচলিত জ্বালানিচালিত জেনারেটরের ওপর নির্ভরতা কমাতে সাহায্য করে",
        "পরিচ্ছন্ন ও টেকসই শক্তি: নবায়নযোগ্য উৎস থেকে বিদ্যুৎ তৈরি করে কার্বন নিঃসরণ ও পরিবেশের ক্ষতি কমায়",
        "নমনীয় সিস্টেম কনফিগারেশন: বিভিন্ন বিদ্যুৎ চাহিদা, সিস্টেম ক্ষমতা ও সাইটের অবস্থা অনুযায়ী ডিজাইন করা যায়",
        "অফ-গ্রিড সক্ষমতা: যেখানে গ্রিড বিদ্যুৎ নেই বা নির্ভরযোগ্য নয়, সেখানে বাস্তবসম্মত সমাধান",
        "ইন্টেলিজেন্ট এনার্জি ম্যানেজমেন্ট: সোলার উৎপাদন, বাতাসের উৎপাদন, ব্যাটারি চার্জিং ও সংযুক্ত লোড সমন্বয় করে",
        "স্কেলযোগ্য ডিজাইন: ছোট স্থাপনা থেকে বড় বাণিজ্যিক ও শিল্প ব্যবহার পর্যন্ত কনফিগার করা যায়",
      ],
    },
    applications: {
      en: [
        "Remote and off-grid communities",
        "Factories and industrial facilities",
        "Agricultural farms and irrigation systems",
        "Telecommunications towers and remote monitoring stations",
        "Coastal areas, islands and isolated locations",
        "Commercial buildings and rural enterprises",
        "Facilities requiring a dependable renewable energy supply",
      ],
      bn: [
        "দূরবর্তী ও অফ-গ্রিড জনপদ",
        "কারখানা ও শিল্প স্থাপনা",
        "কৃষি খামার ও সেচ ব্যবস্থা",
        "টেলিযোগাযোগ টাওয়ার ও দূরবর্তী পর্যবেক্ষণ কেন্দ্র",
        "উপকূলীয় এলাকা, দ্বীপ ও বিচ্ছিন্ন স্থান",
        "বাণিজ্যিক ভবন ও গ্রামীণ উদ্যোগ",
        "নির্ভরযোগ্য নবায়নযোগ্য বিদ্যুৎ সরবরাহ দরকার এমন স্থাপনা",
      ],
    },
    warranty: perContract,
    image: "/media/products/wind-solar-hybrid.webp",
  },
  /* ============================ SOLAR COMBO PACKAGES ============================ */
  {
    slug: "combo-1-24kw-hybrid-solar",
    category: "combo",
    name: "1.24kW OSLEOS Hybrid Solar Setup",
    tagline: { en: "Compact, affordable backup power for small homes", bn: "ছোট বাসার জন্য কমপ্যাক্ট ও সাশ্রয়ী ব্যাকআপ বিদ্যুৎ" },
    description: {
      en: "A compact and affordable solar power solution designed for small homes and essential appliances. The 1.24kW OSLEOS Solar Setup provides reliable backup power for daily household needs while reducing dependency on grid electricity.",
      bn: "ছোট বাসা ও জরুরি যন্ত্রপাতির জন্য কমপ্যাক্ট ও সাশ্রয়ী সোলার পাওয়ার সমাধান। ১.২৪ কিলোওয়াট OSLEOS সোলার সেটআপ দৈনন্দিন ঘরোয়া প্রয়োজনে নির্ভরযোগ্য ব্যাকআপ দেয় এবং গ্রিড বিদ্যুতের ওপর নির্ভরতা কমায়।",
    },
    keySpec: { en: "1.24 kW · 12V hybrid · 1.28 kWh lithium", bn: "১.২৪ কিলোওয়াট · ১২ভি হাইব্রিড · ১.২৮ kWh লিথিয়াম" },
    specs: [
      spec("capacity", "1.24 kW solar (2 × 620W)"),
      spec("panels", "2 × Jinko 620W high-efficiency panels"),
      spec("inverter", "SAKO E-SUN 1.2kVA 12V hybrid inverter"),
      spec("battery", "SAKO 12V 100Ah LiFePO₄ lithium, about 1.28 kWh"),
      spec("application", "Budget Solar | Home Solar | Residential Solar"),
    ],
    highlights: {
      en: [
        "High-efficiency Jinko solar panels for better energy generation",
        "Hybrid inverter support for solar and backup power management",
        "Lithium battery technology for longer lifespan and better performance",
        "Compact design suitable for residential applications",
        "Low maintenance and easy operation",
        "Expandable system capacity for future upgrades",
      ],
      bn: [
        "ভালো উৎপাদনের জন্য উচ্চদক্ষতার জিংকো সোলার প্যানেল",
        "সোলার ও ব্যাকআপ পাওয়ার ব্যবস্থাপনার জন্য হাইব্রিড ইনভার্টার",
        "দীর্ঘ আয়ু ও ভালো পারফরম্যান্সের জন্য লিথিয়াম ব্যাটারি",
        "আবাসিক ব্যবহারের উপযোগী কমপ্যাক্ট ডিজাইন",
        "কম রক্ষণাবেক্ষণ ও সহজ পরিচালনা",
        "ভবিষ্যতে সিস্টেম ক্ষমতা বাড়ানোর সুযোগ",
      ],
    },
    warranty: {
      en: "Panels: 12-year product, 30-year power · Inverter: 2 years · Battery: 5 years",
      bn: "প্যানেল: ১২ বছর প্রোডাক্ট, ৩০ বছর পাওয়ার · ইনভার্টার: ২ বছর · ব্যাটারি: ৫ বছর",
    },
    image: "/media/products/combo-1.webp",
    imageFit: "contain",
    combo: {
      price: { regular: 120000, offer: 115000 },
      suitableFor: { en: ["Budget Solar", "Home Solar", "Residential Solar"], bn: ["বাজেট সোলার", "হোম সোলার", "আবাসিক সোলার"] },
      includes: {
        en: [
          "2 × Jinko 620W high-efficiency solar panels (product warranty 12 years, power warranty 30 years)",
          "1 × 12V 1.2kW hybrid inverter: SAKO E-SUN 1.2kVA (warranty 2 years)",
          "1 × 12V 100Ah lithium battery: SAKO LiFePO₄, about 1.28kWh (warranty 5 years)",
          "Complete installation accessories (optional)",
          "Professional installation support (where applicable)",
        ],
        bn: [
          "২ × জিংকো ৬২০ ওয়াট উচ্চদক্ষতার সোলার প্যানেল (প্রোডাক্ট ওয়ারেন্টি ১২ বছর, পাওয়ার ওয়ারেন্টি ৩০ বছর)",
          "১ × ১২ভি ১.২ কিলোওয়াট হাইব্রিড ইনভার্টার: SAKO E-SUN 1.2kVA (ওয়ারেন্টি ২ বছর)",
          "১ × ১২ভি ১০০Ah লিথিয়াম ব্যাটারি: SAKO LiFePO₄, প্রায় ১.২৮ kWh (ওয়ারেন্টি ৫ বছর)",
          "ইনস্টলেশনের সম্পূর্ণ সরঞ্জাম (ঐচ্ছিক)",
          "পেশাদার ইনস্টলেশন সহায়তা (যেখানে প্রযোজ্য)",
        ],
      },
      idealFor: {
        en: ["LED lights", "Ceiling fans", "Wi-Fi router", "LED TV", "Laptop/desktop computer", "CCTV system", "Refrigerator", "Small household appliances (within system capacity)"],
        bn: ["এলইডি বাতি", "সিলিং ফ্যান", "ওয়াই-ফাই রাউটার", "এলইডি টিভি", "ল্যাপটপ/ডেস্কটপ কম্পিউটার", "সিসিটিভি সিস্টেম", "রেফ্রিজারেটর", "ছোট ঘরোয়া যন্ত্রপাতি (সিস্টেমের ক্ষমতার মধ্যে)"],
      },
      benefits: {
        en: ["Reduce monthly electricity bills", "Reliable backup during power interruptions", "Clean and renewable energy solution", "Lower operating and maintenance costs", "Suitable for homes, small offices and essential loads"],
        bn: ["মাসিক বিদ্যুৎ বিল কমে", "বিদ্যুৎ বিভ্রাটে নির্ভরযোগ্য ব্যাকআপ", "পরিচ্ছন্ন ও নবায়নযোগ্য জ্বালানি সমাধান", "পরিচালন ও রক্ষণাবেক্ষণ খরচ কম", "বাসা, ছোট অফিস ও জরুরি লোডের উপযোগী"],
      },
    },
  },
  {
    slug: "combo-6-2kw-smart-hybrid-luxury",
    category: "combo",
    name: "6.2kW OSLEOS Smart Hybrid Luxury Solar Setup",
    tagline: { en: "Premium 6.2kW smart hybrid system with 5.12kWh storage", bn: "৫.১২ kWh স্টোরেজসহ প্রিমিয়াম ৬.২ কিলোওয়াট স্মার্ট হাইব্রিড সিস্টেম" },
    description: {
      en: "A premium hybrid solar package built around ten Jinko Tiger Neo 620W panels, a 6kW smart hybrid inverter and a 48V 100Ah LiFePO₄ lithium battery of about 5.12kWh, for properties that need higher capacity and longer backup.",
      bn: "দশটি জিংকো টাইগার নিও ৬২০ ওয়াট প্যানেল, ৬ কিলোওয়াট স্মার্ট হাইব্রিড ইনভার্টার ও প্রায় ৫.১২ kWh-এর ৪৮ভি ১০০Ah LiFePO₄ লিথিয়াম ব্যাটারি নিয়ে প্রিমিয়াম হাইব্রিড সোলার প্যাকেজ, যেসব স্থাপনায় বেশি ক্ষমতা ও দীর্ঘ ব্যাকআপ দরকার।",
    },
    keySpec: { en: "6.2 kW · 6kW smart hybrid · 5.12 kWh lithium", bn: "৬.২ কিলোওয়াট · ৬ কিলোওয়াট স্মার্ট হাইব্রিড · ৫.১২ kWh লিথিয়াম" },
    specs: [
      spec("capacity", "6.2 kW solar (10 × 620W)"),
      spec("panels", "10 × Jinko Tiger Neo 620W"),
      spec("inverter", "6kW smart hybrid inverter: Deye SUN-6K-SG series"),
      spec("battery", "48V 100Ah LiFePO₄ lithium, about 5.12 kWh"),
    ],
    highlights: {
      en: ["6.2kW of Jinko Tiger Neo solar panels", "6kW smart hybrid inverter (Deye SUN-6K-SG series)", "About 5.12kWh of LiFePO₄ lithium storage", "Premium brand components"],
      bn: ["৬.২ কিলোওয়াট জিংকো টাইগার নিও সোলার প্যানেল", "৬ কিলোওয়াট স্মার্ট হাইব্রিড ইনভার্টার (Deye SUN-6K-SG সিরিজ)", "প্রায় ৫.১২ kWh LiFePO₄ লিথিয়াম স্টোরেজ", "প্রিমিয়াম ব্র্যান্ডের কম্পোনেন্ট"],
    },
    image: "/media/products/combo-2.webp",
    imageFit: "contain",
    combo: {
      price: { offer: 650000 },
      includes: {
        en: ["10 × Jinko Tiger Neo 620W high-efficiency solar panels", "1 × 6kW smart hybrid inverter (Deye SUN-6K-SG series)", "1 × 48V 100Ah LiFePO₄ lithium battery (about 5.12kWh)"],
        bn: ["১০ × জিংকো টাইগার নিও ৬২০ ওয়াট উচ্চদক্ষতার সোলার প্যানেল", "১ × ৬ কিলোওয়াট স্মার্ট হাইব্রিড ইনভার্টার (Deye SUN-6K-SG সিরিজ)", "১ × ৪৮ভি ১০০Ah LiFePO₄ লিথিয়াম ব্যাটারি (প্রায় ৫.১২ kWh)"],
      },
    },
  },
  {
    slug: "combo-6-2kw-smart-hybrid-basic",
    category: "combo",
    name: "6.2kW OSLEOS Smart Hybrid Basic Solar Setup",
    tagline: { en: "6.2kW smart hybrid system, expandable storage", bn: "৬.২ কিলোওয়াট স্মার্ট হাইব্রিড সিস্টেম, বাড়ানো যায় এমন স্টোরেজ" },
    description: {
      en: "A 6.2kW hybrid solar package with ten Trina Solar 620W panels, a 6kW 48V hybrid inverter and a 51.2V 100Ah lithium battery of about 5.12kWh. Storage can be increased by adding two more batteries.",
      bn: "দশটি ট্রিনা সোলার ৬২০ ওয়াট প্যানেল, ৬ কিলোওয়াট ৪৮ভি হাইব্রিড ইনভার্টার ও প্রায় ৫.১২ kWh-এর ৫১.২ভি ১০০Ah লিথিয়াম ব্যাটারিসহ ৬.২ কিলোওয়াট হাইব্রিড সোলার প্যাকেজ। আরও দুটি ব্যাটারি যোগ করে স্টোরেজ বাড়ানো যায়।",
    },
    keySpec: { en: "6.2 kW · 6kW hybrid · 5.12 kWh lithium", bn: "৬.২ কিলোওয়াট · ৬ কিলোওয়াট হাইব্রিড · ৫.১২ kWh লিথিয়াম" },
    specs: [
      spec("capacity", "6.2 kW solar (10 × 620W)"),
      spec("panels", "10 × Trina Solar 620W"),
      spec("inverter", "6kW 48V hybrid inverter: Crown Micro (Axpert / Elego / VMGI 6kW 48V)"),
      spec("battery", "LVTOPSUN 51.2V 100Ah rack/wall-mount lithium, about 5.12 kWh"),
    ],
    highlights: {
      en: ["6.2kW of Trina Solar panels", "6kW 48V hybrid inverter (Crown Micro)", "About 5.12kWh of lithium storage", "Add 2 more batteries to increase capacity (price varies)"],
      bn: ["৬.২ কিলোওয়াট ট্রিনা সোলার প্যানেল", "৬ কিলোওয়াট ৪৮ভি হাইব্রিড ইনভার্টার (Crown Micro)", "প্রায় ৫.১২ kWh লিথিয়াম স্টোরেজ", "আরও ২টি ব্যাটারি যোগ করে ক্ষমতা বাড়ানো যায় (দাম আলাদা)"],
    },
    image: "/media/products/combo-3.webp",
    imageFit: "contain",
    combo: {
      price: { offer: 399000 },
      includes: {
        en: ["10 × Trina Solar 620W solar panels", "1 × 6kW 48V hybrid inverter: Crown Micro (Axpert / Elego / VMGI 6kW 48V)", "1 × LVTOPSUN 51.2V 100Ah rackmount or wallmount lithium battery (about 5.12kWh)"],
        bn: ["১০ × ট্রিনা সোলার ৬২০ ওয়াট সোলার প্যানেল", "১ × ৬ কিলোওয়াট ৪৮ভি হাইব্রিড ইনভার্টার: Crown Micro (Axpert / Elego / VMGI 6kW 48V)", "১ × LVTOPSUN ৫১.২ভি ১০০Ah র‍্যাকমাউন্ট বা ওয়ালমাউন্ট লিথিয়াম ব্যাটারি (প্রায় ৫.১২ kWh)"],
      },
      customise: { en: "You can add 2 batteries to increase the capacity (price will vary).", bn: "ক্ষমতা বাড়াতে ২টি ব্যাটারি যোগ করা যায় (দাম আলাদা হবে)।" },
    },
  },
  {
    slug: "combo-2-48kw-home-hybrid",
    category: "combo",
    name: "2.48kW OSLEOS Home Hybrid Solar Setup",
    tagline: { en: "Hybrid solar for medium family homes", bn: "মাঝারি পরিবারের বাসার জন্য হাইব্রিড সোলার" },
    description: {
      en: "A 2.48kW home hybrid package with four Trina Vertex N 620W bifacial panels, a 3kW 48V hybrid inverter and a 51.2V 100Ah lithium battery of about 5.12kWh, sized for medium family homes.",
      bn: "চারটি ট্রিনা ভার্টেক্স N ৬২০ ওয়াট বাইফেসিয়াল প্যানেল, ৩ কিলোওয়াট ৪৮ভি হাইব্রিড ইনভার্টার ও প্রায় ৫.১২ kWh-এর ৫১.২ভি ১০০Ah লিথিয়াম ব্যাটারিসহ ২.৪৮ কিলোওয়াট হোম হাইব্রিড প্যাকেজ, মাঝারি পরিবারের বাসার জন্য।",
    },
    keySpec: { en: "2.48 kW · 3kW hybrid · 5.12 kWh lithium", bn: "২.৪৮ কিলোওয়াট · ৩ কিলোওয়াট হাইব্রিড · ৫.১২ kWh লিথিয়াম" },
    specs: [
      spec("capacity", "2.48 kW solar (4 × 620W)"),
      spec("panels", "4 × Trina Vertex N 620W bifacial"),
      spec("inverter", "3kW 48V hybrid inverter: Growatt SPF 3500 ES (3.5kW, 48V off-grid hybrid)"),
      spec("battery", "LVTOPSUN 51.2V 100Ah rack/wall-mount lithium, about 5.12 kWh"),
      spec("idealFor", "Medium family homes"),
    ],
    highlights: {
      en: ["2.48kW of Trina bifacial solar panels", "3kW 48V hybrid inverter (Growatt SPF 3500 ES)", "About 5.12kWh of lithium storage", "Runs fans, lights, fridge, TV, computer and CCTV"],
      bn: ["২.৪৮ কিলোওয়াট ট্রিনা বাইফেসিয়াল সোলার প্যানেল", "৩ কিলোওয়াট ৪৮ভি হাইব্রিড ইনভার্টার (Growatt SPF 3500 ES)", "প্রায় ৫.১২ kWh লিথিয়াম স্টোরেজ", "ফ্যান, বাতি, ফ্রিজ, টিভি, কম্পিউটার ও সিসিটিভি চালায়"],
    },
    image: "/media/products/combo-4.webp",
    imageFit: "contain",
    combo: {
      price: { offer: 299000 },
      includes: {
        en: ["4 × Trina Vertex N 620W bifacial solar panels", "1 × 3kW 48V hybrid inverter: Growatt SPF 3500 ES 3.5kW 48V off-grid hybrid", "1 × LVTOPSUN 51.2V 100Ah rackmount or wallmount lithium battery (about 5.12kWh)"],
        bn: ["৪ × ট্রিনা ভার্টেক্স N ৬২০ ওয়াট বাইফেসিয়াল সোলার প্যানেল", "১ × ৩ কিলোওয়াট ৪৮ভি হাইব্রিড ইনভার্টার: Growatt SPF 3500 ES ৩.৫ কিলোওয়াট ৪৮ভি অফ-গ্রিড হাইব্রিড", "১ × LVTOPSUN ৫১.২ভি ১০০Ah র‍্যাকমাউন্ট বা ওয়ালমাউন্ট লিথিয়াম ব্যাটারি (প্রায় ৫.১২ kWh)"],
      },
      idealFor: {
        en: ["Medium family homes", "6–10 fans", "15–20 LED lights", "Refrigerator", "TV", "Computer", "CCTV", "1 ton inverter AC (limited backup)"],
        bn: ["মাঝারি পরিবারের বাসা", "৬–১০টি ফ্যান", "১৫–২০টি এলইডি বাতি", "রেফ্রিজারেটর", "টিভি", "কম্পিউটার", "সিসিটিভি", "১ টনের ইনভার্টার এসি (সীমিত ব্যাকআপ)"],
      },
    },
  },
];

/**
 * Items with no manufacturer brand are sold under the OSLEOS brand (client request,
 * Oct 2026). A few items stay unbranded because their photos carry a third-party
 * logo (cleaning robot, breakage sensor).
 */
export const OSLEOS_BRAND = "OSLEOS";
const KEEP_UNBRANDED = new Set(["robotic-panel-cleaning", "panel-breakage-sensors"]);
export const products: Product[] = catalogue.map((p) =>
  p.brand || KEEP_UNBRANDED.has(p.slug) ? p : { ...p, brand: OSLEOS_BRAND },
);

/** Headings for the combo-package block on the product page (en + bn; other languages fall back to English). */
export const comboText = {
  price: { en: "Package price", bn: "প্যাকেজের দাম" },
  save: { en: "Save", bn: "সাশ্রয়" },
  applications: { en: "Ideal applications", bn: "উপযোগী ক্ষেত্র" },
  priceNote: { en: "Final price is confirmed in your written quotation.", bn: "চূড়ান্ত দাম আপনার লিখিত কোটেশনে নিশ্চিত করা হবে।" },
  suitableFor: { en: "Applicable for", bn: "যাদের জন্য" },
  includes: { en: "Package includes", bn: "প্যাকেজে যা যা আছে" },
  idealFor: { en: "Ideal for", bn: "যেসবের জন্য উপযোগী" },
  benefits: { en: "Benefits", bn: "সুবিধা" },
  transportLabel: { en: "Transportation", bn: "পরিবহন" },
  transport: { en: "Transportation cost: subject to discussion.", bn: "পরিবহন খরচ: আলোচনা সাপেক্ষে।" },
  customise: { en: "You can also customise the package according to your needs.", bn: "আপনার প্রয়োজন অনুযায়ী প্যাকেজ কাস্টমাইজ করা যাবে।" },
} satisfies Record<string, Localized>;

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const featuredProducts = () => products.filter((p) => p.featured).slice(0, 4);
/** Brands in catalogue order, for filter chips. */
export const brands = [...new Set(products.flatMap((p) => (p.brand ? [p.brand] : [])))];
