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
  whatsapp: "8801711752202",
  whatsappDisplay: "+880 1711-752202",
  address,
  /** Google Maps pin for the office, supplied by the client (an address search landed on the wrong spot). */
  mapsUrl: "https://maps.app.goo.gl/cfncX3g2yELo3r1E8?g_st=iw",
  /** Embedded map of the same pin (coordinates resolved from the link above). */
  mapsEmbedUrl: "https://maps.google.com/maps?q=23.7586356,90.4184124(OSLEOS)&z=17&output=embed",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61594452931737",
    instagram: "https://www.instagram.com/osleoshq/",
    linkedin: "https://www.linkedin.com/company/143899860/",
    youtube: "https://www.youtube.com/@osleoshq",
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

/** wa.me link for a WhatsApp number (digits only, with country code). */
export const waLink = (digits: string, text?: string) => `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const whatsappLink = (text?: string) => waLink(site.whatsapp, text);

/**
 * The contact part of `site`, which the client can change in the admin
 * (Contact page). Server code reads the live values with getSite() from
 * src/lib/site-content.ts; client components with useSite().
 */
export type SiteContact = {
  phones: readonly { display: string; href: string }[];
  phone: string;
  phoneHref: string;
  email: string;
  whatsapp: string;
  whatsappDisplay: string;
  address: { en: string; bn: string };
  mapsUrl: string;
  mapsEmbedUrl: string;
  social: { facebook: string; instagram: string; linkedin: string; youtube: string };
};

export type SiteInfo = Omit<typeof site, keyof SiteContact> & SiteContact & { whatsappLink: (text?: string) => string };

export const telHref = (display: string) => `tel:${display.replace(/[^\d+]/g, "")}`;

/** `site` with the given contact details (the static ones when none are given). */
export function withContact(contact?: Partial<SiteContact>): SiteInfo {
  const merged = { ...site, ...contact };
  return { ...merged, whatsappLink: (text?: string) => waLink(merged.whatsapp, text) };
}

/** Just the contact fields (plain data, safe to pass to client components). */
export const contactOf = (s: SiteInfo): SiteContact => ({
  phones: s.phones,
  phone: s.phone,
  phoneHref: s.phoneHref,
  email: s.email,
  whatsapp: s.whatsapp,
  whatsappDisplay: s.whatsappDisplay,
  address: s.address,
  mapsUrl: s.mapsUrl,
  mapsEmbedUrl: s.mapsEmbedUrl,
  social: s.social,
});
