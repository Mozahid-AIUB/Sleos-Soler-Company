"use client";

import { Suspense, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { localizeDigits, type Locale } from "@/i18n/config";
import { sendToWhatsApp } from "@/lib/whatsapp";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";

type T = Dictionary["quote"];

const labelClass = "grid content-start gap-1.5 text-[14px] font-medium text-ink-900";

function Req() {
  return (
    <span aria-hidden="true" className="text-teal-600">
      {" "}*
    </span>
  );
}

/** Numbered block of the sheet, mirroring the brochure's numbered cards. */
function Section({ n, title, lang, children }: { n: number; title: string; lang: Locale; children: ReactNode }) {
  return (
    <section aria-labelledby={`qs-${n}`} className="grid gap-5 border-t border-cream-200 pt-8">
      <h2 id={`qs-${n}`} className="flex items-baseline gap-3">
        <span className="text-[13px] font-semibold tabular-nums text-teal-600">{localizeDigits(`0${n}`, lang)}</span>
        <span className="text-[19px] font-bold text-ink-900">{title}</span>
      </h2>
      {children}
    </section>
  );
}

/** Single-choice group rendered as selectable tiles (native radios, keyboard friendly). */
function Choice({
  name,
  label,
  options,
  required,
  cols = "sm:grid-cols-3",
  onChange,
}: {
  name: string;
  label: string;
  options: readonly string[];
  required?: boolean;
  cols?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid gap-2.5">
      <p className="text-[14px] font-medium text-ink-900">
        {label}
        {required && <Req />}
      </p>
      <div className={`grid grid-cols-2 gap-2 ${cols}`}>
        {options.map((o) => (
          <label
            key={o}
            className="flex min-h-12 cursor-pointer items-center gap-2.5 rounded-md border border-cream-200 bg-white px-3.5 py-2.5 text-[14px] text-ink-600 transition-colors hover:border-ink-400 has-[:checked]:border-forest-900 has-[:checked]:bg-forest-900 has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-500"
          >
            <input
              type="radio"
              name={name}
              value={o}
              required={required}
              onChange={() => onChange?.(o)}
              className="sr-only"
            />
            {o}
          </label>
        ))}
      </div>
    </div>
  );
}

function Select({ name, label, options, placeholder }: { name: string; label: string; options: readonly string[]; placeholder?: string }) {
  return (
    <label className={labelClass}>
      {label}
      <span className="relative">
        <select name={name} defaultValue={placeholder ? "" : options[0]} className="field appearance-none pr-10">
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <Icon name="chevronDown" size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
      </span>
    </label>
  );
}

/** Reads ?product= on the client so the page itself stays static. */
function ProductField({ label, names }: { label: string; names: Record<string, string> }) {
  const slug = useSearchParams().get("product");
  if (!slug) return null;
  return (
    <label className={`${labelClass} sm:col-span-2`}>
      {label}
      <input name="product" defaultValue={names[slug] ?? slug} className="field" />
    </label>
  );
}

export function QuoteSheet({ lang, t, productNames }: { lang: Locale; t: T; productNames: Record<string, string> }) {
  const f = t.f;
  const [backup, setBackup] = useState<string | null>(null);
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  return (
    <>
      <form
        hidden={!!sentUrl}
        className="grid gap-10 [&>section:first-of-type]:border-t-0 [&>section:first-of-type]:pt-0"
        onSubmit={(e) => {
          e.preventDefault();
          const d = new FormData(e.currentTarget);
          const v = (k: string) => String(d.get(k) ?? "").trim();
          const withUnit = (k: string, u: string) => (v(k) ? `${v(k)} ${v(u)}` : "");
          const url = sendToWhatsApp(`${t.eyebrow} — OSLEOS website`, [
            [f.product, v("product")],
            [f.name, v("name")],
            [f.company, v("company")],
            [f.phone, v("phone")],
            [f.email, v("email")],
            [f.location, v("location")],
            [f.projectType, v("type")],
            [f.system, v("system")],
            [f.billAmount, v("billAmount")],
            [f.billMonth, v("billMonth")],
            [f.consumption, v("consumption")],
            [f.load, withUnit("load", "loadUnit")],
            [f.hoursPerDay, v("hoursPerDay")],
            [f.daysPerWeek, v("daysPerWeek")],
            [f.appliances, v("appliances")],
            [f.area, withUnit("area", "areaUnit")],
            [f.roofType, v("roofType")],
            [f.backup, v("backup")],
            [f.backupHours, v("backupHours")],
            [f.priorityLoads, v("priorityLoads")],
            [f.existing, v("existing")],
            [f.budget, v("budget")],
            [f.timeline, v("timeline")],
            [f.notes, v("notes")],
          ]);
          setSentUrl(url);
          window.scrollTo({ top: (e.currentTarget.parentElement?.getBoundingClientRect().top ?? 0) + window.scrollY - 120 });
        }}
      >
        <p className="text-[14px] leading-relaxed text-ink-600">{t.note}</p>

        <Section n={1} title={t.steps.contact} lang={lang}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              <span>
                {f.name}
                <Req />
              </span>
              <input name="name" required autoComplete="name" className="field" />
            </label>
            <label className={labelClass}>
              {f.company}
              <input name="company" autoComplete="organization" className="field" />
            </label>
            <label className={labelClass}>
              <span>
                {f.phone}
                <Req />
              </span>
              <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" className="field" />
            </label>
            <label className={labelClass}>
              {f.email}
              <input name="email" type="email" autoComplete="email" className="field" />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              <span>
                {f.location}
                <Req />
              </span>
              <input name="location" required autoComplete="address-level2" className="field" />
            </label>
            <Suspense fallback={null}>
              <ProductField label={f.product} names={productNames} />
            </Suspense>
          </div>
        </Section>

        <Section n={2} title={t.steps.project} lang={lang}>
          <Choice name="type" label={f.projectType} options={f.types} required />
          <Choice name="system" label={f.system} options={f.systems} cols="sm:grid-cols-4" />
        </Section>

        <Section n={3} title={t.steps.energy} lang={lang}>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className={labelClass}>
              {f.billAmount}
              <input name="billAmount" inputMode="numeric" className="field" />
            </label>
            <label className={labelClass}>
              {f.billMonth}
              <input name="billMonth" className="field" />
            </label>
            <label className={labelClass}>
              {f.consumption}
              <input name="consumption" inputMode="decimal" className="field" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_0.6fr_1fr_1fr]">
            <label className={labelClass}>
              {f.load}
              <input name="load" inputMode="decimal" className="field" />
            </label>
            <Select name="loadUnit" label={f.unit} options={f.loadUnits} />
            <label className={labelClass}>
              {f.hoursPerDay}
              <input name="hoursPerDay" inputMode="numeric" className="field" />
            </label>
            <label className={labelClass}>
              {f.daysPerWeek}
              <input name="daysPerWeek" inputMode="numeric" className="field" />
            </label>
          </div>
          <label className={labelClass}>
            {f.appliances}
            <textarea name="appliances" rows={3} placeholder={f.appliancesHint} className="field resize-y placeholder:text-ink-400" />
          </label>
        </Section>

        <Section n={4} title={t.steps.site} lang={lang}>
          <div className="grid gap-4 sm:grid-cols-[1fr_0.6fr]">
            <label className={labelClass}>
              {f.area}
              <input name="area" inputMode="decimal" className="field" />
            </label>
            <Select name="areaUnit" label={f.unit} options={f.areaUnits} />
          </div>
          <Choice name="roofType" label={f.roofType} options={f.roofTypes} cols="sm:grid-cols-2" />
        </Section>

        <Section n={5} title={t.steps.backup} lang={lang}>
          <Choice name="backup" label={f.backup} options={[f.yes, f.no]} cols="sm:grid-cols-4" onChange={setBackup} />
          {backup === f.yes && (
            <div className="grid gap-4 sm:grid-cols-[0.6fr_1fr]">
              <label className={labelClass}>
                {f.backupHours}
                <input name="backupHours" inputMode="decimal" className="field" />
              </label>
              <label className={labelClass}>
                {f.priorityLoads}
                <input name="priorityLoads" className="field" />
              </label>
            </div>
          )}
          <Choice name="existing" label={f.existing} options={f.existings} />
        </Section>

        <Section n={6} title={t.steps.plan} lang={lang}>
          <Select name="budget" label={f.budget} options={f.budgets} placeholder={t.choose} />
          <Choice name="timeline" label={f.timeline} options={f.timelines} cols="sm:grid-cols-4" />
          <label className={labelClass}>
            {f.notes}
            <textarea name="notes" rows={4} className="field resize-y" />
          </label>
        </Section>

        <div className="border-t border-cream-200 pt-8">
          <button type="submit" className="btn btn-gold !min-h-[56px] w-full sm:w-auto sm:!px-8">
            <WhatsappIcon size={19} />
            {t.submit}
            <Icon name="arrowRight" size={18} />
          </button>
        </div>
      </form>

      {sentUrl && (
        <div role="status" className="py-6 sm:py-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-900 text-gold-400">
            <Icon name="check" size={24} strokeWidth={2.2} />
          </span>
          <h2 className="mt-6 text-[clamp(24px,2.6vw,32px)] font-bold leading-tight text-ink-900">{t.doneTitle}</h2>
          <p className="lead mt-4 max-w-xl text-ink-600">{t.doneBody}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
              <WhatsappIcon size={18} />
              {t.again}
            </a>
            <button type="button" onClick={() => setSentUrl(null)} className="btn btn-outline">
              {t.edit}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
