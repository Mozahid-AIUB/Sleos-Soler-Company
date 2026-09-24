import type { CSSProperties } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { site, whatsappLink } from "@/content/site";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { SplitText } from "@/components/motion/SplitText";

const idx = (i: number) => ({ "--i": i }) as CSSProperties;

export function ContactSection({
  lang,
  t,
  heading = true,
}: {
  lang: Locale;
  t: Dictionary["contact"];
  heading?: boolean;
}) {
  const rows: { label: string; value: string; href?: string; external?: boolean }[] = [
    { label: t.call, value: site.phone, href: site.phoneHref },
    { label: t.whatsapp, value: site.whatsappDisplay, href: whatsappLink(), external: true },
    { label: t.write, value: site.email, href: `mailto:${site.email}` },
    { label: t.visit, value: site.address[lang] },
    { label: lang === "bn" ? "অফিস সময়" : "Office hours", value: t.hours },
  ];

  return (
    <section id="contact" className="section-y scroll-mt-20 bg-white">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
        <div>
          {heading && (
            <>
              <p className="eyebrow reveal-fade text-teal-600">{t.eyebrow}</p>
              <SplitText as="h2" text={t.title} className="h2 mt-4" />
              <p className="lead reveal mt-5 text-ink-600" style={idx(2)}>
                {t.body}
              </p>
            </>
          )}

          <div
            aria-hidden="true"
            className={`reveal-line h-px bg-no-repeat text-cream-200 [background-image:linear-gradient(currentColor,currentColor)] [background-size:100%_1px] ${heading ? "mt-10" : ""}`}
            style={idx(heading ? 2 : 0)}
          />
          <dl>
            {rows.map((r, i) => (
              <div key={r.label} style={idx((heading ? 2 : 0) + Math.min(i, 3))} className="reveal grid grid-cols-[130px_1fr] gap-4 border-b border-cream-200 py-4 text-[15px] sm:grid-cols-[160px_1fr]">
                <dt className="text-ink-400">{r.label}</dt>
                <dd className="font-medium text-ink-900">
                  {r.href ? (
                    <a
                      href={r.href}
                      {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="underline decoration-cream-200 underline-offset-4 transition-colors hover:text-forest-900 hover:decoration-forest-900"
                    >
                      {r.value}
                    </a>
                  ) : (
                    r.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="reveal-fade mt-8" style={idx(heading ? 5 : 3)}>
            <SocialLinks dark={false} />
          </div>
        </div>

        <div className="reveal rounded-lg border border-cream-200 bg-cream-50 p-6 sm:p-10" style={idx(1)}>
          <QuoteForm t={t} />
        </div>
      </div>
    </section>
  );
}
