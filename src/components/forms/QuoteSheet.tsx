"use client";

import { Suspense, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { localizeDigits, type Locale } from "@/i18n/config";
import { sendToWhatsApp } from "@/lib/whatsapp";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";

/*
 * Solar Project Measurement Form (client's "Measurement Form (English).pdf").
 * Answers go to WhatsApp as a pre-filled message; attached files are uploaded
 * to /api/upload first and included in the message as links.
 */

type T = Dictionary["quote"];

const MAX_FILES = 10;
const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";
const OK_TYPE = /\.(pdf|jpe?g|png)$/i;

const labelClass = "grid content-start gap-1.5 text-[14px] font-medium text-ink-900";

function Req() {
  return (
    <span aria-hidden="true" className="text-teal-600">
      {" "}*
    </span>
  );
}

function Section({ id, n, title, lang, children }: { id: string; n: number; title: string; lang: Locale; children: ReactNode }) {
  return (
    <section aria-labelledby={`mf-${id}`} className="grid gap-5 border-t border-cream-200 pt-8">
      <h2 id={`mf-${id}`} className="flex items-baseline gap-3">
        <span className="text-[13px] font-semibold tabular-nums text-teal-600">{localizeDigits(`0${n}`, lang)}</span>
        <span className="text-[19px] font-bold text-ink-900">{title}</span>
      </h2>
      {children}
    </section>
  );
}

function Hint({ children }: { children: ReactNode }) {
  return <span className="text-[13px] font-normal leading-relaxed text-ink-400">{children}</span>;
}

/** Text or number input; `unit` renders as a suffix inside the field. */
function Field({
  name,
  label,
  unit,
  hint,
  required,
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
  className = "",
}: {
  name: string;
  label: string;
  unit?: string;
  hint?: string;
  required?: boolean;
  type?: string;
  inputMode?: "numeric" | "decimal" | "tel" | "email" | "url";
  autoComplete?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`${labelClass} ${className}`}>
      <span>
        {label}
        {required && <Req />}
      </span>
      <span className="relative">
        <input
          name={name}
          type={type}
          required={required}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`field placeholder:text-ink-400 ${unit ? "pr-20" : ""}`}
        />
        {unit && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] font-medium text-ink-400">{unit}</span>
        )}
      </span>
      {hint && <Hint>{hint}</Hint>}
    </label>
  );
}

/** Choice tiles (native radios or checkboxes, keyboard friendly). */
function Choice({
  name,
  label,
  hint,
  options,
  multiple,
  required,
  cols = "sm:grid-cols-3",
  onChange,
}: {
  name: string;
  label: string;
  hint?: string;
  options: readonly string[];
  multiple?: boolean;
  required?: boolean;
  cols?: string;
  onChange?: (value: string, checked: boolean) => void;
}) {
  return (
    <fieldset className="grid gap-2.5">
      <legend className="mb-2.5 text-[14px] font-medium text-ink-900">
        {label}
        {required && <Req />}
        {hint && (
          <>
            {" "}
            <Hint>{hint}</Hint>
          </>
        )}
      </legend>
      <div className={`grid grid-cols-2 gap-2 ${cols}`}>
        {options.map((o) => (
          <label
            key={o}
            className="flex min-h-12 cursor-pointer items-center gap-2.5 rounded-md border border-cream-200 bg-white px-3.5 py-2.5 text-[14px] leading-snug text-ink-600 transition-colors hover:border-ink-400 has-[:checked]:border-forest-900 has-[:checked]:bg-forest-900 has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-500"
          >
            <input
              type={multiple ? "checkbox" : "radio"}
              name={name}
              value={o}
              required={required && !multiple}
              onChange={(e) => onChange?.(o, e.currentTarget.checked)}
              className="sr-only"
            />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** A choice group whose last option ("Other") reveals a text box, like the paper form's "Other: ____". */
function ChoiceWithOther(props: Omit<Parameters<typeof Choice>[0], "onChange"> & { otherLabel: string; other: string }) {
  const { otherLabel, other, ...choice } = props;
  const [picked, setPicked] = useState<Set<string>>(new Set());
  return (
    <div className="grid gap-3">
      <Choice
        {...choice}
        onChange={(v, checked) =>
          setPicked((prev) => {
            const next = new Set(choice.multiple ? prev : []);
            if (checked) next.add(v);
            else next.delete(v);
            return next;
          })
        }
      />
      {picked.has(other) && <Field name={`${choice.name}Other`} label={otherLabel} />}
    </div>
  );
}

function Select({ name, label, options }: { name: string; label: string; options: readonly string[] }) {
  return (
    <label className={labelClass}>
      {label}
      <span className="relative">
        <select name={name} defaultValue={options[0]} className="field appearance-none pr-10">
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <Icon name="chevronDown" size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
      </span>
    </label>
  );
}

function TextArea({ name, label, hint, placeholder, rows = 4 }: { name: string; label: string; hint?: string; placeholder?: string; rows?: number }) {
  return (
    <label className={labelClass}>
      {label}
      <textarea name={name} rows={rows} placeholder={placeholder} className="field resize-y placeholder:text-ink-400" />
      {hint && <Hint>{hint}</Hint>}
    </label>
  );
}

type Picked = { file: File; key: string };

/** File picker with drag-and-drop; validation happens here, upload on submit. */
function Files({
  label,
  hint,
  t,
  files,
  onChange,
  total,
}: {
  label: string;
  hint: string;
  t: T["upload"];
  files: Picked[];
  onChange: (files: Picked[]) => void;
  total: number;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [over, setOver] = useState(false);

  const add = (list: FileList | null) => {
    if (!list) return;
    const errs: string[] = [];
    const next = [...files];
    let room = MAX_FILES - total;
    for (const file of Array.from(list)) {
      if (!OK_TYPE.test(file.name)) errs.push(`${file.name} ${t.badType}`);
      else if (file.size > MAX_BYTES) errs.push(`${file.name} ${t.tooLarge}`);
      else if (room <= 0) {
        errs.push(t.tooMany);
        break;
      } else {
        next.push({ file, key: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}` });
        room--;
      }
    }
    setErrors(errs);
    onChange(next);
    if (input.current) input.current.value = "";
  };

  return (
    <div className="grid gap-2.5">
      <p className="text-[14px] font-medium text-ink-900">{label}</p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          add(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center gap-2 rounded-lg border border-dashed px-5 py-7 text-center transition-colors ${
          over ? "border-gold-500 bg-gold-300/15" : "border-cream-200 bg-cream-50"
        }`}
      >
        <Icon name="upload" size={22} className="text-ink-400" />
        <p className="text-[14px] text-ink-600">
          <button type="button" onClick={() => input.current?.click()} className="font-semibold text-ink-900 underline decoration-gold-500 underline-offset-4">
            {t.choose}
          </button>{" "}
          {t.drop}
        </p>
        <p className="text-[12.5px] text-ink-400">{t.types}</p>
        <input ref={input} type="file" multiple accept={ACCEPT} onChange={(e) => add(e.currentTarget.files)} className="sr-only" tabIndex={-1} aria-label={label} />
      </div>
      <Hint>{hint}</Hint>
      {files.length > 0 && (
        <ul className="grid gap-1.5">
          {files.map(({ file, key }) => (
            <li key={key} className="flex items-center justify-between gap-3 rounded-md border border-cream-200 bg-white px-3.5 py-2.5 text-[13.5px]">
              <span className="flex min-w-0 items-center gap-2 text-ink-900">
                <Icon name={/\.pdf$/i.test(file.name) ? "file" : "image"} size={16} className="shrink-0 text-ink-400" />
                <span className="truncate">{file.name}</span>
                <span className="shrink-0 text-ink-400">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
              </span>
              <button type="button" onClick={() => onChange(files.filter((f) => f.key !== key))} className="shrink-0 font-medium text-ink-600 hover:text-ink-900">
                {t.remove}
              </button>
            </li>
          ))}
        </ul>
      )}
      {errors.length > 0 && (
        <ul role="alert" className="grid gap-1 text-[13px] text-red-700">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
    </div>
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

async function upload(file: File): Promise<string | null> {
  const body = new FormData();
  body.append("file", file);
  try {
    const res = await fetch("/api/upload", { method: "POST", body });
    if (!res.ok) return null;
    const data = (await res.json()) as { url?: string };
    return data.url ?? null;
  } catch {
    return null;
  }
}

export function QuoteSheet({ lang, t, productNames }: { lang: Locale; t: T; productNames: Record<string, string> }) {
  const f = t.f;
  const u = t.units;
  const [photos, setPhotos] = useState<Picked[]>([]);
  const [bills, setBills] = useState<Picked[]>([]);
  const [system, setSystem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const hybrid = f.systemTypes[2];

  return (
    <>
      <form
        hidden={!!sentUrl}
        className="grid gap-10 [&>section:first-of-type]:border-t-0 [&>section:first-of-type]:pt-0"
        onSubmit={async (e) => {
          e.preventDefault();
          if (busy) return;
          const form = e.currentTarget;
          const d = new FormData(form);
          const v = (k: string) =>
            d
              .getAll(k)
              .map((x) => String(x).trim())
              .filter(Boolean)
              .join(", ");
          const withUnit = (k: string, unit: string) => (v(k) ? `${v(k)} ${unit}` : "");
          // "Other" plus the typed answer, as on the paper form ("Other: ____").
          const withOther = (k: string, options: readonly string[]) => {
            const other = options[options.length - 1];
            const text = v(`${k}Other`);
            return text ? v(k).replace(other, `${other}: ${text}`) : v(k);
          };

          // Open the WhatsApp tab now, inside the click, so pop-up blockers allow it; fill it after the uploads.
          const tab = photos.length + bills.length > 0 ? window.open("", "_blank") : null;
          setBusy(true);
          setUploadFailed(false);
          const links = async (list: Picked[]) => (await Promise.all(list.map((p) => upload(p.file)))).map((url, i) => url ?? `${list[i].file.name} ✗`);
          const [photoLinks, billLinks] = await Promise.all([links(photos), links(bills)]);
          const failed = [...photoLinks, ...billLinks].some((l) => l.endsWith("✗"));
          setUploadFailed(failed);
          setBusy(false);

          const size = v("roofLength") || v("roofWidth") ? `${v("roofLength") || "?"} × ${v("roofWidth") || "?"} ${v("roofUnit")}` : "";
          const rows: [string, string][] = [
            [f.product, v("product")],
            [`1. ${f.projectName}`, v("projectName")],
            [`2. ${f.projectType}`, withOther("projectType", f.projectTypes)],
            [`3. ${f.location}`, v("location")],
            [`4. ${f.company}`, v("company")],
            [`5. ${f.contactPerson}`, v("contactPerson")],
            [`6. ${f.designation}`, v("designation")],
            [`7. ${f.phone}`, v("phone")],
            [`8. ${f.email}`, v("email")],
            [`9. ${f.mapsLink}`, v("mapsLink")],
            [`11. ${f.hours}`, withOther("hours", f.hoursOptions)],
            [`12. ${f.transformer}`, withUnit("transformer", u.kva)],
            [`13. ${f.generator}`, withUnit("generator", u.kva)],
            [`14. ${f.dailyUse}`, withUnit("dailyUse", u.kwhDay)],
            [`15. ${f.monthlyUse}`, withUnit("monthlyUse", u.kwhMonth)],
            [`16. ${f.sanctionLoad}`, withUnit("sanctionLoad", u.kva)],
            [`17. ${f.connectedLoad}`, withUnit("connectedLoad", u.kva)],
            [`18. ${f.maxLoad}`, withUnit("maxLoad", u.kva)],
            [`19. ${f.avgLoad}`, withUnit("avgLoad", u.kva)],
            [`20. ${f.loadList}`, v("loadList")],
            [`22. ${f.roofSize}`, size],
            [`23. ${f.roofType}`, withOther("roofType", f.roofTypes)],
            [`24. ${f.backupLoad}`, withUnit("backupLoad", u.kw)],
            [`25. ${f.backupTime}`, withUnit("backupTime", u.hours)],
            [`26. ${f.loadShedding}`, withUnit("loadShedding", u.hours)],
            [`27. ${f.inverterLocation}`, v("inverterLocation")],
            [`28. ${f.distanceMdb}`, withUnit("distanceMdb", u.meters)],
            [`29. ${f.distanceSdb}`, withUnit("distanceSdb", u.meters)],
            [`30. ${f.roofHeight}`, withUnit("roofHeight", u.meters)],
            [`31. ${f.purlin}`, withUnit("purlin", u.meters)],
            [`32. ${f.goal}`, withOther("goal", f.goals)],
            [`33. ${f.ai}`, v("ai")],
            [`34. ${f.selfCleaning}`, v("selfCleaning")],
            [`35. ${f.systemType}`, v("systemType")],
            [`36. ${f.hybridBackup}`, withUnit("hybridBackup", u.hours)],
            [t.sections.notes, v("notes")],
          ];
          const extra = [
            ...(photoLinks.length ? ["", `*10. ${f.photos}:*`, ...photoLinks] : []),
            ...(billLinks.length ? ["", `*21. ${f.bills}:*`, ...billLinks] : []),
          ];
          const url = sendToWhatsApp(`${t.title} — OSLEOS website`, rows, extra, tab);
          setSentUrl(url);
          window.scrollTo({ top: (form.parentElement?.getBoundingClientRect().top ?? 0) + window.scrollY - 120 });
        }}
      >
        <p className="text-[14px] leading-relaxed text-ink-600">{t.note}</p>

        <Section id="project" n={1} title={t.sections.project} lang={lang}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="projectName" label={f.projectName} />
            <Field name="location" label={f.location} required autoComplete="address-level2" />
            <Field name="company" label={f.company} autoComplete="organization" />
            <Field name="contactPerson" label={f.contactPerson} required autoComplete="name" />
            <Field name="designation" label={f.designation} autoComplete="organization-title" />
            <Field name="phone" label={f.phone} required type="tel" inputMode="tel" autoComplete="tel" />
            <Field name="email" label={f.email} type="email" inputMode="email" autoComplete="email" />
            <Field name="mapsLink" label={f.mapsLink} type="url" inputMode="url" placeholder={f.mapsHint} />
            <Suspense fallback={null}>
              <ProductField label={f.product} names={productNames} />
            </Suspense>
          </div>
          <ChoiceWithOther name="projectType" label={f.projectType} options={f.projectTypes} other={f.projectTypes[f.projectTypes.length - 1]} otherLabel={t.otherSpecify} />
          <Files label={f.photos} hint={f.photosHint} t={t.upload} files={photos} onChange={setPhotos} total={photos.length + bills.length} />
        </Section>

        <Section id="electricity" n={2} title={t.sections.electricity} lang={lang}>
          <ChoiceWithOther name="hours" label={f.hours} options={f.hoursOptions} other={f.hoursOptions[f.hoursOptions.length - 1]} otherLabel={t.otherSpecify} cols="sm:grid-cols-5" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="transformer" label={f.transformer} unit={u.kva} inputMode="decimal" />
            <Field name="generator" label={f.generator} unit={u.kva} inputMode="decimal" />
            <Field name="dailyUse" label={f.dailyUse} unit={u.kwhDay} inputMode="decimal" />
            <Field name="monthlyUse" label={f.monthlyUse} unit={u.kwhMonth} inputMode="decimal" />
            <Field name="sanctionLoad" label={f.sanctionLoad} unit={u.kva} inputMode="decimal" />
            <Field name="connectedLoad" label={f.connectedLoad} unit={u.kva} inputMode="decimal" />
            <Field name="maxLoad" label={f.maxLoad} unit={u.kva} inputMode="decimal" />
            <Field name="avgLoad" label={f.avgLoad} unit={u.kva} inputMode="decimal" />
          </div>
          <TextArea name="loadList" label={f.loadList} placeholder={f.loadListHint} rows={5} />
          <Files label={f.bills} hint={f.billsHint} t={t.upload} files={bills} onChange={setBills} total={photos.length + bills.length} />
        </Section>

        <Section id="roof" n={3} title={t.sections.roof} lang={lang}>
          <fieldset className="grid gap-2.5">
            <legend className="mb-2.5 text-[14px] font-medium text-ink-900">{f.roofSize}</legend>
            <div className="grid grid-cols-[1fr_1fr_0.8fr] gap-3 sm:gap-4">
              <Field name="roofLength" label={f.length} inputMode="decimal" />
              <Field name="roofWidth" label={f.width} inputMode="decimal" />
              <Select name="roofUnit" label={f.lengthUnits.join(" / ")} options={f.lengthUnits} />
            </div>
          </fieldset>
          <ChoiceWithOther name="roofType" label={f.roofType} options={f.roofTypes} other={f.roofTypes[f.roofTypes.length - 1]} otherLabel={t.otherSpecify} cols="sm:grid-cols-4" />
        </Section>

        <Section id="backup" n={4} title={t.sections.backup} lang={lang}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field name="backupLoad" label={f.backupLoad} unit={u.kw} inputMode="decimal" />
            <Field name="backupTime" label={f.backupTime} unit={u.hours} inputMode="decimal" />
            <Field name="loadShedding" label={f.loadShedding} unit={u.hours} inputMode="decimal" />
          </div>
        </Section>

        <Section id="inverter" n={5} title={t.sections.inverter} lang={lang}>
          <Field name="inverterLocation" label={f.inverterLocation} placeholder={f.inverterLocationHint} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="distanceMdb" label={f.distanceMdb} unit={u.meters} inputMode="decimal" />
            <Field name="distanceSdb" label={f.distanceSdb} unit={u.meters} inputMode="decimal" />
          </div>
        </Section>

        <Section id="structure" n={6} title={t.sections.structure} lang={lang}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="roofHeight" label={f.roofHeight} unit={u.meters} inputMode="decimal" />
            <Field name="purlin" label={f.purlin} unit={u.meters} inputMode="decimal" hint={f.purlinHint} />
          </div>
        </Section>

        <Section id="objective" n={7} title={t.sections.objective} lang={lang}>
          <ChoiceWithOther name="goal" label={f.goal} hint={f.goalHint} options={f.goals} multiple other={f.goals[f.goals.length - 1]} otherLabel={t.otherSpecify} cols="sm:grid-cols-2" />
          <div className="grid gap-6 sm:grid-cols-2">
            <Choice name="ai" label={f.ai} options={[t.yes, t.no]} cols="grid-cols-2" />
            <Choice name="selfCleaning" label={f.selfCleaning} options={[t.yes, t.no]} cols="grid-cols-2" />
          </div>
          <Choice name="systemType" label={f.systemType} options={f.systemTypes} onChange={(val, on) => on && setSystem(val)} />
          {system === hybrid && <Field name="hybridBackup" label={f.hybridBackup} unit={u.hours} inputMode="decimal" className="sm:max-w-[calc(50%-0.5rem)]" />}
        </Section>

        <Section id="notes" n={8} title={t.sections.notes} lang={lang}>
          <TextArea name="notes" label={f.notes} />
        </Section>

        <div className="grid gap-3 border-t border-cream-200 pt-8">
          <button type="submit" disabled={busy} className="btn btn-gold !min-h-[56px] w-full disabled:opacity-70 sm:w-auto sm:justify-self-start sm:!px-8">
            <WhatsappIcon size={19} />
            {busy ? t.upload.uploading : t.submit}
            {!busy && <Icon name="arrowRight" size={18} />}
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
          {uploadFailed && <p className="mt-3 max-w-xl text-[14px] text-red-700">{t.upload.failed}</p>}
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
