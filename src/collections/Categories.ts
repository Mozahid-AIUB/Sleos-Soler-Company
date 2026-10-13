import type { CollectionConfig } from "payload";
import { isStaff } from "./access";
import { requiredText } from "./validate";
import { revalidateOnChange, revalidateOnDelete } from "./revalidate";

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: { singular: "Category", plural: "Categories" },
  admin: { useAsTitle: "slug", defaultColumns: ["slug", "name", "order"], group: "Website content" },
  defaultSort: "order",
  access: { read: () => true, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { afterChange: [revalidateOnChange], afterDelete: [revalidateOnDelete] },
  fields: [
    { name: "slug", type: "text", required: true, unique: true, index: true, admin: { description: "Short id used in links, e.g. panels. Do not change after launch." } },
    { name: "name", type: "text", localized: true, validate: requiredText },
    { name: "blurb", type: "text", localized: true },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "order", type: "number", defaultValue: 0, admin: { position: "sidebar" } },
  ],
};
