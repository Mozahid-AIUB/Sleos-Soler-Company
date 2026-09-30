import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Partner brands from the client brochure (p.32). Logos are cropped from the
 * brochure (public/media/partners); `cls` sets a per-mark display height so
 * they read at a similar optical size. Balance-of-system brands have no logo in the
 * brochure, so they render as wordmarks.
 */
type Logo = { name: string; file: string; w: number; h: number; cls: string };

const modules: Logo[] = [
  { name: "Trina Solar", file: "trina-solar", w: 628, h: 160, cls: "h-8 sm:h-9" },
  { name: "Jinko Solar", file: "jinko-solar", w: 450, h: 160, cls: "h-10 sm:h-12" },
  { name: "LONGi", file: "longi", w: 423, h: 160, cls: "h-8 sm:h-10" },
  { name: "JA Solar", file: "ja-solar", w: 767, h: 160, cls: "h-7 sm:h-8" },
  { name: "Canadian Solar", file: "canadian-solar", w: 893, h: 160, cls: "h-6 sm:h-7" },
  { name: "Astronergy", file: "astronergy", w: 282, h: 160, cls: "h-12 sm:h-14" },
];

const inverters: Logo[] = [
  { name: "Sungrow", file: "sungrow", w: 1049, h: 160, cls: "h-5 sm:h-6" },
  { name: "Huawei", file: "huawei", w: 156, h: 160, cls: "h-12 sm:h-14" },
  { name: "Solis", file: "solis", w: 382, h: 160, cls: "h-9 sm:h-10" },
  { name: "GoodWe", file: "goodwe", w: 927, h: 160, cls: "h-5 sm:h-6" },
  { name: "Growatt", file: "growatt", w: 765, h: 160, cls: "h-6 sm:h-7" },
  { name: "Crown", file: "crown", w: 589, h: 160, cls: "h-7 sm:h-8" },
  { name: "Deye", file: "deye", w: 372, h: 160, cls: "h-8 sm:h-9" },
];

const stabilizers = ["SAKO", "CNC Electric", "Tengen"];

const brands = ["Delixi Electric", "CHNT", "CNC Electric", "Tengen", "Zhengxi"];

const at = (i: number) => ({ "--i": i }) as CSSProperties;

const CELL =
  "group/logo flex h-24 items-center justify-center rounded-lg border border-cream-200 bg-white px-4 transition-colors duration-300 hover:border-ink-400/40 sm:h-28";

function Group({ label, note, children, i }: { label: string; note?: string; children: ReactNode; i: number }) {
  return (
    <div className="reveal" style={at(i)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-cream-200 pb-3">
        <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-ink-900">{label}</h3>
        {note && <p className="text-[13px] text-ink-400">{note}</p>}
      </div>
      {children}
    </div>
  );
}

function LogoGrid({ items, cols }: { items: Logo[]; cols: string }) {
  return (
    <ul className={`mt-5 grid grid-cols-2 gap-3 ${cols}`}>
      {items.map((l) => (
        <li key={l.file} className={CELL}>
          <Image
            src={`/media/partners/${l.file}.webp`}
            alt={l.name}
            width={l.w}
            height={l.h}
            sizes="200px"
            className={`${l.cls} w-auto max-w-[82%] object-contain transition duration-300 lg:opacity-75 lg:grayscale lg:group-hover/logo:opacity-100 lg:group-hover/logo:grayscale-0`}
          />
        </li>
      ))}
    </ul>
  );
}

/** Brands without a logo file render as wordmarks. */
function Wordmarks({ items, cols }: { items: string[]; cols: string }) {
  return (
    <ul className={`mt-5 grid grid-cols-2 gap-3 ${cols}`}>
      {items.map((b) => (
        <li key={b} className={CELL}>
          <span className="text-center text-[17px] font-bold uppercase tracking-[0.06em] text-ink-400 transition-colors duration-300 group-hover/logo:text-ink-900 sm:text-[18px]">
            {b}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Partners({ t, className = "bg-white" }: { t: Dictionary["partners"]; className?: string }) {
  return (
    <section id="partners" className={`section-y ${className}`}>
      <div className="container-x">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} body={t.body} />
        <div className="mt-14 grid gap-12">
          <Group label={t.modules} i={1}>
            <LogoGrid items={modules} cols="sm:grid-cols-3 lg:grid-cols-6" />
          </Group>
          <Group label={t.inverters} i={2}>
            <LogoGrid items={inverters} cols="sm:grid-cols-4 lg:grid-cols-7" />
          </Group>
          <Group label={t.stabilizers} i={3}>
            <Wordmarks items={stabilizers} cols="sm:grid-cols-3" />
          </Group>
          <Group label={t.brands} note={t.brandsNote} i={4}>
            <Wordmarks items={brands} cols="sm:grid-cols-3 lg:grid-cols-5" />
          </Group>
        </div>
      </div>
    </section>
  );
}
