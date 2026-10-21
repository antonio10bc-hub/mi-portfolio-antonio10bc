/** Ilustración vectorial de la tarjeta, una por juego (components/ProjectPreview.tsx). */
export type PreviewKind = "coin" | "poker" | "forest" | "golf";

export type Project = {
  name: string;
  href: string;
  /** Una frase. Es el único texto largo de la tarjeta: mantenerlo breve. */
  tagline: string;
  /** Hex. Fondo liso de la preview y punto junto a la etiqueta. */
  accent: string;
  preview: PreviewKind;
  /**
   * Captura real del juego en public/images/projects/, ej. "/images/projects/coinfliip.webp".
   * Si existe sustituye a la ilustración. Formato 16:10, unos 1280px de ancho.
   */
  screenshot?: string;
};

export const PROJECTS: Project[] = [
  {
    name: "Coinfliip",
    href: "https://www.coinfliip.com/",
    tagline: "Flip a coin to settle anything, or chase a run of heads up the global leaderboard.",
    accent: "#B8D900",
    preview: "coin",
  },
  {
    name: "Magic Poker",
    href: "https://magic-poker-kappa.vercel.app/",
    tagline: "A poker table in the browser, across three difficulty levels.",
    accent: "#7C5CFF",
    preview: "poker",
  },
  {
    name: "ASCII Forest",
    href: "https://asciiforest-game.vercel.app/",
    tagline: "A narrative forest sim drawn in text: tend flora and fauna, one day at a time.",
    accent: "#1A2F70",
    preview: "forest",
  },
  {
    name: "Chaotic Golf Game",
    href: "https://chaoticgolfweb.vercel.app/",
    tagline: "Playable prototype of the card game: configurable matches against the AI, plus a level creator.",
    accent: "#1F5E38",
    preview: "golf",
  },
];
