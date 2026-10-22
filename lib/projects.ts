export type Project = {
  name: string;
  href: string;
  /** Una frase. Es el único texto largo de la tarjeta: mantenerlo breve. */
  tagline: string;
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
    screenshot: "/images/projects/coinfliip.webp",
    tint: "#CCFF33",
  },
  {
    name: "Magic Poker",
    href: "https://magic-poker-kappa.vercel.app/",
    tagline: "A poker table in the browser, across three difficulty levels.",
    screenshot: "/images/projects/magic-poker.webp",
    tint: "#0B0D0C",
  },
  {
    name: "ASCII Forest",
    href: "https://asciiforest-game.vercel.app/",
    tagline: "A narrative forest sim drawn in text: tend flora and fauna, one day at a time.",
    screenshot: "/images/projects/ascii-forest.webp",
    tint: "#0D140B",
  },
  {
    name: "Chaotic Golf Game",
    href: "https://chaoticgolfweb.vercel.app/",
    tagline: "Playable prototype of the card game: configurable matches against the AI, plus a level creator.",
    screenshot: "/images/projects/chaotic-golf.webp",
    tint: "#3E6B45",
  },
  {
    name: "Tanques Invisibles",
    href: "https://tanquesweb.vercel.app/",
    tagline: "A voxel tank duel against the AI: keep moving to stay hidden, stop to fire, and every shot gives you away.",
    screenshot: "/images/projects/tanques.webp",
    tint: "#1FB6FF",
  },
];
