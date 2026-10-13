import { deviceUpload, openCell, tickCell } from "./adminParts";
import type { CollectionConfig } from "payload";
import { isStaff, publishedOrStaff } from "./access";
import { requiredText, requiredTextarea } from "./validate";
import { autoSlug } from "./slug";
import { revalidateOnChange, revalidateOnDelete } from "./revalidate";
import { clearStaleBangla } from "./staleBangla";

export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "Project", plural: "Projects" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["image", "title", "capacity", "sample", "order", "_status"],
    listSearchableFields: ["title", "capacity"],
    group: "Website content",
    components: { beforeListTable: [{ path: "/components/admin/AddCard#AddCard", clientProps: { label: "Add a new project" } }] },
    description: "Completed solar projects shown on the Projects page and the home page. Click a title to change it.",
  },
  defaultSort: "order",
  versions: { drafts: { autosave: false }, maxPerDoc: 10 },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { beforeValidate: [autoSlug("title", "projects")], afterChange: [revalidateOnChange, clearStaleBangla], afterDelete: [revalidateOnDelete] },
  fields: [
    { name: "title", type: "text", localized: true, validate: requiredText, admin: { description: "e.g. Expo Accessories, Gazipur.", components: openCell } },
        { name: "type", type: "text", localized: true, validate: requiredText, admin: { description: "e.g. Industrial · On-grid." } },
    { name: "location", type: "text", localized: true, validate: requiredText },
    { name: "capacity", type: "text", required: true, admin: { description: "e.g. 501 kWp." } },
    { name: "year", type: "text", admin: { description: "Commissioning year (optional)." } },
    { name: "summary", type: "textarea", localized: true, validate: requiredTextarea },
    { name: "image", type: "upload", relationTo: "media", required: true, label: "Photo", admin: { components: deviceUpload() } },
    { name: "slug", type: "text", unique: true, index: true, label: "Page link", admin: { position: "sidebar", description: "Created automatically from the title. Leave as it is." } },
    { name: "sample", type: "checkbox", defaultValue: false, label: "This is a sample / placeholder project", admin: { components: tickCell, position: "sidebar", description: "Tick only for illustrative entries. Real projects must stay unticked." } },
    { name: "order", type: "number", defaultValue: 100, admin: { position: "sidebar", description: "Smaller number shows first." } },
  ],
};
