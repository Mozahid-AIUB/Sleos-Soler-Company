import type { CollectionConfig } from "payload";
import { isStaff, publishedOrStaff } from "./access";
import { requiredText, requiredTextarea } from "./validate";
import { revalidateOnChange, revalidateOnDelete } from "./revalidate";

export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "Project", plural: "Projects" },
  admin: {
    useAsTitle: "slug",
    defaultColumns: ["image", "title", "capacity", "sample", "order", "_status"],
    listSearchableFields: ["slug", "title", "capacity"],
    group: "Website content",
    description: "Completed solar projects shown on the Projects page and the home page. Draft = hidden, Published = visible.",
  },
  defaultSort: "order",
  versions: { drafts: { autosave: false }, maxPerDoc: 10 },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { afterChange: [revalidateOnChange], afterDelete: [revalidateOnDelete] },
  fields: [
    { name: "title", type: "text", localized: true, validate: requiredText, admin: { description: "e.g. Expo Accessories, Gazipur." } },
    { name: "slug", type: "text", required: true, unique: true, index: true, admin: { description: "Short id for the link: letters, numbers and dashes, e.g. expo-accessories-gazipur." } },
    { name: "type", type: "text", localized: true, validate: requiredText, admin: { description: "e.g. Industrial · On-grid." } },
    { name: "location", type: "text", localized: true, validate: requiredText },
    { name: "capacity", type: "text", required: true, admin: { description: "e.g. 501 kWp." } },
    { name: "year", type: "text", admin: { description: "Commissioning year (optional)." } },
    { name: "summary", type: "textarea", localized: true, validate: requiredTextarea },
    { name: "image", type: "upload", relationTo: "media", required: true },
    { name: "sample", type: "checkbox", defaultValue: false, label: "This is a sample / placeholder project", admin: { position: "sidebar", description: "Tick only for illustrative entries. Real projects must stay unticked." } },
    { name: "order", type: "number", defaultValue: 100, admin: { position: "sidebar", description: "Smaller number shows first." } },
  ],
};
