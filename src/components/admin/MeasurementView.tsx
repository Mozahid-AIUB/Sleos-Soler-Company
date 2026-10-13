import type { UIFieldServerProps } from "payload";
import { AdminIcon } from "./icons";

/*
 * The edit page of a Measurement Form: who sent it, one-click Call / WhatsApp /
 * Email, and the form as one PDF to download (the filled-in form, then the
 * customer's photos and bills). Staff only change Status and Notes (sidebar).
 * If the visitor's browser could not draw the form picture, the answers are
 * listed here instead (the PDF then holds only the photos and bills).
 */

type Row = [string, string | null];
type Group = { title: string; rows: Row[] };

/** Bangladeshi numbers are often written 01711…; WhatsApp needs 8801711…. */
function waDigits(phone: string) {
  const d = phone.replace(/\D/g, "");
  return d.startsWith("0") && d.length === 11 ? `88${d}` : d;
}

export async function MeasurementView({ data, payload }: UIFieldServerProps) {
  const d = (data ?? {}) as Record<string, unknown>;
  const phone = typeof d.phone === "string" ? d.phone : "";
  const email = typeof d.email === "string" ? d.email : "";
  const refused = Number(d.filesRefused) || 0;
  const pdfId = d.pdf && typeof d.pdf === "object" ? (d.pdf as { id: number }).id : (d.pdf as number | undefined);

  let pdf: { filename?: string | null; filesize?: number | null } | null = null;
  if (pdfId) {
    try {
      pdf = await payload.findByID({ collection: "lead-files", id: pdfId, depth: 0, overrideAccess: true });
    } catch {
      pdf = null;
    }
  }
  const sent = typeof d.createdAt === "string" ? new Date(d.createdAt).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Dhaka" }) : "";
  const groups = !d.hasFormPage && Array.isArray(d.answers) ? (d.answers as Group[]) : [];

  return (
    <div className="osl-mf">
      <div className="osl-mf__contact">
        <div>
          <p className="osl-mf__sent">Sent {sent}</p>
          <p className="osl-mf__who">
            {String(d.title ?? "")}
            {d.company ? <span> · {String(d.company)}</span> : null}
          </p>
        </div>
        <div className="osl-mf__actions">
          {phone && (
            <a className="osl-btn osl-btn--ghost" href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
              Call {phone}
            </a>
          )}
          {phone && (
            <a className="osl-btn osl-btn--ghost" href={`https://wa.me/${waDigits(phone)}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          )}
          {email && (
            <a className="osl-btn osl-btn--ghost" href={`mailto:${email}`}>
              Email
            </a>
          )}
        </div>
      </div>

      {pdf?.filename ? (
        <a className="osl-mf__download" href={`/api/lead-files/file/${encodeURIComponent(pdf.filename)}`} download>
          <span className="osl-mf__pdficon">PDF</span>
          <span className="osl-mf__dltext">
            <strong>Download the Measurement Form</strong>
            <small>
              {d.hasFormPage ? "The filled-in form, then the customer's photos and bills" : "The customer's photos and bills"}
              {pdf.filesize ? ` · ${(pdf.filesize / 1024 / 1024).toFixed(1)} MB` : ""}
            </small>
          </span>
          <AdminIcon name="download" size={24} />
        </a>
      ) : (
        <p className="osl-mf__warn">The PDF for this form is missing. Ask the customer to send the details on WhatsApp.</p>
      )}

      {refused > 0 && (
        <p className="osl-mf__warn">
          {refused} file{refused === 1 ? " was" : "s were"} not added (too large, damaged, or not a safe JPG, PNG or PDF). Ask the customer to send{" "}
          {refused === 1 ? "it" : "them"} on WhatsApp if needed.
        </p>
      )}

      {groups.map((g, gi) => {
        const rows = g.rows.filter((r) => r[1] === null || r[1]);
        if (!rows.some((r) => r[1])) return null;
        return (
          <section key={gi} className="osl-mf__group">
            <h3>{g.title}</h3>
            <dl>
              {rows.map(([label, value], ri) =>
                value === null ? (
                  <dt key={ri} className="osl-mf__sub">
                    {label}
                  </dt>
                ) : (
                  <div key={ri} className="osl-mf__row">
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ),
              )}
            </dl>
          </section>
        );
      })}
    </div>
  );
}
