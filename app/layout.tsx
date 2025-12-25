import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Antonio Asis - Portfolio",
  description: "Photography & Creative Game Design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        
        {/* --- TEXTURA DE RUIDO VISIBLE --- */}
        {/* CAMBIOS CLAVE:
            1. opacity-30: Subida al 30% (antes 15%). Es muy alto, se verá seguro.
            2. mix-blend-soft-light: Se integra mejor con fondos claros sin desaparecer.
            3. baseFrequency='0.8': Grano más fino y nítido (tipo TV 4K).
        */}
        <div className="fixed inset-0 z-[1] pointer-events-none opacity-30 mix-blend-soft-light">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <filter id="noiseFilter">
              <feTurbulence 
                type="fractalNoise" 
                baseFrequency="0.8" 
                numOctaves="3" 
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
          </svg>
        </div>

        {/* CONTENIDO DE LAS PÁGINAS */}
        <div className="relative z-10">
            {children}
        </div>
        
      </body>
    </html>
  );
}