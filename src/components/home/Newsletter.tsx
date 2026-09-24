import type { CSSProperties } from "react";
import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { SplitText } from "@/components/motion/SplitText";

export function Newsletter({ t }: { t: Dictionary["newsletter"] }) {
  return (
    <section className="border-y border-cream-200 bg-cream-50">
      <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:py-20">
        <div>
          <p className="eyebrow reveal-fade text-teal-600">{t.eyebrow}</p>
          <SplitText as="h2" text={t.title} className="h2 mt-4 !text-[clamp(28px,3.2vw,44px)]" />
          <p className="lead reveal mt-4 max-w-lg text-ink-600" style={{ "--i": 2 } as CSSProperties}>
            {t.body}
          </p>
          <div className="reveal mt-8 max-w-xl" style={{ "--i": 3 } as CSSProperties}>
            <NewsletterForm t={t} />
          </div>
        </div>
        <div className="reveal-img relative aspect-[4/3] overflow-hidden rounded-lg md:aspect-[2/1] lg:aspect-[4/3] [clip-path:inset(0)]" style={{ "--i": 1 } as CSSProperties}>
          <Image src="/media/img/drill-panel.jpg" alt="Technician fixing a solar module to its frame" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
