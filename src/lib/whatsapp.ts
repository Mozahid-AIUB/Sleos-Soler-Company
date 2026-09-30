import { whatsappLink } from "@/content/site";

/**
 * Builds a tidy WhatsApp message from label/value rows and opens the chat.
 * `tab` is a window opened earlier in the click handler (needed when the
 * message is sent after an async step such as file uploads, which pop-up
 * blockers would otherwise stop).
 */
export function sendToWhatsApp(title: string, rows: [string, string | undefined][], extra?: string[], tab?: Window | null) {
  const lines = [`*${title}*`, ""];
  for (const [label, value] of rows) {
    if (value && value.trim()) lines.push(`*${label}:* ${value.trim()}`);
  }
  if (extra?.length) lines.push("", ...extra);
  const url = whatsappLink(lines.join("\n"));
  if (tab && !tab.closed) tab.location.href = url;
  else window.open(url, "_blank", "noopener,noreferrer");
  return url;
}
