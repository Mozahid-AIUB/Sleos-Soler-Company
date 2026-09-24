import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function Newsletter({ t }: { t: Dictionary["newsletter"] }) {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container-x">
        <div className="reveal relative isolate grid overflow-hidden rounded-xl bg-forest-900 text-white lg:grid-cols-[1.1fr_1fr]">
          <div className="relative z-10 p-8 sm:p-12 lg:p-16">
            <p className="eyebrow text-gold-400">{t.eyebrow}</p>
            <h2 className="h2 mt-5 !text-[clamp(30px,3.4vw,46px)]">{t.title}</h2>
            <p className="lead mt-5 max-w-lg text-white/65">{t.body}</p>
            <div className="mt-9 max-w-xl">
              <NewsletterForm t={t} />
            </div>
          </div>
          <div className="relative min-h-[280px]">
            <Image src="/media/img/drill-panel.jpg" alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/30 to-transparent lg:bg-gradient-to-r" />
          </div>
        </div>
      </div>
    </section>
  );
}
