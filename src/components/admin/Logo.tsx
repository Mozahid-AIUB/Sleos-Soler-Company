/* eslint-disable @next/next/no-img-element -- admin-only, plain <img> keeps the panel independent of next/image */
/** OSLEOS logo (the updated blue version with ®, transparent background) on the admin login page. */
export function Logo() {
  return <img src="/brand/osleos-logo-blue.png" alt="OSLEOS" width={220} height={47} style={{ height: "auto", maxWidth: "100%" }} />;
}
