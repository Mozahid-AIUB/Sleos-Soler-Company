/* eslint-disable @next/next/no-img-element -- admin-only, plain <img> keeps the panel independent of next/image */
/** OSLEOS logo (the website's blue colour version) on the admin login page. */
export function Logo() {
  return <img src="/brand/osleos-logo-color.png" alt="OSLEOS" width={220} style={{ height: "auto", maxWidth: "100%" }} />;
}
