type Blob = {
  /** Posición y tamaño. Las cajas no son cuadradas: la elipse resultante es
   *  menos reconocible como "círculo" y el conjunto parece más orgánico. */
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
 * Tres detalles hacen que el degradado no se note como una forma recortada:
 *  - se dimensiona con `closest-side`, para que llegue a alfa 0 dentro de la
 *    caja y esta nunca recorte color (costuras rectangulares);
 *  - la última parada es el mismo RGB con alfa 0, nunca `transparent`, que al
 *    interpolar hacia negro transparente ensucia el borde con un halo gris;
 *  - la caída es una campana ancha y de núcleo plano, no una rampa lineal.
 *    Un blur pesado no tiene centro brillante, y es eso lo que hay que imitar
 *    para que el blob se lea difuso en vez de como una mancha con borde.
 */
const CAIDA: [number, number][] = [
  [0, 1], [12, 0.95], [24, 0.84], [36, 0.69], [48, 0.53],
  [60, 0.38], [72, 0.24], [84, 0.12], [93, 0.05], [100, 0],
];

const blobStyle = ({ core, halo, alpha }: Pick<Blob, "core" | "halo" | "alpha">) => {
  const paradas = CAIDA.map(([pos, factor]) => {
    const rgb = pos <= 30 ? core : halo;
    return `rgba(${rgb},${(alpha * factor).toFixed(3)}) ${pos}%`;
  });
  return `radial-gradient(ellipse closest-side at 50% 50%, ${paradas.join(", ")})`;
};

const FULL_BLOBS: Blob[] = [
  { box: "-top-48 -left-44 w-[32rem] h-[26rem] md:w-[58rem] md:h-[46rem]", core: "196,240,0", halo: "52,211,153", alpha: 0.19, duration: "21s", delay: "0s" },
  { box: "-top-40 -right-48 w-[28rem] h-[32rem] md:w-[50rem] md:h-[56rem]", core: "167,139,250", halo: "240,171,252", alpha: 0.18, duration: "26s", delay: "-7s" },
  { box: "top-[34%] -left-52 w-[46rem] h-[38rem]", core: "252,211,77", halo: "253,186,116", alpha: 0.17, duration: "23s", delay: "-13s", soloEscritorio: true },
  { box: "top-[48%] -right-44 w-[27rem] h-[30rem] md:w-[48rem] md:h-[52rem]", core: "125,211,252", halo: "96,165,250", alpha: 0.18, duration: "28s", delay: "-18s" },
  { box: "-bottom-52 left-[4%] w-[54rem] h-[44rem]", core: "129,140,248", halo: "196,181,253", alpha: 0.16, duration: "24s", delay: "-4s", soloEscritorio: true },
  { box: "bottom-[2%] right-[2%] w-[40rem] h-[34rem]", core: "226,255,107", halo: "253,224,71", alpha: 0.18, duration: "19s", delay: "-15s", soloEscritorio: true },
];

const MINIMAL_BLOBS: Blob[] = [
  { box: "-top-52 -left-52 w-[36rem] h-[30rem] md:w-[62rem] md:h-[50rem]", core: "196,240,0", halo: "52,211,153", alpha: 0.18, duration: "22s", delay: "0s" },
  { box: "top-[26%] -right-52 w-[30rem] h-[34rem] md:w-[54rem] md:h-[58rem]", core: "125,211,252", halo: "96,165,250", alpha: 0.16, duration: "27s", delay: "-11s" },
  { box: "-bottom-56 left-[4%] w-[58rem] h-[46rem]", core: "129,140,248", halo: "196,181,253", alpha: 0.15, duration: "24s", delay: "-19s", soloEscritorio: true },
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_25%,rgba(235,232,224,0.62)_100%)]" />
    </div>
  );
}
