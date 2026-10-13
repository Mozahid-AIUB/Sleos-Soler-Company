import type { CollectionConfig, Field } from "payload";
import { isStaff, publishedOrStaff } from "./access";
import { requiredText, requiredTextarea } from "./validate";
import { revalidateOnChange, revalidateOnDelete } from "./revalidate";

/** A list of short lines, each in English and Bangla (highlights, applications, bundle contents…). */
const lines = (name: string, label: string, description?: string): Field => ({
  name,
  type: "array",
  label,
  admin: description ? { description } : undefined,
  fields: [{ name: "text", type: "text", localized: true, validate: requiredText }],
});

export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "Product", plural: "Products" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "brand", "featured", "_status"],
    listSearchableFields: ["name", "brand", "slug"],
    group: "Content",
  },
  // Draft → Publish: only published products show on the website.
  versions: { drafts: { autosave: false }, maxPerDoc: 20 },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { afterChange: [revalidateOnChange], afterDelete: [revalidateOnDelete] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Basics",
          fields: [
            { name: "name", type: "text", required: true, admin: { description: "Model name as the manufacturer markets it." } },
            { name: "slug", type: "text", required: true, unique: true, index: true, admin: { description: "Used in the page link, e.g. jinko-tiger-neo. Letters, numbers and dashes." } },
            { name: "category", type: "relationship", relationTo: "categories", required: true },
            { name: "brand", type: "text", admin: { description: "Leave empty for items OSLEOS specifies per project." } },
            { name: "tagline", type: "text", localized: true, validate: requiredText },
            { name: "description", type: "textarea", localized: true, validate: requiredTextarea },
            { name: "keySpec", type: "text", localized: true, validate: requiredText, admin: { description: "One short line shown on the product card, e.g. 620 W · N-type." } },
            { name: "image", type: "upload", relationTo: "media", required: true },
            { name: "imageCredit", type: "text", localized: true, admin: { description: "Only for photos that need an attribution line." } },
            { name: "datasheet", type: "upload", relationTo: "media", admin: { description: "Datasheet PDF for download." } },
            { name: "warranty", type: "text", localized: true },
          ],
        },
        {
          label: "Specifications",
          fields: [
            {
              name: "specs",
              type: "array",
              label: "Spec table",
              fields: [
                { name: "label", type: "text", localized: true, validate: requiredText },
                { name: "value", type: "text", required: true },
              ],
            },
            lines("highlights", "Highlights"),
            lines("features", "Smart features", "Shown as its own block on the product page (optional)."),
            lines("applications", "Ideal applications", "Optional."),
          ],
        },
        {
          label: "Solar combo package",
          fields: [
            { name: "isCombo", type: "checkbox", label: "This is a solar combo package", defaultValue: false },
            {
              name: "combo",
              type: "group",
              admin: { condition: (data) => Boolean(data?.isCombo) },
              fields: [
                { name: "offerPrice", type: "number", label: "Offer price (BDT)", min: 0 },
                { name: "regularPrice", type: "number", label: "Regular price before discount (BDT)", min: 0, admin: { description: "Only fill if the discount is real." } },
                {
                  type: "row",
                  fields: [
                    { name: "offerStart", type: "date", admin: { date: { pickerAppearance: "dayOnly" } } },
                    { name: "offerEnd", type: "date", admin: { date: { pickerAppearance: "dayOnly" }, description: "After this date the offer price is hidden." } },
                  ],
                },
                lines("includes", "What is included"),
                lines("suitableFor", "Suitable for"),
                lines("idealFor", "Ideal for"),
                lines("benefits", "Benefits"),
                { name: "transport", type: "text", localized: true, admin: { description: "Leave empty to use the default line." } },
                { name: "customise", type: "text", localized: true, admin: { description: "Leave empty to use the default line." } },
              ],
            },
          ],
        },
      ],
    },
    { name: "featured", type: "checkbox", defaultValue: false, label: "Featured on the home page", admin: { position: "sidebar" } },
    { name: "imagePosition", type: "text", admin: { position: "sidebar", description: "Crop focus, e.g. 50% 25%. Usually empty." } },
    {
      name: "imageFit",
      type: "select",
      options: [{ label: "Show whole picture (no crop)", value: "contain" }],
      admin: { position: "sidebar", description: "Leave empty to crop to the frame." },
    },
    { name: "source", type: "text", admin: { position: "sidebar", description: "Where the specs came from (internal, not shown)." } },
  ],
};
