import { site, waLink } from "@/content/site";

/** WhatsApp number from the admin (set by SiteProvider); the built-in one until then. */
let liveWhatsapp: string = site.whatsapp;
export const setLiveWhatsapp = (digits: string) => {
  liveWhatsapp = digits;
};

/** Builds a tidy WhatsApp message from label/value rows and opens the chat. */
export function sendToWhatsApp(title: string, rows: [string, string | undefined][], extra?: string[]) {
  const lines = [`*${title}*`, ""];
  for (const [label, value] of rows) {
    if (value && value.trim()) lines.push(`*${label}:* ${value.trim()}`);
  }
  if (extra?.length) lines.push("", ...extra);
  const url = waLink(liveWhatsapp, lines.join("\n"));
  window.open(url, "_blank", "noopener,noreferrer");
  return url;
}
