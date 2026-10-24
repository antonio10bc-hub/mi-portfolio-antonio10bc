import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PageTransition from "@/components/PageTransition";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { LANGS, dictFor } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { PERSON, SITE_URL } from "@/lib/site";

// Archivo con el eje de ancho: los titulares van a wdth 62 (ver .display).
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Las dos versiones del sitio se generan estáticas; proxy.ts decide cuál ve cada visita.
export const dynamicParams = false;
export const generateStaticParams = () => LANGS.map((lang) => ({ lang }));

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = dictFor(lang);
  return {
    metadataBase: new URL(SITE_URL),
    // Las páginas dan su título ("Games") y la plantilla añade el nombre.
    title: { default: t.homeTitle, template: "%s | Antonio Asis" },
    applicationName: "Antonio Asis",
    authors: [{ name: PERSON.name, url: SITE_URL }],
    creator: PERSON.name,
    ...pageMetadata(lang, { description: t.homeDescription, path: "/" }),
    // Nombre bajo el icono al añadir a la pantalla de inicio en iOS.
    appleWebApp: { title: "Antonio", statusBarStyle: "default" },
  };
}

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const t = dictFor((await params).lang);
  return (
    <html lang={t.htmlLang}>
      <body className={`${archivo.variable} ${jetbrainsMono.variable} antialiased`}>
        <div className="relative z-10">
          <PageTransition>{children}</PageTransition>
        </div>

        <Analytics />
        <SpeedInsights />
        <AnalyticsTracker />
      </body>
    </html>
  );
}
