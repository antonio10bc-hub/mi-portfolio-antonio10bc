export type Project = {
  name: string;
  href: string;
  /** Una frase. Es el único texto largo de la tarjeta: mantenerlo breve. */
  tagline: string;
  /** La misma frase en español. */
  taglineEs: string;
  /**
   * Captura real del juego, 16:10 (1280x800, WebP, calidad 80), en public/images/projects/.
   * Se hacen en local desde el repo de cada juego: la tarjeta tiene que parecerse al juego.
   */
  screenshot: string;
  /** Hex. Color dominante de la captura: se pinta detrás mientras la imagen carga. */
  tint: string;
};

export const PROJECTS: Project[] = [
  {
    name: "Coinfliip",
    href: "https://www.coinfliip.com/",
    tagline: "Flip a coin to settle anything, or chase a run of heads up the global leaderboard.",
    taglineEs: "Lanza una moneda para decidir cualquier cosa, o encadena caras para subir en la clasificación mundial.",
    screenshot: "/images/projects/coinfliip.webp",
    tint: "#CCFF33",
  },
  {
    name: "Magic Poker",
    href: "https://magic-poker-kappa.vercel.app/",
    tagline: "A poker table in the browser, across three difficulty levels.",
    taglineEs: "Una mesa de póker en el navegador, con tres niveles de dificultad.",
    screenshot: "/images/projects/magic-poker.webp",
    tint: "#0B0D0C",
  },
  {
    name: "ASCII Forest",
    href: "https://asciiforest-game.vercel.app/",
    tagline: "A narrative forest sim drawn in text: tend flora and fauna, one day at a time.",
    taglineEs: "Un simulador narrativo de bosque dibujado con texto: cuida la flora y la fauna, día a día.",
    screenshot: "/images/projects/ascii-forest.webp",
    tint: "#0D140B",
  },
  {
    name: "Chaotic Golf Game",
    href: "https://chaoticgolfweb.vercel.app/",
    tagline: "Playable prototype of the card game: configurable matches against the AI, plus a level creator.",
    taglineEs: "Prototipo jugable del juego de cartas: partidas configurables contra la IA y un creador de niveles.",
    screenshot: "/images/projects/chaotic-golf.webp",
    tint: "#3E6B45",
  },
  {
    name: "Tank-less",
    href: "https://tanquesweb.vercel.app/",
    tagline: "A voxel tank duel against the AI: keep moving to stay hidden, stop to fire, and every shot gives you away.",
    taglineEs: "Un duelo de tanques voxel contra la IA: muévete para seguir oculto, párate para disparar, y cada disparo te delata.",
    screenshot: "/images/projects/tanques.webp",
    tint: "#1FB6FF",
  },
];
