type Blob = {
  /** Posición y tamaño. */
  box: string;
  /** Degradado de color. */
  tint: string;
  blur: string;
  /** Cada blob deriva a su propio ritmo para que el conjunto no pulse a la vez. */
  duration: string;
  delay: string;
};

const FULL_BLOBS: Blob[] = [
  { box: "-top-32 -left-28 w-[38rem] h-[38rem]", tint: "from-[#D4FF00]/40 to-emerald-400/40", blur: "blur-[110px]", duration: "28s", delay: "0s" },
  { box: "-top-24 -right-32 w-[34rem] h-[34rem]", tint: "from-violet-400/40 to-fuchsia-300/35", blur: "blur-[120px]", duration: "34s", delay: "-6s" },
  { box: "top-[38%] -left-40 w-[30rem] h-[30rem]", tint: "from-amber-300/40 to-orange-300/35", blur: "blur-[115px]", duration: "31s", delay: "-12s" },
  { box: "top-[52%] -right-36 w-[32rem] h-[32rem]", tint: "from-sky-300/40 to-blue-400/35", blur: "blur-[120px]", duration: "37s", delay: "-18s" },
  { box: "-bottom-40 left-[8%] w-[36rem] h-[36rem]", tint: "from-indigo-400/35 to-violet-300/30", blur: "blur-[130px]", duration: "33s", delay: "-4s" },
  { box: "bottom-[6%] right-[6%] w-[26rem] h-[26rem]", tint: "from-[#E2FF6B]/45 to-yellow-300/35", blur: "blur-[105px]", duration: "29s", delay: "-22s" },
];

const MINIMAL_BLOBS: Blob[] = [
  { box: "-top-32 -left-28 w-[36rem] h-[36rem]", tint: "from-[#D4FF00]/40 to-emerald-400/40", blur: "blur-[115px]", duration: "30s", delay: "0s" },
  { box: "top-[32%] -right-32 w-[32rem] h-[32rem]", tint: "from-sky-300/40 to-blue-400/35", blur: "blur-[125px]", duration: "36s", delay: "-10s" },
  { box: "-bottom-36 left-[12%] w-[34rem] h-[34rem]", tint: "from-indigo-400/35 to-violet-300/30", blur: "blur-[130px]", duration: "32s", delay: "-20s" },
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
          style={{ animationDuration: blob.duration, animationDelay: blob.delay }}
          className={`absolute rounded-full bg-gradient-to-br mix-blend-multiply animate-blob motion-reduce:animate-none
                      ${blob.box} ${blob.tint} ${blob.blur}`}
        />
      ))}

      {/* Velo de arena: rebaja la saturación del conjunto y evita que el color
          compita con el contenido. */}
      <div className="absolute inset-0 bg-sand/25" />

      {/* Viñeta suave hacia los bordes, para que el color quede centrado. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_25%,rgba(235,232,224,0.6)_100%)]" />
    </div>
  );
}
