import type { CollectionConfig } from "payload";
import { isOwner, isOwnerField, isStaff } from "./access";
import { requiredText } from "./validate";
import { revalidateOnChange, revalidateOnDelete } from "./revalidate";

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: { singular: "Category", plural: "Categories" },
  admin: { useAsTitle: "name", defaultColumns: ["slug", "name", "order"], group: "Website content", components: { views: { list: { Component: "/components/admin/CategoriesView#CategoriesView" } } }, description: "The fixed list of website categories. You can rename a category or change its picture. Adding or removing categories is done by the owner only." },
  defaultSort: "order",
  // The category list is fixed (it drives the website menu): staff can rename and change pictures, only the owner can add or remove categories.
  access: { read: () => true, create: isOwner, update: isStaff, delete: isOwner },
  hooks: { afterChange: [revalidateOnChange], afterDelete: [revalidateOnDelete] },
  fields: [
    { name: "slug", type: "text", required: true, unique: true, index: true, access: { update: isOwnerField }, admin: { description: "Short id used in links, e.g. panels. Do not change after launch." } },
    { name: "name", type: "text", localized: true, validate: requiredText },
    { name: "blurb", type: "text", localized: true },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "order", type: "number", defaultValue: 0, admin: { position: "sidebar" } },
  ],
};
