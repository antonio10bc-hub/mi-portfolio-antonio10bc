type Blob = {
  /** Posición y tamaño. */
  box: string;
  /** Color del núcleo, como "r,g,b". */
  core: string;
  /** Color del halo, como "r,g,b". */
  halo: string;
  /** Opacidad máxima, en el centro. */
  alpha: number;
  /** Cada blob deriva a su propio ritmo para que el conjunto no pulse a la vez. */
  duration: string;
  delay: string;
  /** Los blobs secundarios no se pintan en móvil, para aligerar el compositing. */
  soloEscritorio?: boolean;
};

/*
 * Los blobs son degradados radiales, no círculos con `filter: blur()`.
 * El blur era el mayor coste de GPU de la página y, sobre elementos de este
 * tamaño, Safari en iOS lo rasteriza por tiles y deja costuras visibles.
 *
 * Dos detalles hacen que el degradado no se note como un círculo:
 *  - la caída imita una gaussiana con varias paradas, en vez de ser lineal,
 *    que dejaba un anillo perceptible donde terminaba el color;
 *  - la última parada es el mismo RGB con alfa 0, nunca `transparent`, que al
 *    interpolar hacia negro transparente ensucia el borde con un halo gris;
 *  - el degradado se dimensiona con `closest-side`, para que llegue a alfa 0
 *    dentro de la caja y esta nunca recorte color (costuras rectangulares).
 */
const CAIDA: [number, number][] = [
  [0, 1], [20, 0.86], [38, 0.66], [54, 0.44], [70, 0.25], [84, 0.1], [100, 0],
];

const blobStyle = ({ core, halo, alpha }: Pick<Blob, "core" | "halo" | "alpha">) => {
  const paradas = CAIDA.map(([pos, factor]) => {
    const rgb = pos <= 30 ? core : halo;
    return `rgba(${rgb},${(alpha * factor).toFixed(3)}) ${pos}%`;
  });
  // `closest-side` centrado: el degradado alcanza alfa 0 justo en el borde de
  // la caja. Sin él, el degradado se dimensiona hasta la esquina más lejana y
  // todavía lleva color cuando la caja lo corta, dejando costuras rectangulares.
  return `radial-gradient(circle closest-side at 50% 50%, ${paradas.join(", ")})`;
};

const FULL_BLOBS: Blob[] = [
  { box: "-top-40 -left-36 w-[26rem] h-[26rem] md:w-[44rem] md:h-[44rem]", core: "196,240,0", halo: "52,211,153", alpha: 0.6, duration: "28s", delay: "0s" },
  { box: "-top-32 -right-40 w-[24rem] h-[24rem] md:w-[40rem] md:h-[40rem]", core: "167,139,250", halo: "240,171,252", alpha: 0.55, duration: "34s", delay: "-6s" },
  { box: "top-[36%] -left-44 w-[36rem] h-[36rem]", core: "252,211,77", halo: "253,186,116", alpha: 0.55, duration: "31s", delay: "-12s", soloEscritorio: true },
  { box: "top-[50%] -right-40 w-[23rem] h-[23rem] md:w-[38rem] md:h-[38rem]", core: "125,211,252", halo: "96,165,250", alpha: 0.55, duration: "37s", delay: "-18s" },
  { box: "-bottom-44 left-[6%] w-[42rem] h-[42rem]", core: "129,140,248", halo: "196,181,253", alpha: 0.5, duration: "33s", delay: "-4s", soloEscritorio: true },
  { box: "bottom-[4%] right-[4%] w-[32rem] h-[32rem]", core: "226,255,107", halo: "253,224,71", alpha: 0.55, duration: "29s", delay: "-22s", soloEscritorio: true },
];

const MINIMAL_BLOBS: Blob[] = [
  { box: "-top-44 -left-44 w-[30rem] h-[30rem] md:w-[50rem] md:h-[50rem]", core: "196,240,0", halo: "52,211,153", alpha: 0.55, duration: "30s", delay: "0s" },
  { box: "top-[28%] -right-44 w-[27rem] h-[27rem] md:w-[46rem] md:h-[46rem]", core: "125,211,252", halo: "96,165,250", alpha: 0.5, duration: "36s", delay: "-10s" },
  { box: "-bottom-48 left-[6%] w-[48rem] h-[48rem]", core: "129,140,248", halo: "196,181,253", alpha: 0.46, duration: "32s", delay: "-20s", soloEscritorio: true },
];

export default function AnimatedBackground({
  variant = "full",
  position = "fixed",
}: {
  variant?: "full" | "minimal";
  position?: "fixed" | "absolute";
}) {
  const blobs = variant === "full" ? FULL_BLOBS : MINIMAL_BLOBS;

  return (
    <div
      aria-hidden
      className={`${position === "fixed" ? "fixed" : "absolute"} inset-0 z-0 overflow-hidden pointer-events-none`}
    >
      {blobs.map((blob) => (
        <div
          key={blob.box}
          style={{
            backgroundImage: blobStyle(blob),
            animationDuration: blob.duration,
            animationDelay: blob.delay,
          }}
          className={`absolute animate-blob motion-reduce:animate-none
                      ${blob.soloEscritorio ? "hidden md:block" : ""} ${blob.box}`}
        />
      ))}

      {/* Viñeta suave hacia los bordes, para que el color quede centrado. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_25%,rgba(235,232,224,0.45)_100%)]" />
    </div>
  );
}
