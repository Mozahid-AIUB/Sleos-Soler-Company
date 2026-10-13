import { deviceUpload, openCell, tickCell } from "./adminParts";
import type { CollectionConfig, Field } from "payload";
import { isStaff, publishedOrStaff } from "./access";
import { requiredText, requiredTextarea } from "./validate";
import { autoSlug } from "./slug";
import { revalidateOnChange, revalidateOnDelete } from "./revalidate";
import { clearStaleBangla } from "./staleBangla";

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
    defaultColumns: ["image", "name", "category", "brand", "featured", "_status"],
    description: "Hidden products are kept here but not shown on the website.",
    listSearchableFields: ["name", "brand"],
    pagination: { defaultLimit: 30, limits: [30, 60, 100] },
    group: "Website content",
    components: { beforeListTable: ["/components/admin/ProductTabs#ProductTabs"] },
  },
  // Draft → Publish: only published products show on the website.
  versions: { drafts: { autosave: false }, maxPerDoc: 20 },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { beforeValidate: [autoSlug("name", "products")], afterChange: [revalidateOnChange, clearStaleBangla], afterDelete: [revalidateOnDelete] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Basics",
          fields: [
            {
              name: "category",
              type: "relationship",
              relationTo: "categories",
              required: true,
              label: "Category",
              admin: {
                description: "Step 1 · Choose where this product shows on the website.",
                allowCreate: false,
                allowEdit: false,
                sortOptions: "order",
                components: { Field: "/components/admin/CategoryField#CategoryField" },
              },
            },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              required: true,
              label: "Photo",
              admin: { description: "Step 2 · Any size is fine, it is made smaller automatically.", components: deviceUpload() },
            },
            { name: "name", type: "text", required: true, label: "Name", admin: { description: "Step 3 · e.g. Tiger Neo N-type 54HL4R-B", components: openCell } },
            { name: "brand", type: "text", label: "Brand", admin: { description: "Optional · e.g. Jinko Solar. Leave empty for OSLEOS products." } },
            { name: "tagline", type: "text", localized: true, validate: requiredText, label: "Short line under the name", admin: { description: "e.g. Dual-glass N-type module for rooftops" } },
            { name: "description", type: "textarea", localized: true, validate: requiredTextarea, label: "Description", admin: { description: "A few sentences about the product." } },
            { name: "keySpec", type: "text", localized: true, validate: requiredText, label: "Key spec (one short line)", admin: { description: "Shown on the product card, e.g. 620 W · N-type." } },
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
          label: "Extras (optional)",
          fields: [
            { name: "datasheet", type: "upload", relationTo: "media", label: "Datasheet PDF", admin: { description: "Customers can download it from the product page.", components: deviceUpload("application/pdf") } },
            { name: "warranty", type: "text", localized: true, label: "Warranty", admin: { description: "e.g. 12 years product, 30 years performance." } },
            { name: "imageCredit", type: "text", localized: true, label: "Photo credit", admin: { description: "Only for photos that need an attribution line." } },
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
        {
          label: "Advanced (usually leave empty)",
          fields: [
            { name: "slug", type: "text", unique: true, index: true, label: "Page link", admin: { description: "Created automatically from the product name. Leave as it is." } },
            { name: "imagePosition", type: "text", admin: { description: "Crop focus for the card picture, e.g. 50% 25%. Usually empty." } },
            {
              name: "imageFit",
              type: "select",
              options: [{ label: "Show whole picture (no crop)", value: "contain" }],
              admin: { description: "Leave empty to crop the picture to the frame." },
            },
            { name: "source", type: "text", admin: { description: "Where the specs came from (internal note, not shown on the website)." } },
          ],
        },
      ],
    },
    { name: "featured", type: "checkbox", defaultValue: false, label: "Featured on the home page", admin: { position: "sidebar", components: tickCell } },
  ],
};
