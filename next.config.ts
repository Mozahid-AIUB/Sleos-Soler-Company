import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the VPS (see deploy/ and docs/DEPLOY.md).
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
  },
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
};

export default nextConfig;
