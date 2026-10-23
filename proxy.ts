import { NextResponse, type NextRequest } from "next/server";

/*
 * Idioma de cada visita, sin cambiar la URL: reescribe /, /photography y /projects a
 * su versión /en/... o /es/... (las dos estáticas). Español si el navegador lo prefiere
 * (cualquiera de los idiomas de Accept-Language) o si la visita llega desde España
 * (cabecera de país de Vercel); inglés en el resto de casos.
 */
export function proxy(request: NextRequest) {
  const accept = request.headers.get("accept-language") ?? "";
  const speaksSpanish = accept
    .split(",")
    .some((part) => part.trim().toLowerCase().startsWith("es"));
  const inSpain = request.headers.get("x-vercel-ip-country") === "ES";
  const lang = speaksSpanish || inSpain ? "es" : "en";

  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/", "/photography", "/projects"],
};
