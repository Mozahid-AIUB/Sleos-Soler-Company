import { openCell, tickCell } from "./adminParts";
import type { CollectionConfig } from "payload";
import { isStaff, publishedOrStaff } from "./access";
import { requiredText, requiredTextarea } from "./validate";
import { revalidateOnChange, revalidateOnDelete } from "./revalidate";
import { clearStaleBangla } from "./staleBangla";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  labels: { singular: "Customer review", plural: "Customer reviews" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "group", "rating", "sample", "_status"],
    group: "Website content",
    components: { beforeListTable: [{ path: "/components/admin/AddCard#AddCard", clientProps: { label: "Add a customer review" } }] },
    description: "Reviews shown on the home page. Only add reviews you have permission to publish. Click a name to change it.",
  },
  defaultSort: "order",
  versions: { drafts: { autosave: false }, maxPerDoc: 10 },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { afterChange: [revalidateOnChange, clearStaleBangla], afterDelete: [revalidateOnDelete] },
  fields: [
    { name: "quote", type: "textarea", localized: true, validate: requiredTextarea, admin: { description: "What the customer said." } },
    { name: "name", type: "text", localized: true, validate: requiredText, admin: { description: "Customer or company name.", components: openCell } },
    { name: "role", type: "text", localized: true, validate: requiredText, admin: { description: "e.g. Factory rooftop · Gazipur." } },
    {
      name: "group",
      type: "select",
      required: true,
      defaultValue: "clients",
      options: [
        { label: "Customer in Bangladesh", value: "clients" },
        { label: "Equipment manufacturer / partner", value: "manufacturers" },
      ],
    },
    { name: "rating", type: "number", required: true, defaultValue: 5, min: 1, max: 5 },
    { name: "sample", type: "checkbox", defaultValue: false, label: "This is a sample review", admin: { components: tickCell, position: "sidebar", description: "Tick only for placeholder reviews. They show a Sample note on the site." } },
    { name: "order", type: "number", defaultValue: 100, admin: { position: "sidebar", description: "Smaller number shows first." } },
  ],
};
