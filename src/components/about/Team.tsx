import Image from "next/image";
import type { CSSProperties } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import enDictionary from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { pick } from "@/i18n/content";
import type { TeamMember } from "@/lib/team";
import { SectionHeading } from "@/components/ui/SectionHeading";

type About = Dictionary["pages"]["about"];
type StaticMember = About["team"][number];

const enTeam = enDictionary.pages.about.team;

/**
 * Leadership team. Members come from getTeam() (Payload, with the dictionaries
 * as fallback); a member without a portrait shows the person's initials, so the
 * section never renders a broken image.
 */

/**
 * One piece of text in the page language (zh/es/fr): the translation maps (keyed
 * by the English text, `pick`) first; text that still equals the built-in English
 * copy uses that language's dictionary text, so the translated team keeps working
 * until an editor changes it.
 */
const tr = (en: string, lang: Locale, builtIn?: { en: string; own: string }) =>
  builtIn && builtIn.en === en ? builtIn.own : pick({ en, bn: en }, lang);

function localize(m: TeamMember, lang: Locale, own: StaticMember[]) {
  if (lang === "en" || lang === "bn") {
    return {
      name: m.name[lang],
      role: m.role[lang],
      credentials: m.credentials?.[lang] ?? "",
      bio: m.bio[lang],
      highlights: m.highlights?.[lang] ?? [],
    };
  }
  const idx = enTeam.findIndex((e) => e.name === m.name.en);
  const e = idx >= 0 ? enTeam[idx] : undefined;
  const o = idx >= 0 ? own[idx] : undefined;
  const hl = (e && "highlights" in e && e.highlights) || [];
  const ohl = (o && "highlights" in o && o.highlights) || [];
  return {
    name: tr(m.name.en, lang, e && o && { en: e.name, own: o.name }),
    role: tr(m.role.en, lang, e && o && { en: e.role, own: o.role }),
    credentials: m.credentials ? tr(m.credentials.en, lang, e && o && { en: e.credentials, own: o.credentials }) : "",
    bio: m.bio.en.map((p, j) => tr(p, lang, e && o && e.bio[j] !== undefined && o.bio[j] !== undefined ? { en: e.bio[j], own: o.bio[j] } : undefined)),
    highlights: (m.highlights?.en ?? []).map((h, j) => tr(h, lang, hl[j] !== undefined && ohl[j] !== undefined ? { en: hl[j], own: ohl[j] } : undefined)),
  };
}

/** "Engr. Banzir Hazra" -> "BH"; honorifics and bracketed nicknames are skipped. */
const initials = (name: string) =>
  name
    .replace(/\(.*?\)/g, "")
    .split(/\s+/)
    .filter((w) => w && !/\.$/.test(w) && !/^advocate$/i.test(w))
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export function Team({ t, lang, members }: { t: About; lang: Locale; members: TeamMember[] }) {
  return (
    <section className="section-y border-t border-cream-200 bg-cream-50">
      <div className="container-x">
        <SectionHeading eyebrow={t.teamEyebrow} title={t.teamTitle} body={t.teamBody} />
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {members.map((member, i) => {
            const m = localize(member, lang, t.team);
            const photo = member.photo;
            return (
              <article
                key={member.name.en}
                className="reveal group grid gap-6 rounded-lg border border-cream-200 bg-white p-6 transition-colors duration-500 hover:border-gold-400/60 sm:grid-cols-[168px_1fr] sm:p-7"
                style={{ "--i": i % 2 } as CSSProperties}
              >
                <div className="relative aspect-[4/5] w-full max-w-[168px] overflow-hidden rounded-md bg-forest-900">
                  {photo ? (
                    <Image
                      src={photo}
                      alt={m.name}
                      fill
                      sizes="168px"
                      className="object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                    />
                  ) : (
                    <span aria-hidden="true" className="absolute inset-0 grid place-items-center text-[40px] font-bold tracking-wide text-gold-400">
                      {initials(m.name)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="eyebrow text-teal-600">{m.role}</p>
                  <h3 className="mt-2 text-[22px] font-bold leading-snug tracking-tight text-ink-900">{m.name}</h3>
                  <ul className="mt-2 space-y-0.5 text-[13.5px] leading-relaxed text-ink-400">
                    {m.credentials
                      .split(" · ")
                      .filter(Boolean)
                      .map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                  </ul>
                  <div className="mt-4 space-y-3 border-t border-cream-200 pt-4 text-[15px] leading-relaxed text-ink-600">
                    {m.bio.map((b) => (
                      <p key={b.slice(0, 24)}>{b}</p>
                    ))}
                    {m.highlights.length > 0 && (
                      <ul className="space-y-1.5">
                        {m.highlights.map((h) => (
                          <li key={h} className="flex gap-3">
                            <span aria-hidden="true" className="mt-[11px] h-px w-4 shrink-0 bg-gold-500" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
