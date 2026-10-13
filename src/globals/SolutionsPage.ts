import type { Field, GlobalConfig } from "payload";
import { isStaff } from "../collections/access";
import { revalidateGlobal } from "../collections/revalidate";
import { clearStaleBanglaGlobal } from "../collections/staleBangla";
import { requiredText, requiredTextarea } from "../collections/validate";

/** A list of short lines, each in English and Bangla. */
const lines = (name: string, label: string, description?: string): Field => ({
  name,
  type: "array",
  label,
  labels: { singular: "Line", plural: "Lines" },
  admin: description ? { description } : undefined,
  fields: [{ name: "text", type: "text", localized: true, validate: requiredText }],
});

const area = (name: string, label: string): Field => ({
  name,
  type: "group",
  label,
  fields: [
    { name: "title", type: "text", localized: true },
    { name: "text", type: "textarea", localized: true },
    lines("points", "Points (ticks)"),
  ],
});

/**
 * Text of the Solutions page (English and Bangla). Empty fields keep the
 * website's built-in text; the Chinese, Spanish and French pages are not
 * changed from here.
 */
export const SolutionsPage: GlobalConfig = {
  slug: "solutions-page",
  label: "Solutions",
  admin: {
    description: "Everything written on the Solutions page, in the same order as the page.",
  },
  access: { read: () => true, update: isStaff },
  hooks: { afterChange: [revalidateGlobal, clearStaleBanglaGlobal] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Top of the page",
          fields: [
            { name: "title", type: "text", localized: true, label: "Page heading" },
            { name: "intro", type: "textarea", localized: true, label: "Text under the heading" },
          ],
        },
        {
          label: "Homes · Business · Agriculture",
          description: "The three cards near the top of the page (also on the home page).",
          fields: [area("residential", "Card 1 · Homes & buildings"), area("commercial", "Card 2 · Commercial & industrial"), area("utility", "Card 3 · Agriculture & utility")],
        },
        {
          label: "Solutions list",
          fields: [
            { name: "applicationsTitle", type: "text", localized: true, label: "Heading" },
            { name: "applicationsBody", type: "textarea", localized: true, label: "Text under the heading" },
            {
              name: "applications",
              type: "array",
              label: "Solutions",
              labels: { singular: "Solution", plural: "Solutions" },
              admin: { description: "Numbered list on the page. Drag to change the order." },
              fields: [
                { name: "title", type: "text", localized: true, validate: requiredText },
                { name: "text", type: "textarea", localized: true, validate: requiredTextarea },
              ],
            },
          ],
        },
        {
          label: "On-grid · Off-grid · Hybrid",
          fields: [
            { name: "systemsTitle", type: "text", localized: true, label: "Heading" },
            {
              name: "systems",
              type: "array",
              label: "System types",
              labels: { singular: "System type", plural: "System types" },
              fields: [
                { name: "name", type: "text", localized: true, validate: requiredText },
                { name: "text", type: "textarea", localized: true, validate: requiredTextarea, label: "Description" },
                { name: "ideal", type: "text", localized: true, validate: requiredText, label: "Ideal for" },
                { name: "backup", type: "checkbox", label: "Works during power cuts", defaultValue: false },
                lines("flow", "How the power flows (one step per line)"),
              ],
            },
          ],
        },
        {
          label: "Complete package",
          fields: [
            { name: "packageTitle", type: "text", localized: true, label: "Heading" },
            { name: "packageBody", type: "textarea", localized: true, label: "Text under the heading" },
            lines("package", "What we supply"),
          ],
        },
      ],
    },
  ],
};
