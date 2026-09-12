export type ProjectCategory = "game" | "web";

export type Project = {
  name: string;
  href: string;
  category: ProjectCategory;
  /** Una frase. Es el único texto largo de la tarjeta: mantenerlo breve. */
  tagline: string;
  /** Hex. Solo se usa en el punto, el filo inferior y el velo de hover. */
  accent: string;
};

/** Etiqueta de la tarjeta, junto al punto de acento. */
export const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  game: "Game",
  web: "Web app",
};

/** Grupos de la página, en orden de aparición. */
export const CATEGORY_GROUPS: { category: ProjectCategory; title: string }[] = [
  { category: "game", title: "Games" },
  { category: "web", title: "Webs" },
];

/** Dentro de cada grupo se respeta este orden. */
export const PROJECTS: Project[] = [
  {
    name: "Coinfliip",
    href: "https://www.coinfliip.com/",
    category: "game",
    tagline: "Flip a coin to settle anything, or chase a run of heads up the global leaderboard.",
    accent: "#B8D900",
  },
  {
    name: "Magic Poker",
    href: "https://magic-poker-kappa.vercel.app/",
    category: "game",
    tagline: "A poker table in the browser, across three difficulty levels.",
    accent: "#7C5CFF",
  },
  {
    name: "ASCII Forest",
    href: "https://asciiforest-game.vercel.app/",
    category: "game",
    tagline: "A narrative forest sim drawn in text: tend flora and fauna, one day at a time.",
    accent: "#3FBF6F",
  },
  {
    name: "Chaotic Golf Game",
    href: "https://chaoticgolfweb.vercel.app/",
    category: "game",
    tagline: "Playable prototype of the card game: configurable matches against the AI, plus a level creator.",
    accent: "#E2703A",
  },
  {
    name: "Chaotic Golf",
    href: "https://chaothicgolf.vercel.app/",
    category: "web",
    tagline: "Landing page for the board game, with the full card gallery and the rules.",
    accent: "#2F7A4A",
  },
  {
    name: "Qué Cenamos Hoy",
    href: "https://quecenamoshoy.vercel.app/",
    category: "web",
    tagline: "Plan lunch and dinner by dropping dishes into the day.",
    accent: "#E86A9B",
  },
];
