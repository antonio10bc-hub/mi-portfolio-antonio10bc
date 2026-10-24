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
  /**
   * Vídeo del juego en bucle, sin sonido, sin extensión: en public/videos/projects/ van
   * `<nombre>.webm` (VP9) y `<nombre>.mp4` (H.264, para Safari), 960x600, 5 a 7 s.
   * Se graba jugando en local, igual que las capturas.
   */
  video?: string;
  /** Hex. Color dominante de la captura: se pinta detrás mientras la imagen carga. */
  tint: string;
};

export const PROJECTS: Project[] = [
  {
    name: "Coinfliip",
    href: "https://www.coinfliip.com/",
    tagline: "Every head doubles your score and tails wipes it: bank your streak in time, hunt the 1 in 50,000 edge and climb the global leaderboard, solo or in rooms with friends.",
    taglineEs: "Cada cara duplica tu puntuación y cada cruz la borra: guarda la racha a tiempo, busca el canto (1 entre 50.000) y escala en la clasificación mundial, en solitario o en salas con amigos.",
    screenshot: "/images/projects/coinfliip.webp",
    video: "/videos/projects/coinfliip",
    tint: "#D9E894",
  },
  {
    name: "Magic Poker",
    href: "https://magic-poker-kappa.vercel.app/",
    tagline: "A pixel art card duel: lay poker cards face to face against twelve bosses, each with its own deck and seals that bend the rules, on the way to the Castle.",
    taglineEs: "Un duelo de cartas en pixel art: enfrenta cartas de póker contra doce jefes, cada uno con su mazo y sellos que cambian las reglas, camino del Castillo.",
    screenshot: "/images/projects/magic-poker.webp",
    video: "/videos/projects/magic-poker",
    tint: "#272622",
  },
  {
    name: "ASCII Forest",
    href: "https://asciiforest-game.vercel.app/",
    tagline: "A forest drawn in text on a green phosphor screen: plant seeds and watch trees, a river, frogs, bees and deer grow on their own, until a wildfire needs putting out.",
    taglineEs: "Un bosque dibujado con texto en una pantalla de fósforo verde: planta semillas y mira cómo crecen solos árboles, un río, ranas, abejas y ciervos, hasta que un incendio obliga a apagarlo.",
    screenshot: "/images/projects/ascii-forest.webp",
    video: "/videos/projects/ascii-forest",
    tint: "#0D140B",
  },
  {
    name: "Chaotic Golf Game",
    href: "https://chaoticgolfweb.vercel.app/",
    tagline: "The card game on a digital table: golf played with cards, bunkers, portals and CHECK, against bots or with friends on one phone, plus a daily challenge and a level creator.",
    taglineEs: "El juego de cartas en una mesa digital: golf con cartas, búnkeres, portales y JAQUE, contra bots o con amigos en el mismo móvil, con reto diario y creador de niveles.",
    screenshot: "/images/projects/chaotic-golf.webp",
    video: "/videos/projects/chaotic-golf",
    tint: "#3E6B45",
  },
  {
    name: "Tank-less",
    href: "https://tanquesweb.vercel.app/",
    tagline: "A voxel tank duel in retro DS style: you are invisible while you move and give yourself away when you stop to fire. A campaign of eight boss worlds, survival and two player duels.",
    taglineEs: "Un duelo de tanques voxel con estética retro de DS: mientras te mueves eres invisible y al pararte a disparar te delatas. Campaña de ocho mundos con jefe, supervivencia y duelo a dos.",
    screenshot: "/images/projects/tanques.webp",
    video: "/videos/projects/tanques",
    tint: "#3A3868",
  },
];
