export default function SectionHeader({
  eyebrow,
  title,
  intro,
  meta,
  className = "",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  /** Cifra corta a la derecha: nº de piezas, año, etc. */
  meta?: string;
  className?: string;
}) {
  return (
    <header
      className={`glass-strong rounded-4xl px-6 py-7 md:px-10 md:py-9 ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-lime" />
          <span className="label">{eyebrow}</span>
        </div>
        {meta && <span className="label">{meta}</span>}
      </div>

      <h1 className="mt-4 text-5xl md:text-7xl font-semibold uppercase leading-[0.92] tracking-tighter text-offblack">
        {title}
      </h1>

      {intro && (
        <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed text-softblack">
          {intro}
        </p>
      )}
    </header>
  );
}
