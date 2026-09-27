import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";

export type AssistantStrings = Dictionary["assistant"];

export type ChatPanelProps = {
  lang: Locale;
  t: AssistantStrings;
  open: boolean;
  onClose: () => void;
};

/** The default WhatsApp greeting — same text the old floating button used. */
export const WHATSAPP_GREETING = "Hello OSLEOS, I'd like to know more about your solar products.";
