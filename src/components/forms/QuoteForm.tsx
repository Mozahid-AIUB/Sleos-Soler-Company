"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { sendToWhatsApp } from "@/lib/whatsapp";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";

export function QuoteForm({ t }: { t: Dictionary["contact"] }) {
  const [type, setType] = useState(0);
  const [done, setDone] = useState(false);

  return (
    <form
      className="grid gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        const v = (k: string) => String(d.get(k) ?? "");
        sendToWhatsApp("Quote request — OSLEOS website", [
          ["Project type", t.types[type]],
          ["Product", new URLSearchParams(window.location.search).get("product") ?? undefined],
          ["Name", v("name")],
          ["Phone", v("phone")],
          ["Email", v("email")],
          ["Location", v("location")],
          ["Details", v("message")],
        ]);
        setDone(true);
      }}
    >
      <fieldset>
        <legend className="mb-3 text-[14.5px] font-semibold">{t.projectType}</legend>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {t.types.map((label, i) => (
            <label
              key={label}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-[14.5px] font-medium transition-colors ${
                type === i ? "border-teal-600 bg-teal-600/[0.06] text-ink-900" : "border-cream-200 bg-white text-ink-600 hover:border-ink-400"
              }`}
            >
              <input type="radio" name="type" value={i} checked={type === i} onChange={() => setType(i)} className="sr-only" />
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${type === i ? "border-teal-600" : "border-cream-200"}`}>
                {type === i && <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />}
              </span>
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-[14px] font-medium">
          {t.name}
          <input name="name" required autoComplete="name" className="field" />
        </label>
        <label className="grid gap-1.5 text-[14px] font-medium">
          {t.phone}
          <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" className="field" />
        </label>
        <label className="grid gap-1.5 text-[14px] font-medium">
          {t.email}
          <input name="email" type="email" autoComplete="email" className="field" />
        </label>
        <label className="grid gap-1.5 text-[14px] font-medium">
          {t.location}
          <input name="location" autoComplete="address-level2" className="field" />
        </label>
      </div>
      <label className="grid gap-1.5 text-[14px] font-medium">
        {t.message}
        <textarea name="message" rows={4} className="field resize-y" />
      </label>

      <button type="submit" className="btn btn-gold !min-h-[54px] w-full sm:w-auto sm:justify-self-start">
        <WhatsappIcon size={19} />
        {t.submit}
        <Icon name="arrowRight" size={18} />
      </button>
      {done && (
        <p role="status" className="flex items-center gap-2 text-[14.5px] font-medium text-teal-600">
          <Icon name="check" size={18} strokeWidth={2.4} />
          {t.done}
        </p>
      )}
    </form>
  );
}
