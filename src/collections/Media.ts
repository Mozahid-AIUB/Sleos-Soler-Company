import path from "path";
import type { CollectionConfig } from "payload";
import { isStaff } from "./access";
import { revalidateOnChange, revalidateOnDelete } from "./revalidate";

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "File", plural: "Media library" },
  admin: { useAsTitle: "filename", group: "Website content" },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  hooks: { afterChange: [revalidateOnChange], afterDelete: [revalidateOnDelete] },
  upload: {
    // Persistent volume in production (see docs/DEPLOY.md): /app/media
    staticDir: path.resolve(process.cwd(), "media"),
    mimeTypes: ["image/*", "application/pdf", "video/mp4", "video/webm"],
    // Keep the site light: every uploaded photo is shrunk and converted to WebP.
    resizeOptions: { width: 2000, height: 2000, fit: "inside", withoutEnlargement: true },
    formatOptions: { format: "webp", options: { quality: 85 } },
    imageSizes: [{ name: "thumbnail", width: 400 }],
    adminThumbnail: "thumbnail",
  },
  fields: [{ name: "alt", type: "text", localized: true, admin: { description: "Short description of the picture (helps search engines and screen readers)." } }],
};
