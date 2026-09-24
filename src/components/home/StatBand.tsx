import type { CSSProperties } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { CountUp } from "@/components/motion/CountUp";

export function StatBand({ t }: { t: Dictionary["stats"] }) {
  return (
    <section className="relative overflow-hidden bg-forest-900 text-white">
      <div className="container-x relative grid grid-cols-2 gap-y-12 py-20 lg:grid-cols-4 lg:py-24">
        {t.items.map((s, i) => (
          <div key={s.label} className={`reveal px-2 lg:px-6 xl:px-8 ${i > 0 ? "lg:border-l lg:border-white/15" : ""}`} style={{ "--i": i } as CSSProperties}>
            <p className="text-[clamp(34px,4.2vw,60px)] font-extrabold leading-none tabular-nums tracking-tight">
              <CountUp value={s.value} />
            </p>
            <p className="mt-3 text-[15px] font-medium text-white/75">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
