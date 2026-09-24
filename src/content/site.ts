/**
 * Company-wide details. Everything here is a PLACEHOLDER until the client
 * confirms real values — see docs/TODO.md ("Client থেকে লাগবে").
 */
export const site = {
  name: "OSLEOS",
  url: "https://osleos.com",
  /** Shows a small "draft preview" ribbon and "sample" tags on placeholder content. */
  draft: true,
  phone: "+880 1XXX-XXXXXX",
  phoneHref: "tel:+8801000000000",
  email: "info@osleos.com",
  /** Digits only, with country code — used for wa.me links. */
  whatsapp: "971509569576",
  whatsappDisplay: "+971 50 956 9576",
  address: {
    en: "House XX, Road XX, Gulshan-2, Dhaka 1212, Bangladesh",
    bn: "বাড়ি XX, রোড XX, গুলশান-২, ঢাকা ১২১২, বাংলাদেশ",
  },
  social: {
    facebook: "https://www.facebook.com/",
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
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
