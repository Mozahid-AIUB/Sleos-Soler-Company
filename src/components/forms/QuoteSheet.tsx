"use client";

import { Suspense, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { localeTags, localizeDigits, type Locale } from "@/i18n/config";
import { useSite } from "@/components/layout/SiteProvider";
import { whatsAppUrl } from "@/lib/whatsapp";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";

/*
 * Solar Project Measurement Form (client's "Measurement Form (English).pdf").
 * Questions are numbered 1-43 and grouped into 8 sections exactly like the
 * PDF. Answers go to WhatsApp as a pre-filled message. Attached files never
 * leave the visitor's device through our server: after the message, phones
 * that support the Web Share API send them straight to WhatsApp; elsewhere the
 * visitor is asked to attach them in the chat. After sending, the answers can
 * also be saved as a PDF through the browser's print dialog (see PrintSheet).
 */

type T = Dictionary["quote"];

const MAX_FILES = 10;
const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";
const OK_TYPE = /\.(pdf|jpe?g|png)$/i;

const labelClass = "grid content-start gap-1.5 text-[14px] font-medium text-ink-900";

/** Row of the submitted-answers summary; a null value makes it a sub-heading. */
type Row = [label: string, value: string | null];
type Group = { title: string; rows: Row[] };
type Sent = { url: string; groups: Group[]; date: string };

function Req() {
  return (
    <span aria-hidden="true" className="font-semibold text-red-600">
      {" "}*
    </span>
  );
}

/** Question label: PDF number (muted), text and the required star. */
function Lbl({ no, label, star = true }: { no?: string; label: string; star?: boolean }) {
  return (
    <>
      {no && <span className="mr-1.5 tabular-nums text-ink-400">{no}</span>}
      {label}
      {star && <Req />}
    </>
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
  no,
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
  no?: string;
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
        <Lbl no={no} label={label} />
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

/** Number input with a unit picker inside the field (the PDF's "___ m / ___ ft" and "kW / MW" blanks). */
function Measure({
  name,
  no,
  label,
  units,
  hint,
  className = "",
}: {
  name: string;
  no?: string;
  label: string;
  units: readonly string[];
  hint?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={`${labelClass} ${className}`}>
      <label htmlFor={id}>
        <Lbl no={no} label={label} />
      </label>
      <span className="relative">
        <input id={id} name={name} type="text" inputMode="decimal" className="field pr-24 placeholder:text-ink-400" />
        <span className="absolute right-1.5 top-1/2 -translate-y-1/2">
          <select
            name={`${name}Unit`}
            defaultValue={units[0]}
            aria-label={units.join(" / ")}
            className="h-9 appearance-none rounded bg-cream-50 pl-2.5 pr-7 text-[13px] font-medium text-ink-600"
          >
            {units.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
          <Icon name="chevronDown" size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ink-400" />
        </span>
      </span>
      {hint && <Hint>{hint}</Hint>}
    </div>
  );
}

/** Choice tiles (native radios or checkboxes, keyboard friendly). */
function Choice({
  name,
  no,
  label,
  hint,
  options,
  multiple,
  required,
  cols = "sm:grid-cols-3",
  onChange,
}: {
  name: string;
  no?: string;
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
        <Lbl no={no} label={label} />
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

function TextArea({ name, no, label, hint, placeholder, rows = 4 }: { name: string; no?: string; label: string; hint?: string; placeholder?: string; rows?: number }) {
  return (
    <label className={labelClass}>
      <span>
        <Lbl no={no} label={label} />
      </span>
      <textarea name={name} rows={rows} placeholder={placeholder} className="field resize-y placeholder:text-ink-400" />
      {hint && <Hint>{hint}</Hint>}
    </label>
  );
}

type Picked = { file: File; key: string };

/** File picker with drag-and-drop. Files stay in the browser (see ShareFiles). */
function Files({
  no,
  label,
  hint,
  t,
  files,
  onChange,
  total,
}: {
  no?: string;
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
      <p className="text-[14px] font-medium text-ink-900">
        <Lbl no={no} label={label} />
      </p>
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

/**
 * Step 2 after the WhatsApp message: hand the chosen files to the phone's
 * share sheet (WhatsApp shows up there), or list them to attach by hand.
 */
function ShareFiles({ files, t }: { files: File[]; t: T["upload"] }) {
  const [canShare] = useState(() => typeof navigator !== "undefined" && !!navigator.canShare?.({ files }));
  return (
    <div className="mt-8 max-w-xl rounded-lg border border-cream-200 bg-cream-50 p-5 sm:p-6">
      <p className="font-semibold text-ink-900">{t.shareTitle}</p>
      {canShare ? (
        <>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-600">{t.shareBody}</p>
          <button type="button" onClick={() => void navigator.share({ files }).catch(() => {})} className="btn btn-dark mt-4 w-full sm:w-auto">
            <WhatsappIcon size={18} />
            {t.share}
          </button>
        </>
      ) : (
        <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-600">{t.manual}</p>
      )}
      <ul className="mt-3 grid gap-1 text-[13.5px] text-ink-600">
        {files.map((f, i) => (
          <li key={`${f.name}-${i}`} className="flex items-center gap-2">
            <Icon name={/\.pdf$/i.test(f.name) ? "file" : "image"} size={15} className="shrink-0 text-ink-400" />
            <span className="truncate">{f.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Printable copy of the submitted answers. It lives in a portal on <body>,
 * hidden on screen; the `.qs-print` rules in globals.css hide everything else
 * when printing, so "Download PDF" (window.print + "Save as PDF") produces a
 * clean one-document PDF in any language, Bangla included.
 */
function PrintSheet({ t, lang, sent }: { t: T; lang: Locale; sent: Sent }) {
  const site = useSite();
  const address = lang === "bn" ? site.address.bn : site.address.en;
  return createPortal(
    <div className="qs-print" lang={localeTags[lang]}>
      <header className="flex items-start justify-between gap-6 border-b-2 border-ink-900 pb-4">
        <Logo light={false} animated={false} className="h-10" />
        <div className="text-right">
          <p className="text-[15px] font-bold">{t.title}</p>
          <p className="mt-1 text-[11px] text-ink-600">
            {t.print.date}: {sent.date}
          </p>
        </div>
      </header>
      <p className="mt-4 text-[11px] text-ink-600">{t.print.footnote}</p>

      {sent.groups.map((g) => (
        <section key={g.title} className="mt-5">
          <h2 className="qs-print-head bg-cream-100 px-3 py-1.5 text-[13px] font-bold">{g.title}</h2>
          <table className="w-full border-collapse text-[11.5px]">
            <tbody>
              {g.rows.map(([label, value], i) =>
                value === null ? (
                  <tr key={`${label}-${i}`}>
                    <th colSpan={2} className="border-b border-cream-200 px-3 py-1.5 text-left font-semibold">
                      {label}
                    </th>
                  </tr>
                ) : (
                  <tr key={`${label}-${i}`}>
                    <th className="w-[46%] border-b border-cream-200 px-3 py-1.5 text-left align-top font-semibold">{label}</th>
                    <td className="whitespace-pre-line break-words border-b border-cream-200 px-3 py-1.5 align-top">{value || "—"}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </section>
      ))}

      <div className="qs-print-sign mt-10 grid grid-cols-3 gap-6 text-[11px]">
        {[t.print.preparedBy, t.print.clientSignature, t.print.date].map((l) => (
          <p key={l} className="border-t border-ink-600 pt-1.5">
            {l}
          </p>
        ))}
      </div>

      <footer className="mt-8 border-t border-cream-200 pt-3 text-[10.5px] leading-relaxed text-ink-600">
        <p className="font-semibold text-ink-900">OSLEOS · {site.url.replace("https://", "")} · {site.email}</p>
        <p>
          {site.phones.map((p) => p.display).join(" · ")} · {address}
        </p>
      </footer>
    </div>,
    document.body,
  );
}

/** Reads ?product= on the client so the page itself stays static. */
function ProductField({ label, names }: { label: string; names: Record<string, string> }) {
  const slug = useSearchParams().get("product");
  if (!slug) return null;
  return (
    <label className={`${labelClass} sm:col-span-2`}>
      <span>
        <Lbl label={label} />
      </span>
      <input name="product" defaultValue={names[slug] ?? slug} className="field" />
    </label>
  );
}

export function QuoteSheet({ lang, t, productNames }: { lang: Locale; t: T; productNames: Record<string, string> }) {
  const f = t.f;
  const u = t.units;
  const [photos, setPhotos] = useState<Picked[]>([]);
  const [bills, setBills] = useState<Picked[]>([]);
  const [sent, setSent] = useState<Sent | null>(null);
  // The form is saved for the admin first; WhatsApp is then a button the visitor taps.
  // (Opening WhatsApp straight away sent this tab to the background, where browsers pause the
  // drawing below, so on phones the form often never arrived.)
  const [saving, setSaving] = useState<"saving" | "saved" | "failed">("saving");
  const pending = useRef<FormData | null>(null);

  // After "Send form": draw the printable copy as a picture (Bangla included, exactly as on screen)
  // and upload it with the photos and bills; the server turns them into one PDF for the admin.
  useEffect(() => {
    const body = pending.current;
    if (!sent || !body) return;
    pending.current = null;
    void (async () => {
      const sheet = document.querySelector<HTMLElement>(".qs-print");
      if (sheet) {
        sheet.classList.add("qs-print--capture");
        try {
          await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
          await document.fonts?.ready;
          const top = sheet.getBoundingClientRect().top;
          // Good places for a page break: the top of each section and row.
          const breaks = Array.from(sheet.querySelectorAll("section, tr, footer, .qs-print-sign"), (n) => Math.round(n.getBoundingClientRect().top - top));
          const { toJpeg } = await import("html-to-image");
          const url = await toJpeg(sheet, { quality: 0.92, pixelRatio: 2, backgroundColor: "#ffffff", style: { position: "static", left: "0", top: "0" } });
          body.append("sheet", await (await fetch(url)).blob(), "form.jpg");
          body.append("sheetWidth", String(sheet.offsetWidth));
          body.append("breaks", JSON.stringify(breaks));
        } catch {
          /* the form still goes out; the admin then lists the answers instead */
        } finally {
          sheet.classList.remove("qs-print--capture");
        }
      }
      const res = await fetch("/api/measurement-form", { method: "POST", body }).catch(() => null);
      setSaving(res?.ok ? "saved" : "failed");
    })();
  }, [sent]);
  // "1." and, for the PDF's sub-items, "39(i)." with locale digits (Bangla).
  const N = (n: number, sub?: string) => localizeDigits(`${n}`, lang) + (sub ?? "") + ".";
  const capacityUnits = [u.kw, u.mw] as const;

  const printPdf = () => {
    const title = document.title;
    document.title = `OSLEOS - ${t.title}`;
    try {
      window.print();
    } finally {
      document.title = title;
    }
  };

  return (
    <>
      <form
        hidden={!!sent}
        className="grid gap-10 [&>section:first-of-type]:border-t-0 [&>section:first-of-type]:pt-0"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const d = new FormData(form);
          const v = (k: string) =>
            d
              .getAll(k)
              .map((x) => String(x).trim())
              .filter(Boolean)
              .join(", ");
          const withUnit = (k: string, unit: string) => (v(k) ? `${v(k)} ${unit}` : "");
          // Number plus the unit picked beside it (m / ft, kW / MW).
          const measure = (k: string) => (v(k) ? `${v(k)} ${v(`${k}Unit`)}` : "");
          // "Other" plus the typed answer, as on the paper form ("Other: ____").
          const withOther = (k: string, options: readonly string[]) => {
            const other = options[options.length - 1];
            const text = v(`${k}Other`);
            return text ? v(k).replace(other, `${other}: ${text}`) : v(k);
          };
          // "Transformer 1: 100 kVA, Others: 50 kVA" from the numbered boxes.
          const each = (k: string, labels: readonly string[], unit: string) =>
            labels
              .map((l, i) => (v(`${k}${i}`) ? `${l}: ${v(`${k}${i}`)} ${unit}` : ""))
              .filter(Boolean)
              .join(", ");
          const names = (list: Picked[]) => list.map((x) => x.file.name).join(", ");

          const size = v("roofLength") || v("roofWidth") ? `${v("roofLength") || "?"} × ${v("roofWidth") || "?"} ${v("roofUnit")}` : "";
          const title = (n: number, text: string) => `${N(n)} ${text}`;
          const groups: Group[] = [
            {
              title: title(1, t.sections.project),
              rows: [
                ...(v("product") ? ([[f.product, v("product")]] as Row[]) : []),
                [`${N(1)} ${f.projectName}`, v("projectName")],
                [`${N(2)} ${f.projectType}`, withOther("projectType", f.projectTypes)],
                [`${N(3)} ${f.location}`, v("location")],
                [`${N(4)} ${f.company}`, v("company")],
                [`${N(5)} ${f.contactPerson}`, v("contactPerson")],
                [`${N(6)} ${f.designation}`, v("designation")],
                [`${N(7)} ${f.phone}`, v("phone")],
                [`${N(8)} ${f.email}`, v("email")],
                [`${N(9)} ${f.mapsLink}`, v("mapsLink")],
                [`${N(10)} ${f.photos}`, names(photos)],
              ],
            },
            {
              title: title(2, t.sections.existing),
              rows: [
                [`${N(11)} ${f.existingSolar}`, v("existingSolar")],
                [`${N(12)} ${f.existingCapacity}`, measure("existingCapacity")],
                [`${N(13)} ${f.expand}`, v("expand")],
                [`${N(14)} ${f.expandCapacity}`, measure("expandCapacity")],
              ],
            },
            {
              title: title(3, t.sections.objective),
              rows: [
                [`${N(15)} ${f.goal}`, withOther("goal", f.goals)],
                [`${N(16)} ${f.systemType}`, v("systemType")],
                [`${N(17)} ${f.backupRequired}`, withUnit("backupRequired", u.hours)],
                [`${N(18)} ${f.ai}`, v("ai")],
                [`${N(19)} ${f.selfCleaning}`, v("selfCleaning")],
              ],
            },
            {
              title: title(4, t.sections.electricity),
              rows: [
                [`${N(20)} ${f.hours}`, withOther("hours", f.hoursOptions)],
                [`${N(21)} ${f.dailyUse}`, withUnit("dailyUse", u.kwhDay)],
                [`${N(22)} ${f.monthlyUse}`, withUnit("monthlyUse", u.kwhMonth)],
                [`${N(23)} ${f.connectedLoad}`, withUnit("connectedLoad", u.kw)],
                [`${N(24)} ${f.sanctionLoad}`, withUnit("sanctionLoad", u.kw)],
                [`${N(25)} ${f.maxLoad}`, withUnit("maxLoad", u.kw)],
                [`${N(26)} ${f.avgLoad}`, withUnit("avgLoad", u.kw)],
                [`${N(27)} ${f.loadList}`, v("loadList")],
                [`${N(28)} ${f.phaseType}`, withOther("phaseType", f.phaseTypes)],
                [`${N(29)} ${f.transformer}`, each("transformer", f.transformerRows, u.kva)],
                [`${N(30)} ${f.generator}`, each("generator", f.generatorRows, u.kva)],
                [`${N(31)} ${f.bills}`, names(bills)],
              ],
            },
            {
              title: title(5, t.sections.backup),
              rows: [
                [`${N(32)} ${f.backupLoad}`, withUnit("backupLoad", u.kw)],
                [`${N(33)} ${f.backupTime}`, withUnit("backupTime", u.hours)],
                [`${N(34)} ${f.loadShedding}`, withUnit("loadShedding", u.hours)],
              ],
            },
            {
              title: title(6, t.sections.roof),
              rows: [
                [`${N(35)} ${f.roofSize}`, size],
                [`${N(36)} ${f.roofType}`, withOther("roofType", f.roofTypes)],
                [`${N(37)} ${f.roofHeight}`, measure("roofHeight")],
                [`${N(38)} ${f.purlin}`, measure("purlin")],
                [`${t.sections.structure}`, null],
                [`${N(39)} ${f.mountingHeight}`, null],
                [`${N(39, "(i)")} ${f.roofToBottom}`, measure("roofToBottom")],
                [`${N(39, "(ii)")} ${f.frontHeight}`, measure("frontHeight")],
                [`${N(39, "(iii)")} ${f.rearHeight}`, measure("rearHeight")],
                [`${N(39, "(iv)")} ${f.tiltAngle}`, withUnit("tiltAngle", "°")],
                [`${N(40)} ${f.elevatedPurpose}`, withOther("elevatedPurpose", f.elevatedPurposes)],
              ],
            },
            {
              title: title(7, t.sections.inverter),
              rows: [
                [`${N(41)} ${f.inverterLocation}`, v("inverterLocation")],
                [`${N(42)} ${f.distanceMdb}`, measure("distanceMdb")],
                [`${N(43)} ${f.distanceSdb}`, measure("distanceSdb")],
              ],
            },
            { title: title(8, t.sections.notes), rows: [[f.notes, v("notes")]] },
          ];
          const rows = groups.flatMap((g) => g.rows).filter((r): r is [string, string] => r[1] !== null);
          // Saved for the admin panel (Measurement forms) once the printable copy below is on the
          // page (see the effect after `sent`); the same answers are ready for WhatsApp as well.
          const url = whatsAppUrl(`${t.title} — OSLEOS website`, rows);
          const body = new FormData();
          body.append("website", v("website"));
          body.append(
            "data",
            JSON.stringify({
              lang,
              contactPerson: v("contactPerson"),
              phone: v("phone"),
              email: v("email"),
              company: v("company"),
              location: v("location"),
              projectType: withOther("projectType", f.projectTypes),
              groups,
            }),
          );
          photos.forEach((p) => body.append("photos", p.file));
          bills.forEach((p) => body.append("bills", p.file));
          pending.current = body;
          setSaving("saving");
          const date = new Date().toLocaleDateString(localeTags[lang], { day: "numeric", month: "long", year: "numeric" });
          setSent({ url, groups, date });
          window.scrollTo({ top: (form.parentElement?.getBoundingClientRect().top ?? 0) + window.scrollY - 120 });
        }}
      >
        {/* Left empty by people (hidden); bots fill it and the server ignores the form. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <div className="grid gap-2">
          <p className="text-[14px] font-medium text-ink-900">
            <span aria-hidden="true" className="font-semibold text-red-600">
              *
            </span>{" "}
            {t.legend.replace(/^\*\s*/, "")}
          </p>
          <p className="text-[14px] leading-relaxed text-ink-600">{t.note}</p>
        </div>

        <Section id="project" n={1} title={t.sections.project} lang={lang}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="projectName" no={N(1)} label={f.projectName} className="sm:col-span-2" />
          </div>
          <ChoiceWithOther name="projectType" no={N(2)} label={f.projectType} options={f.projectTypes} other={f.projectTypes[f.projectTypes.length - 1]} otherLabel={t.otherSpecify} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="location" no={N(3)} label={f.location} required autoComplete="address-level2" />
            <Field name="company" no={N(4)} label={f.company} autoComplete="organization" />
            <Field name="contactPerson" no={N(5)} label={f.contactPerson} required autoComplete="name" />
            <Field name="designation" no={N(6)} label={f.designation} autoComplete="organization-title" />
            <Field name="phone" no={N(7)} label={f.phone} required type="tel" inputMode="tel" autoComplete="tel" />
            <Field name="email" no={N(8)} label={f.email} type="email" inputMode="email" autoComplete="email" />
            <Field name="mapsLink" no={N(9)} label={f.mapsLink} type="url" inputMode="url" placeholder={f.mapsHint} className="sm:col-span-2" />
            <Suspense fallback={null}>
              <ProductField label={f.product} names={productNames} />
            </Suspense>
          </div>
          <Files no={N(10)} label={f.photos} hint={f.photosHint} t={t.upload} files={photos} onChange={setPhotos} total={photos.length + bills.length} />
        </Section>

        <Section id="existing" n={2} title={t.sections.existing} lang={lang}>
          <div className="grid gap-6 sm:grid-cols-2">
            <Choice name="existingSolar" no={N(11)} label={f.existingSolar} options={[t.yes, t.no]} cols="grid-cols-2" />
            <Measure name="existingCapacity" no={N(12)} label={f.existingCapacity} units={capacityUnits} />
            <Choice name="expand" no={N(13)} label={f.expand} options={[t.yes, t.no]} cols="grid-cols-2" />
            <Measure name="expandCapacity" no={N(14)} label={f.expandCapacity} units={capacityUnits} />
          </div>
        </Section>

        <Section id="objective" n={3} title={t.sections.objective} lang={lang}>
          <ChoiceWithOther name="goal" no={N(15)} label={f.goal} hint={f.goalHint} options={f.goals} multiple other={f.goals[f.goals.length - 1]} otherLabel={t.otherSpecify} cols="sm:grid-cols-2" />
          <Choice name="systemType" no={N(16)} label={f.systemType} options={f.systemTypes} />
          <div className="grid gap-6 sm:grid-cols-2">
            <Field name="backupRequired" no={N(17)} label={f.backupRequired} unit={u.hours} inputMode="decimal" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <Choice name="ai" no={N(18)} label={f.ai} options={[t.yes, t.no]} cols="grid-cols-2" />
            <Choice name="selfCleaning" no={N(19)} label={f.selfCleaning} options={[t.yes, t.no]} cols="grid-cols-2" />
          </div>
        </Section>

        <Section id="electricity" n={4} title={t.sections.electricity} lang={lang}>
          <ChoiceWithOther name="hours" no={N(20)} label={f.hours} options={f.hoursOptions} other={f.hoursOptions[f.hoursOptions.length - 1]} otherLabel={t.otherSpecify} cols="sm:grid-cols-5" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="dailyUse" no={N(21)} label={f.dailyUse} unit={u.kwhDay} inputMode="decimal" />
            <Field name="monthlyUse" no={N(22)} label={f.monthlyUse} unit={u.kwhMonth} inputMode="decimal" />
            <Field name="connectedLoad" no={N(23)} label={f.connectedLoad} unit={u.kw} inputMode="decimal" />
            <Field name="sanctionLoad" no={N(24)} label={f.sanctionLoad} unit={u.kw} inputMode="decimal" />
            <Field name="maxLoad" no={N(25)} label={f.maxLoad} unit={u.kw} inputMode="decimal" />
            <Field name="avgLoad" no={N(26)} label={f.avgLoad} unit={u.kw} inputMode="decimal" />
          </div>
          <TextArea name="loadList" no={N(27)} label={f.loadList} placeholder={f.loadListHint} rows={5} />
          <ChoiceWithOther name="phaseType" no={N(28)} label={f.phaseType} options={f.phaseTypes} other={f.phaseTypes[f.phaseTypes.length - 1]} otherLabel={t.otherSpecify} />
          <fieldset className="grid gap-2.5">
            <legend className="mb-2.5 text-[14px] font-medium text-ink-900">
              <span className="mr-1.5 tabular-nums text-ink-400">{N(29)}</span>
              {f.transformer}
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {f.transformerRows.map((l, i) => (
                <Field key={l} name={`transformer${i}`} label={l} unit={u.kva} inputMode="decimal" />
              ))}
            </div>
          </fieldset>
          <fieldset className="grid gap-2.5">
            <legend className="mb-2.5 text-[14px] font-medium text-ink-900">
              <span className="mr-1.5 tabular-nums text-ink-400">{N(30)}</span>
              {f.generator}
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {f.generatorRows.map((l, i) => (
                <Field key={l} name={`generator${i}`} label={l} unit={u.kva} inputMode="decimal" />
              ))}
            </div>
          </fieldset>
          <Files no={N(31)} label={f.bills} hint={f.billsHint} t={t.upload} files={bills} onChange={setBills} total={photos.length + bills.length} />
        </Section>

        <Section id="backup" n={5} title={t.sections.backup} lang={lang}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field name="backupLoad" no={N(32)} label={f.backupLoad} unit={u.kw} inputMode="decimal" />
            <Field name="backupTime" no={N(33)} label={f.backupTime} unit={u.hours} inputMode="decimal" />
            <Field name="loadShedding" no={N(34)} label={f.loadShedding} unit={u.hours} inputMode="decimal" />
          </div>
        </Section>

        <Section id="roof" n={6} title={t.sections.roof} lang={lang}>
          <fieldset className="grid gap-2.5">
            <legend className="mb-2.5 text-[14px] font-medium text-ink-900">
              <span className="mr-1.5 tabular-nums text-ink-400">{N(35)}</span>
              {f.roofSize}
            </legend>
            <div className="grid grid-cols-[1fr_1fr_0.8fr] gap-3 sm:gap-4">
              <Field name="roofLength" label={f.length} inputMode="decimal" />
              <Field name="roofWidth" label={f.width} inputMode="decimal" />
              <Select name="roofUnit" label={f.lengthUnits.join(" / ")} options={f.lengthUnits} />
            </div>
          </fieldset>
          <ChoiceWithOther name="roofType" no={N(36)} label={f.roofType} options={f.roofTypes} other={f.roofTypes[f.roofTypes.length - 1]} otherLabel={t.otherSpecify} cols="sm:grid-cols-4" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Measure name="roofHeight" no={N(37)} label={f.roofHeight} units={f.lengthUnits} />
            <Measure name="purlin" no={N(38)} label={f.purlin} units={f.lengthUnits} hint={f.purlinHint} />
          </div>

          <h3 className="mt-2 text-[16px] font-bold text-ink-900">{t.sections.structure}</h3>
          <fieldset className="grid gap-4">
            <legend className="mb-1 text-[14px] font-medium text-ink-900">
              <span className="mr-1.5 tabular-nums text-ink-400">{N(39)}</span>
              {f.mountingHeight}
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Measure name="roofToBottom" no="(i)" label={f.roofToBottom} units={f.lengthUnits} />
              <Measure name="frontHeight" no="(ii)" label={f.frontHeight} units={f.lengthUnits} />
              <Measure name="rearHeight" no="(iii)" label={f.rearHeight} units={f.lengthUnits} />
              <Field name="tiltAngle" no="(iv)" label={f.tiltAngle} unit="°" inputMode="decimal" />
            </div>
          </fieldset>
          <ChoiceWithOther name="elevatedPurpose" no={N(40)} label={f.elevatedPurpose} options={f.elevatedPurposes} other={f.elevatedPurposes[f.elevatedPurposes.length - 1]} otherLabel={t.otherSpecify} cols="sm:grid-cols-3" />
        </Section>

        <Section id="inverter" n={7} title={t.sections.inverter} lang={lang}>
          <Field name="inverterLocation" no={N(41)} label={f.inverterLocation} placeholder={f.inverterLocationHint} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Measure name="distanceMdb" no={N(42)} label={f.distanceMdb} units={f.lengthUnits} />
            <Measure name="distanceSdb" no={N(43)} label={f.distanceSdb} units={f.lengthUnits} />
          </div>
        </Section>

        <Section id="notes" n={8} title={t.sections.notes} lang={lang}>
          <TextArea name="notes" label={f.notes} />
        </Section>

        <div className="grid gap-3 border-t border-cream-200 pt-8">
          <button type="submit" className="btn btn-gold !min-h-[56px] w-full sm:w-auto sm:justify-self-start sm:!px-8">
            {t.submit}
            <Icon name="arrowRight" size={18} />
          </button>
        </div>
      </form>

      {sent && (
        <div role="status" aria-live="polite" className="py-6 sm:py-10">
          {saving === "saving" ? (
            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="h-10 w-10 animate-spin rounded-full border-[3px] border-cream-200 border-t-gold-500" />
              <p className="text-[18px] font-semibold text-ink-900">{t.sending}</p>
            </div>
          ) : (
            <>
              <span className={`flex h-12 w-12 items-center justify-center rounded-full ${saving === "saved" ? "bg-forest-900 text-gold-400" : "bg-gold-500 text-forest-950"}`}>
                <Icon name={saving === "saved" ? "check" : "arrowRight"} size={24} strokeWidth={2.2} />
              </span>
              <h2 className="mt-6 text-[clamp(24px,2.6vw,32px)] font-bold leading-tight text-ink-900">{saving === "saved" ? t.doneTitle : t.failTitle}</h2>
              <p className="lead mt-4 max-w-xl text-ink-600">{saving === "saved" ? t.doneBody : t.failBody}</p>
              {/* Files only need sending by hand when the website could not keep them. */}
              {saving === "failed" && photos.length + bills.length > 0 && <ShareFiles files={[...photos, ...bills].map((x) => x.file)} t={t.upload} />}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={sent.url} target="_blank" rel="noopener noreferrer" className={saving === "saved" ? "btn btn-outline" : "btn btn-gold"}>
                  <WhatsappIcon size={18} />
                  {saving === "saved" ? t.again : t.submitWhatsapp}
                </a>
                <button type="button" onClick={printPdf} className="btn btn-dark">
                  <Icon name="download" size={18} />
                  {t.pdf.button}
                </button>
                <button type="button" onClick={() => setSent(null)} className="btn btn-outline">
                  {t.edit}
                </button>
              </div>
              <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-ink-400">
                <span className="font-semibold text-ink-600">{t.pdf.title}.</span> {t.pdf.body}
              </p>
            </>
          )}
          <PrintSheet t={t} lang={lang} sent={sent} />
        </div>
      )}
    </>
  );
}
