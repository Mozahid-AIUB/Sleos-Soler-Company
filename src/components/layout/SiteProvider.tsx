"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { withContact, type SiteContact, type SiteInfo } from "@/content/site";
import { setLiveWhatsapp } from "@/lib/whatsapp";

const SiteContext = createContext<SiteInfo>(withContact());

/** Gives client components the contact details from the admin (see getSite in src/lib/site-content.ts). */
export function SiteProvider({ contact, children }: { contact: SiteContact; children: ReactNode }) {
  const value = useMemo(() => withContact(contact), [contact]);
  // Forms send WhatsApp messages from event handlers, outside React; keep their number current.
  setLiveWhatsapp(value.whatsapp);
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
