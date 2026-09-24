import type { NextConfig } from "next";

// Long browser/CDN caching for files in /public. Their names don't change per
// deploy, so allow stale copies to be served while revalidating in background.
const publicAssetCache = "public, max-age=2592000, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  // Self-contained server bundle for Docker/Coolify (see Dockerfile, docs/DEPLOY.md).
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
    // Optimised images are cached 30 days (browser + Cloudflare edge).
    minimumCacheTTL: 2592000,
  },
  async headers() {
    return [
      { source: "/media/:path*", headers: [{ key: "Cache-Control", value: publicAssetCache }] },
      { source: "/brand/:path*", headers: [{ key: "Cache-Control", value: publicAssetCache }] },
    ];
  },
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
};

export default nextConfig;
