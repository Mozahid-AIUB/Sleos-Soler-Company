import { site, waLink } from "@/content/site";

/** WhatsApp number from the admin (set by SiteProvider); the built-in one until then. */
let liveWhatsapp: string = site.whatsapp;
export const setLiveWhatsapp = (digits: string) => {
  liveWhatsapp = digits;
};

/** WhatsApp link with a tidy message built from label/value rows. */
export function whatsAppUrl(title: string, rows: [string, string | undefined][], extra?: string[]) {
  const lines = [`*${title}*`, ""];
  for (const [label, value] of rows) {
    if (value && value.trim()) lines.push(`*${label}:* ${value.trim()}`);
  }
  if (extra?.length) lines.push("", ...extra);
  return waLink(liveWhatsapp, lines.join("\n"));
}

/** Builds the message (see whatsAppUrl) and opens the chat. */
export function sendToWhatsApp(title: string, rows: [string, string | undefined][], extra?: string[]) {
  const url = whatsAppUrl(title, rows, extra);
  window.open(url, "_blank", "noopener,noreferrer");
  return url;
}
