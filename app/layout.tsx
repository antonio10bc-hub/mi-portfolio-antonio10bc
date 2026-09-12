import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PageTransition from "@/components/PageTransition";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

const title = "Antonio Asis Portfolio";
const description = "Photography & Creative Game Design";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <div className="relative z-10">
          <PageTransition>{children}</PageTransition>
        </div>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
