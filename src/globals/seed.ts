import type { Payload } from "payload";
import { site } from "../content/site";
import en from "../i18n/dictionaries/en";
import bn from "../i18n/dictionaries/bn";
import type { Dictionary } from "../i18n/dictionaries/en";

/*
 * The first time the Contact and Solutions pages are opened in the admin they
 * should show what the website shows today, not empty boxes. On start-up, a
 * global that is still empty gets the built-in English and Bangla texts. As soon
 * as it holds anything (the seed ran, or the client saved), it is never touched again.
 */

type Loose = Record<string, unknown>;
const lines = (list: readonly string[]) => list.map((text) => ({ text }));

function solutionsData(t: Dictionary) {
  const s = t.solutions;
  const area = (a: { title: string; text: string; points: readonly string[] }) => ({ title: a.title, text: a.text, points: lines(a.points) });
  return {
    title: t.pages.solutions.title,
    intro: t.pages.solutions.body,
    residential: area(s.items.residential),
    commercial: area(s.items.commercial),
    utility: area(s.items.utility),
    applicationsTitle: s.applicationsTitle,
    applicationsBody: s.applicationsBody,
    applications: s.applications.map((a) => ({ title: a.title, text: a.text })),
    systemsTitle: s.systemsTitle,
    systems: s.systems.map((x) => ({ name: x.name, text: x.text, ideal: x.ideal, backup: x.backup, flow: lines(x.flow) })),
    packageTitle: s.packageTitle,
    packageBody: s.packageBody,
    package: lines(s.package),
  };
}

/**
 * Array rows are shared by both languages; only their texts are per language.
 * Give the Bangla rows the ids of the saved English rows so the Bangla update
 * fills the same rows instead of replacing them.
 */
function withRowIds(saved: unknown, data: unknown): unknown {
  if (Array.isArray(data)) {
    const rows = Array.isArray(saved) ? saved : [];
    return data.map((row, i) => {
      const s = rows[i] as Loose | undefined;
      const merged = withRowIds(s, row) as Loose;
      return s?.id ? { ...merged, id: s.id } : merged;
    });
  }
  if (data && typeof data === "object") {
    const out: Loose = {};
    for (const [k, v] of Object.entries(data as Loose)) out[k] = withRowIds((saved as Loose | undefined)?.[k], v);
    return out;
  }
  return data;
}

export async function seedGlobals(payload: Payload) {
  try {
    const contact = (await payload.findGlobal({ slug: "contact", locale: "en", depth: 0 })) as unknown as Loose;
    const contactEmpty = !(Array.isArray(contact.phones) && contact.phones.length) && !contact.email && !contact.whatsapp;
    if (contactEmpty) {
      await payload.updateGlobal({
        slug: "contact",
        locale: "en",
        data: {
          phones: site.phones.map((p) => ({ number: p.display })),
          whatsapp: site.whatsappDisplay,
          email: site.email,
          hours: en.contact.hours,
          address: site.address.en,
          mapLink: site.mapsUrl,
          mapPin: "23.7586356, 90.4184124",
          ...site.social,
          pageTitle: en.pages.contact.title,
          pageIntro: en.pages.contact.body,
        },
      });
      await payload.updateGlobal({
        slug: "contact",
        locale: "bn",
        data: { hours: bn.contact.hours, address: site.address.bn, pageTitle: bn.pages.contact.title, pageIntro: bn.pages.contact.body },
      });
      payload.logger.info("[seed] Contact filled with the website's current details");
    }

    const solutions = (await payload.findGlobal({ slug: "solutions-page", locale: "en", depth: 0 })) as unknown as Loose;
    if (!solutions.title && !solutions.intro && !(Array.isArray(solutions.applications) && solutions.applications.length)) {
      const saved = await payload.updateGlobal({ slug: "solutions-page", locale: "en", data: solutionsData(en) });
      await payload.updateGlobal({ slug: "solutions-page", locale: "bn", data: withRowIds(saved, solutionsData(bn)) as Loose });
      payload.logger.info("[seed] Solutions page filled with the website's current texts");
    }
  } catch (error) {
    // Never block start-up (e.g. no database during `next build`).
    payload.logger.warn(`[seed] Contact/Solutions not filled: ${error instanceof Error ? error.message : String(error)}`);
  }
}
