import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import type { Localized } from "@/i18n/config";
import en from "@/i18n/dictionaries/en";
import bn from "@/i18n/dictionaries/bn";
import { createLoader, isObj, loc, mediaUrl, optLoc, text, type Loose } from "@/lib/cms-read";

/*
 * Leadership team for the About page. Members live in Payload (collection
 * "team-members"); when the database is missing, down or has no published
 * members, the `team` arrays of the en and bn dictionaries are used instead
 * (portraits then come from public/media/team/<file>.<ext>).
 */

export type TeamMember = {
  name: Localized;
  role: Localized;
  credentials?: Localized;
  /** Biography paragraphs. */
  bio: Localized<string[]>;
  /** Optional bullet list shown after the paragraphs. */
  highlights?: Localized<string[]>;
  /** Portrait URL; absent when there is no photo (the card shows initials). */
  photo?: string;
};

/**
 * The bio is one textarea: paragraphs are separated by a blank line. A block
 * whose lines all start with "- " is a bullet list (shown after the paragraphs).
 */
export function parseBio(raw: unknown): { paragraphs: string[]; highlights: string[] } {
  const paragraphs: string[] = [];
  const highlights: string[] = [];
  for (const block of text(raw).split(/\r?\n\s*\r?\n/)) {
    const lines = block.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    if (lines.every((l) => /^[-•]\s+/.test(l))) highlights.push(...lines.map((l) => l.replace(/^[-•]\s+/, "").trim()));
    else paragraphs.push(lines.join(" "));
  }
  return { paragraphs, highlights };
}

function readMember(doc: Loose): TeamMember | null {
  const name = loc(doc.name);
  const role = loc(doc.role);
  if (!name.en || !role.en) return null;
  const raw = isObj(doc.bio) ? doc.bio : {};
  const bioEn = parseBio(raw.en);
  const bioBn = parseBio(raw.bn);
  // A missing side falls back to the other, as loc() does for text.
  const paragraphs = { en: bioEn.paragraphs.length ? bioEn.paragraphs : bioBn.paragraphs, bn: bioBn.paragraphs.length ? bioBn.paragraphs : bioEn.paragraphs };
  const hl = { en: bioEn.highlights.length ? bioEn.highlights : bioBn.highlights, bn: bioBn.highlights.length ? bioBn.highlights : bioEn.highlights };
  return {
    name,
    role,
    credentials: optLoc(doc.credentials),
    bio: paragraphs,
    highlights: hl.en.length || hl.bn.length ? hl : undefined,
    photo: mediaUrl(doc.photo),
  };
}

/* ---- static fallback (dictionaries) ---- */

/** Portrait files in public/media/team, in dictionary order. */
const PHOTO_FILES = ["banzir-hazra", "lutfar-rahman", "safuan-chowdhury", "maksudul-hasan", "kiran-mathew"];

function staticPhoto(i: number): string | undefined {
  const file = PHOTO_FILES[i];
  if (!file) return undefined;
  for (const ext of ["webp", "png", "jpg", "jpeg"]) {
    if (existsSync(path.join(process.cwd(), "public", "media", "team", `${file}.${ext}`))) return `/media/team/${file}.${ext}`;
  }
  return undefined;
}

function staticTeam(): TeamMember[] {
  const bnTeam = bn.pages.about.team;
  return en.pages.about.team.map((m, i) => {
    const b = bnTeam[i] ?? m;
    const highlights = "highlights" in m && m.highlights ? { en: [...m.highlights], bn: "highlights" in b && b.highlights ? [...b.highlights] : [...m.highlights] } : undefined;
    return {
      name: { en: m.name, bn: b.name },
      role: { en: m.role, bn: b.role },
      credentials: m.credentials ? { en: m.credentials, bn: b.credentials || m.credentials } : undefined,
      bio: { en: [...m.bio], bn: [...b.bio] },
      highlights,
      photo: staticPhoto(i),
    };
  });
}

/* ---- public API ---- */

const loadTeam = createLoader<TeamMember>(
  "team",
  async (payload) => {
    const res = await payload.find({
      collection: "team-members",
      where: { _status: { equals: "published" } },
      locale: "all",
      fallbackLocale: false,
      depth: 1,
      limit: 0,
      pagination: false,
      sort: "order",
    });
    return (res.docs as unknown as Loose[]).map(readMember).filter((m): m is TeamMember => m !== null);
  },
  staticTeam,
);

/** Published team members in display order (static dictionary content when the CMS has none). */
export const getTeam = (): Promise<TeamMember[]> => loadTeam();
