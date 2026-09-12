type Blob = {
  /** Posición y tamaño. */
  box: string;
  /** Degradado de color. */
  tint: string;
  /** Desenfoque reducido en móvil: un blur enorme es carísimo en GPU de teléfono. */
  blur: string;
  /** Cada blob deriva a su propio ritmo para que el conjunto no pulse a la vez. */
  duration: string;
  delay: string;
  /** Los blobs secundarios no se pintan en móvil, para aligerar el compositing. */
  soloEscritorio?: boolean;
};

const FULL_BLOBS: Blob[] = [
  { box: "-top-32 -left-28 w-[38rem] h-[38rem]", tint: "from-[#D4FF00]/55 to-emerald-400/50", blur: "blur-[70px] md:blur-[110px]", duration: "28s", delay: "0s" },
  { box: "-top-24 -right-32 w-[34rem] h-[34rem]", tint: "from-violet-400/50 to-fuchsia-300/45", blur: "blur-[75px] md:blur-[120px]", duration: "34s", delay: "-6s" },
  { box: "top-[38%] -left-40 w-[30rem] h-[30rem]", tint: "from-amber-300/50 to-orange-300/45", blur: "blur-[70px] md:blur-[115px]", duration: "31s", delay: "-12s", soloEscritorio: true },
  { box: "top-[52%] -right-36 w-[32rem] h-[32rem]", tint: "from-sky-300/50 to-blue-400/45", blur: "blur-[75px] md:blur-[120px]", duration: "37s", delay: "-18s" },
  { box: "-bottom-40 left-[8%] w-[36rem] h-[36rem]", tint: "from-indigo-400/45 to-violet-300/40", blur: "blur-[80px] md:blur-[130px]", duration: "33s", delay: "-4s", soloEscritorio: true },
  { box: "bottom-[6%] right-[6%] w-[26rem] h-[26rem]", tint: "from-[#E2FF6B]/55 to-yellow-300/45", blur: "blur-[65px] md:blur-[105px]", duration: "29s", delay: "-22s", soloEscritorio: true },
];

const MINIMAL_BLOBS: Blob[] = [
  { box: "-top-40 -left-40 w-[46rem] h-[46rem]", tint: "from-[#D4FF00]/55 to-emerald-400/50", blur: "blur-[80px] md:blur-[150px]", duration: "30s", delay: "0s" },
  { box: "top-[30%] -right-40 w-[42rem] h-[42rem]", tint: "from-sky-300/50 to-blue-400/45", blur: "blur-[85px] md:blur-[155px]", duration: "36s", delay: "-10s" },
  { box: "-bottom-44 left-[8%] w-[44rem] h-[44rem]", tint: "from-indigo-400/45 to-violet-300/40", blur: "blur-[85px] md:blur-[160px]", duration: "32s", delay: "-20s", soloEscritorio: true },
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
    // Sin `mix-blend-mode` a propósito: mezclado con los `backdrop-filter` de
    // las tarjetas, Safari en iOS da resultados impredecibles. El color se
    // consigue con opacidad pura, que se pinta igual en todos los navegadores.
    <div
      aria-hidden
      className={`${position === "fixed" ? "fixed" : "absolute"} inset-0 z-0 overflow-hidden pointer-events-none`}
    >
      {blobs.map((blob) => (
        <div
          key={blob.box}
          style={{ animationDuration: blob.duration, animationDelay: blob.delay }}
          className={`absolute rounded-full bg-gradient-to-br animate-blob motion-reduce:animate-none
                      ${blob.soloEscritorio ? "hidden md:block" : ""}
                      ${blob.box} ${blob.tint} ${blob.blur}`}
        />
      ))}

      {/* Velo de arena: rebaja la saturación del conjunto y evita que el color
          compita con el contenido. */}
      <div className="absolute inset-0 bg-sand/10" />

      {/* Viñeta suave hacia los bordes, para que el color quede centrado. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_25%,rgba(235,232,224,0.45)_100%)]" />
    </div>
  );
}
