import { site } from "@/content/site";

export function TrustMarquee({ label }: { label: string }) {
  const items = [...site.certifications, ...site.certifications];
  return (
    <section className="border-y border-white/5 bg-forest-950 py-7 text-white" aria-label={label}>
      <div className="reveal-fade container-x flex items-center gap-8">
        <p className="hidden shrink-0 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/45 md:block">{label}</p>
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <ul className="marquee-track flex w-max items-center gap-12">
            {items.map((c, i) => (
              <li key={i} className="flex items-center gap-12 whitespace-nowrap text-[17px] font-semibold tracking-tight text-white/70" aria-hidden={i >= site.certifications.length}>
                {c}
                <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
