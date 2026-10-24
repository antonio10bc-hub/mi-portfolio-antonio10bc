import { notFound } from "next/navigation";

// Cualquier dirección que no existe llega aquí reescrita por proxy.ts (/en/<ruta> o
// /es/<ruta>) y muestra la 404 propia, [lang]/not-found.tsx, en su idioma y con 404.
export const dynamicParams = true;

export default function Missing() {
  notFound();
}
