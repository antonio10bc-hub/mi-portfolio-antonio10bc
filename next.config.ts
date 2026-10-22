import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hay un package-lock.json suelto en el directorio personal: sin esto Next
  // infiere ~/ como raíz del workspace y rastrea archivos de más.
  turbopack: { root: path.resolve(__dirname) },
  // Analíticas: los eventos salen por la propia web hacia PostHog (región EU), así no
  // los cortan los bloqueadores de anuncios (ver lib/analytics.ts).
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: "https://eu-assets.i.posthog.com/static/:path*" },
      { source: "/ingest/:path*", destination: "https://eu.i.posthog.com/:path*" },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
