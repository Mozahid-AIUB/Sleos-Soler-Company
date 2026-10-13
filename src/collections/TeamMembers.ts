import { deviceUpload, openCell } from "./adminParts";
import type { CollectionConfig } from "payload";
import { isStaff, publishedOrStaff } from "./access";
import { requiredText } from "./validate";
import { revalidateOnChange, revalidateOnDelete } from "./revalidate";
import { clearStaleBangla } from "./staleBangla";

export const TeamMembers: CollectionConfig = {
  slug: "team-members",
  labels: { singular: "Team member", plural: "Team members" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["photo", "name", "role", "order", "_status"],
    group: "Website content",
    components: { beforeListTable: [{ path: "/components/admin/AddCard#AddCard", clientProps: { label: "Add a team member" } }] },
    description: "People shown on the About page. Click a name to change it. A smaller Order number shows first.",
  },
  defaultSort: "order",
  versions: { drafts: { autosave: false }, maxPerDoc: 10 },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { afterChange: [revalidateOnChange, clearStaleBangla], afterDelete: [revalidateOnDelete] },
  fields: [
    { name: "name", type: "text", localized: true, validate: requiredText, admin: { description: "Full name, e.g. Engr. Lutfar Rahman.", components: openCell } },
    { name: "role", type: "text", localized: true, validate: requiredText, admin: { description: "Job title, e.g. Chief Engineer." } },
    { name: "credentials", type: "text", localized: true, admin: { description: "Degrees or qualifications (optional)." } },
    { name: "bio", type: "textarea", localized: true, admin: { description: "A short biography. Leave a blank line between paragraphs. A block of lines that each start with a dash and a space (- ) is shown as a bullet list." } },
    { name: "photo", type: "upload", relationTo: "media", admin: { description: "Portrait photo (optional). Without it the card shows the person's initials.", components: deviceUpload() } },
    { name: "order", type: "number", defaultValue: 100, admin: { position: "sidebar", description: "Smaller number shows first." } },
  ],
};
