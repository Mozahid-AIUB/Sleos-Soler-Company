import { whatsappLink } from "@/content/site";

/** Builds a tidy WhatsApp message from label/value rows and opens the chat. */
export function sendToWhatsApp(title: string, rows: [string, string | undefined][], extra?: string[]) {
  const lines = [`*${title}*`, ""];
  for (const [label, value] of rows) {
    if (value && value.trim()) lines.push(`*${label}:* ${value.trim()}`);
  }
  if (extra?.length) lines.push("", ...extra);
  const url = whatsappLink(lines.join("\n"));
  window.open(url, "_blank", "noopener,noreferrer");
  return url;
}
