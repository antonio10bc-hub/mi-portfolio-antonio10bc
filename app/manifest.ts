import type { MetadataRoute } from "next";

/*
 * Lo que usa el móvil al guardar la web como app. Los iconos 192/512 van a
 * sangre: Android aplica su propia máscara. El maskable deja la marca dentro
 * de la zona segura (círculo del 80%) para que ninguna máscara la recorte.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Antonio Asis Portfolio",
    short_name: "Antonio",
    description: "Photography & Creative Game Design",
    start_url: "/",
    display: "standalone",
    background_color: "#EBE8E0",
    theme_color: "#EBE8E0",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
