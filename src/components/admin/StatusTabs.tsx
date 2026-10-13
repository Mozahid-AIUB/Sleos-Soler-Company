import Link from "next/link";
import type { BeforeListTableServerProps } from "payload";

/** Above the Measurement forms table: New / Contacted / Done / All, with counts. */
const tabs = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "done", label: "Done" },
] as const;

const PARAM = "where[status][equals]";

export async function StatusTabs({ payload, searchParams }: BeforeListTableServerProps) {
  const sp = (searchParams ?? {}) as Record<string, unknown> & { where?: { status?: { equals?: string } } };
  const raw = sp[PARAM] ?? sp.where?.status?.equals;
  const active = Array.isArray(raw) ? String(raw[0]) : raw === undefined ? undefined : String(raw);
  const counts: Record<string, number> = {};
  try {
    await Promise.all(tabs.map(async (t) => (counts[t.value] = (await payload.count({ collection: "measurement-forms", where: { status: { equals: t.value } } })).totalDocs)));
  } catch {
    /* tabs still work without counts */
  }
  const base = "/admin/collections/measurement-forms";
  return (
    <div className="osl-tabs">
      <div className="osl-tabs__row" role="tablist" aria-label="Status">
        {tabs.map((t) => (
          <Link key={t.value} href={`${base}?${PARAM}=${t.value}`} className={`osl-tabs__tab${active === t.value ? " is-active" : ""}`} role="tab" aria-selected={active === t.value}>
            {t.label}
            {counts[t.value] !== undefined && <span className={`osl-tabs__count${t.value === "new" && counts.new ? " is-new" : ""}`}>{counts[t.value]}</span>}
          </Link>
        ))}
        <Link href={base} className={`osl-tabs__tab${active ? "" : " is-active"}`} role="tab" aria-selected={!active}>
          All
        </Link>
      </div>
    </div>
  );
}
