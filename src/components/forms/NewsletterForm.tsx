"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { sendToWhatsApp } from "@/lib/whatsapp";
import { Icon } from "@/components/ui/Icon";

export function NewsletterForm({ t }: { t: Dictionary["newsletter"] }) {
  const [done, setDone] = useState(false);

  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        sendToWhatsApp("Brochure request — OSLEOS website", [
          ["Email", String(data.get("email") ?? "")],
          ["Phone", String(data.get("phone") ?? "")],
        ]);
        setDone(true);
        e.currentTarget.reset();
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="sr-only">{t.email}</span>
          <input name="email" type="email" required autoComplete="email" placeholder={t.email} className="field field-dark" />
        </label>
        <label className="grid gap-1.5">
          <span className="sr-only">{t.phone}</span>
          <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder={t.phone} className="field field-dark" />
        </label>
      </div>
      <button type="submit" className="btn btn-gold w-full !min-h-[52px]">
        <Icon name="download" size={18} />
        {t.submit}
      </button>
      <p className="text-[13px] text-white/50" role="status">
        {done ? <span className="font-medium text-teal-300">{t.done}</span> : t.privacy}
      </p>
    </form>
  );
}
