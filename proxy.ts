import { NextResponse, type NextRequest } from "next/server";

/*
 * Idioma de cada visita, sin cambiar la URL: reescribe cada ruta pública a su versión
 * /en/... o /es/... (las dos estáticas). Manda la elección del visitante (cookie
 * `lang`, que pone el selector EN / ES del pie); si no ha elegido, español si el
 * navegador lo prefiere (cualquiera de los idiomas de Accept-Language) o si la visita
 * llega desde España (cabecera de país de Vercel), e inglés en el resto de casos.
 *
 * Se reescriben todas las rutas, no solo las tres páginas: una dirección que no existe
 * llega a /en/<ruta> o /es/<ruta>, que cae en la 404 propia ([lang]/[...rest]) en su idioma.
 */
const LANG_COOKIE = "lang";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Las rutas internas con idioma ya están resueltas.
  if (/^\/(en|es)(\/|$)/.test(pathname)) return NextResponse.next();

  const chosen = request.cookies.get(LANG_COOKIE)?.value;
  let lang: "en" | "es";
  if (chosen === "en" || chosen === "es") {
    lang = chosen;
  } else {
    const accept = request.headers.get("accept-language") ?? "";
    const speaksSpanish = accept
      .split(",")
      .some((part) => part.trim().toLowerCase().startsWith("es"));
    const inSpain = request.headers.get("x-vercel-ip-country") === "ES";
    lang = speaksSpanish || inSpain ? "es" : "en";
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Todo menos los recursos de Next y Vercel, las analíticas y cualquier archivo con
  // extensión (imágenes, iconos, robots.txt, sitemap.xml, el manifest...).
  matcher: ["/((?!_next/|_vercel/|ingest/|.*\\..*).*)"],
};
