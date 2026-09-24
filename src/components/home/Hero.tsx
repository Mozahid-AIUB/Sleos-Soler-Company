import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { localizeDigits, type Locale } from "@/i18n/config";
import { Icon } from "@/components/ui/Icon";
import { HeroVideo } from "@/components/home/HeroVideo";
import heroPoster from "../../../public/media/img/hero-poster.jpg";

const heroStats = [
  { value: "850+ MW", label: { en: "Modules installed", bn: "মডিউল স্থাপিত" } },
  { value: "23.8%", label: { en: "Peak module efficiency", bn: "সর্বোচ্চ মডিউল দক্ষতা" } },
  { value: { en: "30 years", bn: "৩০ বছর" }, label: { en: "Performance warranty", bn: "পারফরম্যান্স ওয়ারেন্টি" } },
] as const;

export function Hero({ lang, t }: { lang: Locale; t: Dictionary }) {
  const h = t.hero;
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-forest-950 text-white">
      <div className="hero-media absolute inset-0 -z-10 origin-center">
        <Image src={heroPoster} alt="" fill priority sizes="100vw" quality={75} placeholder="blur" className="object-cover" />
        <HeroVideo src="/media/video/hero-solar-sunset.mp4" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950/90 via-forest-950/60 to-forest-950/20" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-forest-950 to-transparent" />

      <div className="hero-content container-x flex flex-1 flex-col justify-center pb-10 pt-32 lg:pt-36">
        <div className="max-w-[1000px]">
          <p className="hero-in text-[14px] font-medium text-white/70">{h.eyebrow}</p>
          <h1 className="display hero-in mt-6 text-[clamp(42px,6.2vw,90px)] [animation-delay:100ms]">
            {h.titleA}
            <br />
            <span className="text-gold-400">{h.titleB}</span>
          </h1>
          <p className="lead hero-in mt-7 max-w-[580px] text-white/75 [animation-delay:200ms]">{h.sub}</p>
          <div className="hero-in mt-10 flex flex-wrap gap-3 [animation-delay:300ms]">
            <Link href={`/${lang}/products`} className="btn btn-gold !min-h-[52px] !px-7">
              {h.shop}
              <Icon name="arrowRight" size={18} />
            </Link>
            <Link href={`/${lang}/contact`} className="btn btn-glass !min-h-[52px] !px-7">
              {h.quote}
            </Link>
          </div>
        </div>
      </div>

      <div className="container-x pb-10 lg:pb-14">
        <dl className="hero-in grid grid-cols-3 border-t border-white/20 pt-6 [animation-delay:400ms] lg:max-w-[820px]">
          {heroStats.map((s, i) => (
            <div key={i} className={i > 0 ? "pl-4 sm:pl-8" : ""}>
              <dt className="order-2 mt-1.5 text-[12.5px] text-white/60 sm:text-[14px]">{s.label[lang]}</dt>
              <dd className="text-[clamp(20px,2.4vw,30px)] font-bold tracking-tight">
                {typeof s.value === "string" ? localizeDigits(s.value, lang) : s.value[lang]}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
