/**
 * Fills the Contact and Solutions pages in the admin with the website's current
 * texts, if they have never been saved. The same runs on every start-up
 * (payload.config.ts onInit); this script is for running it by hand:
 *   npm run payload -- run scripts/seed-globals.ts
 */
import { getPayload } from "payload";
import config from "@payload-config";
import { seedGlobals } from "../src/globals/seed";

const payload = await getPayload({ config });
const before = await payload.findGlobal({ slug: "contact", locale: "en", depth: 0 });
console.log("contact before:", JSON.stringify(before).slice(0, 200));
await seedGlobals(payload);
const after = await payload.findGlobal({ slug: "contact", locale: "bn", depth: 0 });
console.log("contact (bn) after:", JSON.stringify(after).slice(0, 400));
const sol = await payload.findGlobal({ slug: "solutions-page", locale: "bn", depth: 0 });
console.log("solutions (bn) after:", sol.title, "|", sol.applications?.length, "applications |", sol.systems?.[0]?.flow?.[0]?.text);
process.exit(0);
