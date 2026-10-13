import type { CollectionAfterDeleteHook, CollectionConfig, Field } from "payload";
import { isStaff } from "./access";
import { openCell } from "./adminParts";

/** Kept for the list table, not shown in the edit form (the details view shows everything). */
const listOnly = (name: string, label: string): Field => ({ name, type: "text", label, admin: { condition: () => false, components: { Cell: "/components/admin/Cells#TextCell" } } });

/** Deleting a form also deletes its PDF. */
const deleteFiles: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const id = doc.pdf && typeof doc.pdf === "object" ? doc.pdf.id : doc.pdf;
  if (id) await req.payload.delete({ collection: "lead-files", id, req, overrideAccess: true }).catch(() => {});
  return doc;
};

/**
 * Measurement Forms sent from the website's /quote page. Each arrives through
 * src/app/api/measurement-form/route.ts as one PDF (the filled-in form, then the
 * customer's photos and bills); the form also still opens WhatsApp.
 * Staff can read them, set the status, add notes and delete them; nobody adds
 * them by hand.
 */
export const MeasurementForms: CollectionConfig = {
  slug: "measurement-forms",
  labels: { singular: "Measurement form", plural: "Measurement forms" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "phone", "projectType", "status", "createdAt"],
    description: "Measurement Forms sent from the website, newest first. Click a name to download the PDF.",
    listSearchableFields: ["title", "phone", "email", "company"],
    pagination: { defaultLimit: 30 },
    components: { beforeListTable: ["/components/admin/StatusTabs#StatusTabs"] },
  },
  defaultSort: "-createdAt",
  access: { read: isStaff, create: () => false, update: isStaff, delete: isStaff },
  hooks: { afterDelete: [deleteFiles] },
  fields: [
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Done", value: "done" },
      ],
      admin: { position: "sidebar", description: "Change it after you call the customer.", components: { Cell: "/components/admin/Cells#StatusCell" } },
    },
    { name: "note", type: "textarea", label: "Your notes", admin: { position: "sidebar", description: "Only staff see this." } },
    { name: "details", type: "ui", admin: { components: { Field: "/components/admin/MeasurementView#MeasurementView" } } },
    { name: "title", type: "text", label: "Name", admin: { condition: () => false, components: openCell } },
    listOnly("phone", "Phone"),
    listOnly("email", "Email"),
    listOnly("company", "Company"),
    listOnly("location", "Location"),
    listOnly("projectType", "Project type"),
    listOnly("lang", "Website language"),
    { name: "answers", type: "json", admin: { condition: () => false } },
    { name: "filesRefused", type: "number", defaultValue: 0, admin: { condition: () => false } },
    { name: "pdf", type: "upload", relationTo: "lead-files", admin: { condition: () => false } },
    { name: "hasFormPage", type: "checkbox", defaultValue: false, admin: { condition: () => false } },
  ],
};
