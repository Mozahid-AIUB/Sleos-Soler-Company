/**
 * Company-wide details (confirmed by the client). Change contact details here
 * only — header, footer, contact, support and links pages all read from it.
 */
const phones = [
  { display: "+880 1711-752202", href: "tel:+8801711752202" },
  { display: "+880 1323-934442", href: "tel:+8801323934442" },
] as const;

const address = {
  en: "Tanjima Villa, 31/1, Lift-2, Flat-C2 (2nd Floor), East Hazipara, Rampura, Dhaka-1219, Bangladesh",
  bn: "তানজিমা ভিলা, ৩১/১, লিফট-২, ফ্ল্যাট-সি২ (২য় তলা), পূর্ব হাজীপাড়া, রামপুরা, ঢাকা-১২১৯, বাংলাদেশ",
} as const;

export const site = {
  name: "OSLEOS",
  url: "https://osleos.com",
  /** Shows a small "draft preview" ribbon and "sample" tags on placeholder content. */
  draft: true,
  /** Years the company has been delivering solutions (per client, not the brochure's "20"). */
  years: 15,
  phones,
  /** Primary number — kept for components that only show one. */
  phone: phones[0].display,
  phoneHref: phones[0].href,
  email: "info@osleos.com",
  /** Digits only, with country code — used for wa.me links. */
  whatsapp: "971509569576",
  whatsappDisplay: "+971 50 956 9576",
  address,
  /** Google Maps search for the office address. */
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.en)}`,
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61594452931737",
    instagram: "https://www.instagram.com/osleoshq/",
    linkedin: "https://www.linkedin.com/company/143899860/",
  },
  certifications: [
    "SREDA Approved",
    "BSTI Certified",
    "IEC 61215",
    "IEC 61730",
    "UL 61730",
    "ISO 9001",
    "ISO 14001",
    "TÜV Rheinland",
    "Tier-1 BNEF",
  ],
} as const;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
