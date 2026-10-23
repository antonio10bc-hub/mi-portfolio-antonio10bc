// Textos del sitio en inglés (el idioma por defecto) y en español. proxy.ts elige el
// idioma de cada visita: español si el navegador lo prefiere o si se visita desde España.
// Las dos versiones se generan estáticas en /en/... y /es/..., y la URL visible no cambia.

export const LANGS = ["en", "es"] as const;
export type Lang = (typeof LANGS)[number];
export const isLang = (v: string): v is Lang => (LANGS as readonly string[]).includes(v);

const en = {
  htmlLang: "en",
  ogLocale: "en_US",
  siteTitle: "Antonio Asis Portfolio",
  siteDescription: "Photography & Creative Game Design",
  back: "Back",
  // Home
  homeCode: "File 00 // Index",
  homeTagline: "Photography & Creative Game Design.",
  treeAlt: "Solitude, a lone tree, printed as a halftone",
  frames: (n: number | string) => `${n} frames`,
  games: (n: number | string) => `${n} games`,
  photoPanelTitle: "photography.",
  photoPanelText: "Places where I found beauty.",
  gamesPanelTitle: "games.",
  gamesPanelText: "Experiments & code, shipped.",
  // Games
  gamesEyebrow: "Selected work",
  gamesTitle: "Games",
  gamesCode: "File 02 // Browser games",
  gamesIntro1: "Small games, built end to end and shipped.",
  gamesIntro2: "Each one runs in the browser, no install needed.",
  index: "Index",
  projectCode: "Project code",
  game: "Game",
  play: "Play",
  screenshot: (name: string) => `${name} screenshot`,
  // Photography
  photoEyebrow: "Gallery",
  photoTitle: "Photography",
  photoCode: "File 01 // Frames",
  photoIntro: "Landscapes, cities and the odd quiet corner. Click any frame to open it full screen.",
  openPhoto: (title: string) => `Open photo: ${title}`,
  previousPhoto: "Previous photo",
  nextPhoto: "Next photo",
  close: "Close",
};

export type Dict = typeof en;

const es: Dict = {
  htmlLang: "es",
  ogLocale: "es_ES",
  siteTitle: "Portfolio de Antonio Asis",
  siteDescription: "Fotografía y diseño creativo de juegos",
  back: "Volver",
  homeCode: "Expediente 00 // Índice",
  homeTagline: "Fotografía y diseño creativo de juegos.",
  treeAlt: "Solitude, un árbol solitario, impreso en semitono",
  frames: (n) => `${n} fotogramas`,
  games: (n) => `${n} juegos`,
  photoPanelTitle: "fotografía.",
  photoPanelText: "Lugares donde encontré belleza.",
  gamesPanelTitle: "juegos.",
  gamesPanelText: "Experimentos y código, publicados.",
  gamesEyebrow: "Trabajo seleccionado",
  gamesTitle: "Juegos",
  gamesCode: "Expediente 02 // Juegos de navegador",
  gamesIntro1: "Juegos pequeños, hechos de principio a fin y publicados.",
  gamesIntro2: "Todos funcionan en el navegador, sin instalar nada.",
  index: "Índice",
  projectCode: "Código de proyecto",
  game: "Juego",
  play: "Jugar",
  screenshot: (name) => `Captura de ${name}`,
  photoEyebrow: "Galería",
  photoTitle: "Fotografía",
  photoCode: "Expediente 01 // Fotogramas",
  photoIntro: "Paisajes, ciudades y algún rincón tranquilo. Pulsa cualquier fotograma para verlo a pantalla completa.",
  openPhoto: (title) => `Abrir foto: ${title}`,
  previousPhoto: "Foto anterior",
  nextPhoto: "Foto siguiente",
  close: "Cerrar",
};

export const DICTS: Record<Lang, Dict> = { en, es };

/** El diccionario de un segmento [lang] (cualquier valor raro cae al inglés). */
export const dictFor = (lang: string): Dict => DICTS[isLang(lang) ? lang : "en"];
