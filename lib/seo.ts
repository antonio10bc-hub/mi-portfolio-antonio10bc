import type { Metadata } from "next";
import { dictFor } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

/*
 * Metadatos de cada página. Next no fusiona en profundidad `openGraph` ni `twitter`
 * entre el layout y la página (el de la página sustituye al del layout), así que cada
 * página los lleva completos, con la imagen para compartir de su idioma.
 */
export function pageMetadata(
  lang: string,
  { title, description, path }: { title?: string; description: string; path: string },
): Metadata {
  const t = dictFor(lang);
  const image = { url: `/og/og-${t.htmlLang}.png`, width: 1200, height: 630, alt: t.ogAlt };
  const shareTitle = title ? `${title} | Antonio Asis` : t.homeTitle;
  return {
    ...(title ? { title } : {}),
    description,
    // Las dos versiones de idioma comparten URL (proxy.ts), así que la canónica es una.
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Antonio Asis",
      locale: t.ogLocale,
      url: `${SITE_URL}${path}`,
      title: shareTitle,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: [image.url] },
  };
}
