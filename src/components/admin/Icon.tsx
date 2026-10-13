/* eslint-disable @next/next/no-img-element -- admin-only, plain <img> keeps the panel independent of next/image */
/** OSLEOS sun mark in the admin navigation. */
export function Icon() {
  return <img src="/brand/osleos-mark.png" alt="OSLEOS" width={32} height={32} style={{ objectFit: "contain" }} />;
}
