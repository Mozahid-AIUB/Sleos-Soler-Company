import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { en } from "@payloadcms/translations/languages/en";
import { bnBd } from "@payloadcms/translations/languages/bnBd";
import sharp from "sharp";
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Products } from "./collections/Products";
import { migrations } from "./migrations";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  // Placeholder values let `next build` load this file without a database; real values come from the environment (docs/DEPLOY.md).
  secret: process.env.PAYLOAD_SECRET || "build-time-placeholder-not-a-secret",
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || undefined,
  admin: {
    user: Users.slug,
    meta: { titleSuffix: " · OSLEOS Admin" },
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Users, Media, Categories, Products],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || "postgres://127.0.0.1:5432/osleos" },
    // Production applies pending migrations at start-up; development syncs the schema itself.
    prodMigrations: migrations,
  }),
  sharp,
  // The client edits English and Bangla side by side; other site languages fall back to English.
  localization: {
    locales: [
      { label: "English", code: "en" },
      { label: "বাংলা", code: "bn" },
    ],
    defaultLocale: "en",
    fallback: true,
  },
  i18n: { supportedLanguages: { en, "bn-BD": bnBd }, fallbackLanguage: "en" },
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
