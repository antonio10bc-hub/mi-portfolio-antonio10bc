import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // /en/... y /es/... son las versiones internas a las que proxy.ts reescribe: la
    // dirección pública de cada página es la que no lleva idioma.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/en/", "/es/", "/ingest/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
