import type { GlobalConfig } from "payload";
import { isStaff } from "../collections/access";
import { revalidateGlobal } from "../collections/revalidate";
import { clearStaleBanglaGlobal } from "../collections/staleBangla";

/**
 * Contact details used across the whole website: header, footer, Contact page,
 * support and links pages, WhatsApp buttons. Empty fields fall back to the
 * values in src/content/site.ts.
 */
export const Contact: GlobalConfig = {
  slug: "contact",
  label: "Contact",
  admin: {
    description: "Phone numbers, email, address and social links. They change everywhere on the website (top bar, footer, Contact page, WhatsApp buttons).",
  },
  access: { read: () => true, update: isStaff },
  hooks: { afterChange: [revalidateGlobal, clearStaleBanglaGlobal] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Phone, WhatsApp & email",
          fields: [
            {
              name: "phones",
              type: "array",
              label: "Phone numbers",
              labels: { singular: "Phone number", plural: "Phone numbers" },
              minRows: 1,
              admin: { description: "The first number is the main one. Write it the way it should look, e.g. +880 1711-752202." },
              fields: [{ name: "number", type: "text", required: true, label: "Phone number" }],
            },
            { name: "whatsapp", type: "text", label: "WhatsApp number", admin: { description: "All WhatsApp buttons and forms send messages to this number, e.g. +880 1711-752202." } },
            { name: "email", type: "email", label: "Email" },
            { name: "hours", type: "text", localized: true, label: "Office hours", admin: { description: "e.g. Sat – Thu, 10:00 – 21:00" } },
          ],
        },
        {
          label: "Address & map",
          fields: [
            { name: "address", type: "textarea", localized: true, label: "Office address" },
            { name: "mapLink", type: "text", label: "Google Maps link", admin: { description: "Opens when people press Get directions. In Google Maps press Share → Copy link and paste it here." } },
            {
              name: "mapPin",
              type: "text",
              label: "Map position (optional)",
              admin: { description: "For the map on the Contact page. In Google Maps right-click the office pin and click the numbers at the top (e.g. 23.7586, 90.4184) to copy them, then paste here." },
            },
          ],
        },
        {
          label: "Social media",
          fields: [
            { name: "facebook", type: "text", label: "Facebook page link" },
            { name: "instagram", type: "text", label: "Instagram link" },
            { name: "linkedin", type: "text", label: "LinkedIn link" },
            { name: "youtube", type: "text", label: "YouTube link" },
          ],
        },
        {
          label: "Contact page text",
          fields: [
            { name: "pageTitle", type: "text", localized: true, label: "Page heading", admin: { description: "Big heading at the top of the Contact page." } },
            { name: "pageIntro", type: "textarea", localized: true, label: "Text under the heading" },
          ],
        },
      ],
    },
  ],
};
