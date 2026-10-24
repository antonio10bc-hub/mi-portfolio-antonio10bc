// Datos del sitio que necesitan direcciones absolutas: metadatos, enlaces
// compartidos, sitemap, robots y datos estructurados para buscadores.

export const SITE_URL = "https://antonio10bc.com";

export const PERSON = {
  name: "Antonio Asis Bastos de Cordoba",
  shortName: "Antonio Asis",
  city: "Madrid",
  country: "ES",
  instagram: "https://www.instagram.com/antonio10bc/",
  github: "https://github.com/antonio10bc-hub",
};

/** "a, b y c" en el idioma de la página. */
export const listJoin = (items: string[], and: string) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} ${and} ${items[items.length - 1]}`;
