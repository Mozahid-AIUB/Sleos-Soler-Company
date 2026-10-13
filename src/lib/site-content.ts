import "server-only";
import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import { site, telHref, withContact, type SiteContact, type SiteInfo } from "@/content/site";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";

/*
 * Texts the client edits in the admin as single pages (Payload globals):
 * Contact (phones, email, address, social links, Contact page heading) and
 * Solutions (the Solutions page). Same safety net as src/lib/catalog.ts: when
 * the database is missing or down, the built-in texts are used unchanged.
 *
 * Only English and Bangla are edited in the admin; the Chinese, Spanish and
 * French pages keep their built-in texts (contact details still apply to all).
 */

type Loose = Record<string, unknown>;
type CmsLang = "en" | "bn";
type Globals = { contact: Loose; solutions: Loose };

const DB_TIMEOUT_MS = 15_000;
const RETRY_AFTER_MS = 30_000;
let retryAt = 0;

const isObj = (v: unknown): v is Loose => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const rows = (v: unknown): Loose[] => (Array.isArray(v) ? v.filter(isObj) : []);
const lineList = (v: unknown): string[] => rows(v).map((r) => str(r.text)).filter(Boolean);

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`site-content: database did not answer within ${ms / 1000}s`)), ms);
    promise.then(
      (v) => (clearTimeout(timer), resolve(v)),
      (e) => (clearTimeout(timer), reject(e)),
    );
  });
}

/** Both globals in one language (English fills any Bangla gaps); null when the database is not available. */
const loadGlobals = cache(async (lang: CmsLang): Promise<Globals | null> => {
  if (!process.env.DATABASE_URI || Date.now() < retryAt) return null;
  try {
    const payload = await getPayload({ config });
    const [contact, solutions] = await withTimeout(
      Promise.all([
        payload.findGlobal({ slug: "contact", locale: lang, fallbackLocale: "en", depth: 0 }),
        payload.findGlobal({ slug: "solutions-page", locale: lang, fallbackLocale: "en", depth: 0 }),
      ]),
      DB_TIMEOUT_MS,
    );
    retryAt = 0;
    return { contact: contact as unknown as Loose, solutions: solutions as unknown as Loose };
  } catch (error) {
    retryAt = Date.now() + RETRY_AFTER_MS;
    console.warn("[site-content] database unavailable; using the built-in texts:", error instanceof Error ? error.message : error);
    return null;
  }
});

/** Google Maps embed for "lat, lng" (the pin the client copies from Google Maps). */
function embedFor(pin: string): string | undefined {
  const m = pin.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  return m ? `https://maps.google.com/maps?q=${m[1]},${m[2]}(OSLEOS)&z=17&output=embed` : undefined;
}

function readContact(en: Loose | undefined, bn: Loose | undefined): Partial<SiteContact> {
  if (!en) return {};
  const out: Partial<SiteContact> = {};
  const phones = rows(en.phones)
    .map((r) => str(r.number))
    .filter(Boolean)
    .map((display) => ({ display, href: telHref(display) }));
  if (phones.length) Object.assign(out, { phones, phone: phones[0].display, phoneHref: phones[0].href });
  const wa = str(en.whatsapp);
  if (wa.replace(/\D/g, "").length >= 8) Object.assign(out, { whatsapp: wa.replace(/\D/g, ""), whatsappDisplay: wa });
  if (str(en.email)) out.email = str(en.email);
  const addrEn = str(en.address);
  const addrBn = str(bn?.address);
  if (addrEn || addrBn) out.address = { en: addrEn || site.address.en, bn: addrBn || addrEn || site.address.bn };
  if (str(en.mapLink)) out.mapsUrl = str(en.mapLink);
  const embed = embedFor(str(en.mapPin));
  if (embed) out.mapsEmbedUrl = embed;
  out.social = {
    facebook: str(en.facebook) || site.social.facebook,
    instagram: str(en.instagram) || site.social.instagram,
    linkedin: str(en.linkedin) || site.social.linkedin,
    youtube: str(en.youtube) || site.social.youtube,
  };
  return out;
}

/** Company details with the contact part from the admin (Contact page). */
export const getSite = cache(async (): Promise<SiteInfo> => {
  const [en, bn] = await Promise.all([loadGlobals("en"), loadGlobals("bn")]);
  return withContact(readContact(en?.contact, bn?.contact));
});

/** Replace `target[key]` only when the admin has a value. */
function set<T extends object, K extends keyof T>(target: T, key: K, value: T[K] | "" | undefined) {
  if (value === "" || value === undefined || (Array.isArray(value) && value.length === 0)) return;
  target[key] = value as T[K];
}

/** The language's built-in texts with the admin's edits (Contact and Solutions pages) on top. */
export async function applySiteContent(dict: Dictionary, lang: Locale): Promise<Dictionary> {
  if (lang !== "en" && lang !== "bn") return dict;
  const g = await loadGlobals(lang);
  if (!g) return dict;
  const t = structuredClone(dict);
  const c = g.contact;
  const s = g.solutions;

  // Contact
  set(t.nav, "hours", str(c.hours));
  set(t.contact, "hours", str(c.hours));
  set(t.pages.contact, "title", str(c.pageTitle));
  set(t.pages.contact, "body", str(c.pageIntro));

  // Solutions page
  set(t.pages.solutions, "title", str(s.title));
  set(t.pages.solutions, "body", str(s.intro));
  for (const key of ["residential", "commercial", "utility"] as const) {
    const a = isObj(s[key]) ? (s[key] as Loose) : {};
    const item = t.solutions.items[key];
    set(item, "title", str(a.title));
    set(item, "text", str(a.text));
    set(item, "points", lineList(a.points));
  }
  set(t.solutions, "applicationsTitle", str(s.applicationsTitle));
  set(t.solutions, "applicationsBody", str(s.applicationsBody));
  set(
    t.solutions,
    "applications",
    rows(s.applications)
      .map((r) => ({ title: str(r.title), text: str(r.text) }))
      .filter((r) => r.title),
  );
  set(t.solutions, "systemsTitle", str(s.systemsTitle));
  set(
    t.solutions,
    "systems",
    rows(s.systems)
      .map((r) => ({ name: str(r.name), text: str(r.text), ideal: str(r.ideal), backup: Boolean(r.backup), flow: lineList(r.flow) }))
      .filter((r) => r.name),
  );
  set(t.solutions, "packageTitle", str(s.packageTitle));
  set(t.solutions, "packageBody", str(s.packageBody));
  set(t.solutions, "package", lineList(s.package));
  return t;
}
