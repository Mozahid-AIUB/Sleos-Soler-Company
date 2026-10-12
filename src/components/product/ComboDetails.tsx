import { pick } from "@/i18n/content";
import type { Locale } from "@/i18n/config";
import { formatPrice } from "@/i18n/config";
import { comboText, type Product } from "@/content/products";
import { Icon } from "@/components/ui/Icon";

const h2 = "text-[15px] font-bold";

/** Price, contents, suitability and benefits of a Solar Combo Package. */
export function ComboDetails({ product, lang }: { product: Product; lang: Locale }) {
  const c = product.combo;
  if (!c) return null;
  const list = (items: string[]) => (
    <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-2.5 text-[14.5px] leading-snug text-ink-600">
          <Icon name="check" size={17} strokeWidth={2.2} className="mt-0.5 shrink-0 text-teal-600" />
          {t}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="mt-8 grid gap-8">
      {c.suitableFor && (
        <div>
          <h2 className={h2}>{pick(comboText.suitableFor, lang)}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {pick(c.suitableFor, lang).map((t) => (
              <li key={t} className="rounded-full border border-cream-200 bg-white px-3.5 py-1.5 text-[13.5px] font-semibold text-ink-900">
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="rounded-lg border border-cream-200 bg-white p-5">
        <h2 className={h2}>{pick(comboText.includes, lang)}</h2>
        <ul className="mt-3 grid gap-2.5">
          {pick(c.includes, lang).map((t) => (
            <li key={t} className="flex items-start gap-2.5 text-[14.5px] leading-snug text-ink-600">
              <span aria-hidden="true" className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
              {t}
            </li>
          ))}
        </ul>
      </div>
      {c.idealFor && (
        <div>
          <h2 className={h2}>{pick(comboText.idealFor, lang)}</h2>
          {list(pick(c.idealFor, lang))}
        </div>
      )}
      {c.benefits && (
        <div>
          <h2 className={h2}>{pick(comboText.benefits, lang)}</h2>
          {list(pick(c.benefits, lang))}
        </div>
      )}
      <div className="grid gap-1.5 rounded-lg bg-cream-100 p-5 text-[14.5px] leading-relaxed text-ink-600">
        <p>
          <b className="text-ink-900">{pick(comboText.transportLabel, lang)}:</b> {pick(c.transport ?? comboText.transport, lang)}
        </p>
        <p>{pick(c.customise ?? comboText.customise, lang)}</p>
      </div>
    </div>
  );
}

/** "Ideal applications" list for products that define one. */
export function Applications({ product, lang }: { product: Product; lang: Locale }) {
  if (!product.applications) return null;
  return (
    <div className="mt-8">
      <h2 className={h2}>{pick(comboText.applications, lang)}</h2>
      <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {pick(product.applications, lang).map((t) => (
          <li key={t} className="flex items-start gap-2.5 text-[14.5px] leading-snug text-ink-600">
            <span aria-hidden="true" className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Offer price with the regular price struck through (BDT). */
export function ComboPrice({ product, lang, note = false }: { product: Product; lang: Locale; note?: boolean }) {
  const p = product.combo?.price;
  if (!p) return null;
  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[clamp(26px,3vw,34px)] font-extrabold tracking-tight text-forest-900">{formatPrice(p.offer, lang)}</span>
        {p.regular && p.regular > p.offer && (
          <>
            <span className="text-[18px] font-semibold text-ink-400 line-through">{formatPrice(p.regular, lang)}</span>
            <span className="rounded-full bg-gold-400/25 px-2.5 py-0.5 text-[13px] font-bold text-forest-900">
              {pick(comboText.save, lang)} {formatPrice(p.regular - p.offer, lang)}
            </span>
          </>
        )}
      </p>
      {note && <p className="mt-1 text-[13px] text-ink-400">{pick(comboText.priceNote, lang)}</p>}
    </div>
  );
}
