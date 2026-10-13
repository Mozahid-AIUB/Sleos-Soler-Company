import "server-only";
import { projects as staticProjects, type Project } from "@/content/projects";
import { createLoader, isObj, loc, mediaUrl, text, type Loose } from "@/lib/cms-read";

/*
 * Projects for the public site, read from the Payload `projects` collection in the
 * same shape as src/content/projects.ts. When the database is missing, down or has
 * no published projects, the static list in src/content/projects.ts is used.
 */

const DEFAULT_IMAGE = "/media/img/panels-closeup.webp";

function readProject(doc: Loose): Project | null {
  const slug = text(doc.slug);
  const title = loc(doc.title);
  if (!slug || !title.en) return null;
  const staticMatch = staticProjects.find((p) => p.slug === slug);
  const year = text(doc.year);
  return {
    slug,
    title,
    type: loc(doc.type),
    location: loc(doc.location),
    capacity: text(doc.capacity),
    ...(year ? { year } : {}),
    summary: loc(doc.summary),
    image: mediaUrl(isObj(doc.image) ? doc.image : undefined) ?? staticMatch?.image ?? DEFAULT_IMAGE,
    sample: Boolean(doc.sample),
  };
}

const loadProjects = createLoader<Project>(
  "projects",
  async (payload) => {
    const res = await payload.find({
      collection: "projects",
      where: { _status: { equals: "published" } },
      locale: "all",
      fallbackLocale: false,
      depth: 1,
      limit: 0,
      pagination: false,
      sort: "order",
    });
    return (res.docs as unknown as Loose[]).map(readProject).filter((p): p is Project => p !== null);
  },
  () => staticProjects,
);

/** Published projects in display order (`order` ascending). */
export async function getProjects(): Promise<Project[]> {
  return loadProjects();
}
