import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PageTransition from "@/components/PageTransition";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { LANGS, dictFor } from "@/lib/i18n";

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
  const t = dictFor((await params).lang);
  const title = t.siteTitle;
  const description = t.siteDescription;
  return {
    title,
    description,
    openGraph: { title, description, type: "website", locale: t.ogLocale },
    twitter: { card: "summary_large_image", title, description },
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
