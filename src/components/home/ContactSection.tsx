import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { site, whatsappLink } from "@/content/site";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";

export function ContactSection({
  lang,
  t,
  heading = true,
}: {
  lang: Locale;
  t: Dictionary["contact"];
  heading?: boolean;
}) {
  const rows = [
    { icon: <Icon name="phone" size={20} />, label: t.call, value: site.phone, href: site.phoneHref },
    { icon: <WhatsappIcon size={20} />, label: t.whatsapp, value: site.whatsappDisplay, href: whatsappLink() },
    { icon: <Icon name="mail" size={20} />, label: t.write, value: site.email, href: `mailto:${site.email}` },
    { icon: <Icon name="pin" size={20} />, label: t.visit, value: site.address[lang] },
  ];
  return (
    <section id="contact" className="section-y scroll-mt-20 bg-cream-50">
      <div className="container-x grid gap-6 lg:grid-cols-[1fr_1.45fr]">
        <div className="reveal relative flex flex-col overflow-hidden rounded-xl bg-forest-900 p-8 text-white sm:p-10">
          {heading && (
            <>
              <p className="eyebrow relative text-gold-400">{t.eyebrow}</p>
              <h2 className="h2 relative mt-5 !text-[clamp(30px,3.2vw,44px)]">{t.title}</h2>
              <p className="relative mt-4 leading-relaxed text-white/65">{t.body}</p>
            </>
          )}
          <ul className={`relative flex-1 space-y-5 ${heading ? "mt-10" : ""}`}>
            {rows.map((r) => {
              const body = (
                <>
                  <span className="mt-0.5 shrink-0 text-gold-400">{r.icon}</span>
                  <span>
                    <span className="block text-[13px] text-white/50">{r.label}</span>
                    <span className="mt-0.5 block font-medium">{r.value}</span>
                  </span>
                </>
              );
              return (
                <li key={r.label}>
                  {r.href ? (
                    <a href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex gap-4 transition-colors hover:text-gold-400">
                      {body}
                    </a>
                  ) : (
                    <div className="flex gap-4">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="relative mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-7">
            <p className="flex items-center gap-2 text-[14px] text-white/60">
              <Icon name="clock" size={17} />
              {t.hours}
            </p>
            <SocialLinks />
          </div>
        </div>

        <div className="reveal card-soft p-7 sm:p-10">
          <QuoteForm t={t} />
        </div>
      </div>
    </section>
  );
}
