import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import type { CSSProperties } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { SectionHeading } from "@/components/ui/SectionHeading";

type About = Dictionary["pages"]["about"];

/**
 * Leadership team. Portraits live in public/media/team/<file>.webp (same
 * order as `team` in the dictionaries); until a photo is added the card shows
 * the person's initials, so the section never renders a broken image.
 */
const PHOTOS = ["banzir-hazra", "lutfar-rahman", "safuan-chowdhury", "maksudul-hasan", "kiran-mathew"];

const photoFor = (i: number) => {
  const file = PHOTOS[i];
  if (!file) return null;
  for (const ext of ["webp", "png", "jpg", "jpeg"]) {
    if (existsSync(path.join(process.cwd(), "public", "media", "team", `${file}.${ext}`)))
      return `/media/team/${file}.${ext}`;
  }
  return null;
};

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

export function Team({ t }: { t: About }) {
  return (
    <section className="section-y border-t border-cream-200 bg-cream-50">
      <div className="container-x">
        <SectionHeading eyebrow={t.teamEyebrow} title={t.teamTitle} body={t.teamBody} />
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {t.team.map((m, i) => {
            const photo = photoFor(i);
            return (
              <article
                key={m.name}
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
                    {m.credentials.split(" · ").map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                  <div className="mt-4 space-y-3 border-t border-cream-200 pt-4 text-[15px] leading-relaxed text-ink-600">
                    {m.bio.map((b) => (
                      <p key={b.slice(0, 24)}>{b}</p>
                    ))}
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
