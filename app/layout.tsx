import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Usamos Inter, que es la estándar moderna
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mi Portfolio",
  description: "Portfolio de Fotografía y Desarrollo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}