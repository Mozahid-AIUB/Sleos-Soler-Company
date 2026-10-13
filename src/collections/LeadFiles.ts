import path from "path";
import type { CollectionConfig } from "payload";
import { isStaff } from "./access";

/**
 * The PDF of each Measurement Form sent from the website (the filled-in form plus
 * the customer's photos and bills). Private: only logged-in staff can open them
 * (the website's own pictures are in Media).
 * Created only by the form endpoint (src/app/api/measurement-form/route.ts),
 * after the checks in src/lib/file-safety.ts.
 */
export const LeadFiles: CollectionConfig = {
  slug: "lead-files",
  labels: { singular: "Form file", plural: "Form files" },
  admin: { hidden: true, useAsTitle: "filename" },
  access: { read: isStaff, create: () => false, update: () => false, delete: isStaff },
  upload: {
    // Inside the persistent /app/media volume in production (docs/DEPLOY.md).
    staticDir: path.resolve(process.cwd(), "media", "form-files"),
    mimeTypes: ["application/pdf"],
    // Built from files strangers sent: never let the browser run anything; always download.
    modifyResponseHeaders: ({ headers }) => {
      headers.set("X-Content-Type-Options", "nosniff");
      headers.set("Content-Security-Policy", "default-src 'none'; sandbox");
      headers.set("Content-Disposition", "attachment");
      return headers;
    },
  },
  fields: [],
};
