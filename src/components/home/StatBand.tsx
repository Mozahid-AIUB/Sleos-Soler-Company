import type { CSSProperties } from "react";
import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { CountUp } from "@/components/motion/CountUp";

export function StatBand({ t }: { t: Dictionary["stats"] }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-forest-950 text-white">
      <Image src="/media/img/utility-aerial.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-35" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950 via-forest-950/85 to-forest-950/60" />
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-12 py-20 lg:grid-cols-4 lg:py-28">
        {t.items.map((s, i) => (
          <div key={s.label} className="reveal" style={{ "--i": i } as CSSProperties}>
            <span aria-hidden="true" className="block h-px w-10 bg-gold-400" />
            <p className="mt-6 text-[clamp(34px,4.2vw,60px)] font-bold leading-none tabular-nums tracking-tight">
              <CountUp value={s.value} />
            </p>
            <p className="mt-3 text-[15px] text-white/65">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
