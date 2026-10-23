import { Dots } from "@/components/Hud";

/**
 * Cabecera de expediente. El título va como titular gigante en minúsculas con
 * punto final; debajo, el código del expediente, la intro en texto de datos y,
 * a la derecha, `aside` (un espécimen tramado o una tabla de datos).
 */
export default function SectionHeader({
  eyebrow,
  title,
  code,
  intro,
  meta,
  aside,
  className = "",
}: {
  eyebrow: string;
  title: string;
  /** Identificador del expediente: "FILE 02". */
  code: string;
  intro?: React.ReactNode;
  /** Cifra corta: nº de piezas. */
  meta?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={`border-b-2 border-ink pb-8 md:pb-10 ${className}`}>
      <div className="flex items-center gap-3">
        <Dots className="text-ink" />
        <span className="label text-ink">{eyebrow}</span>
      </div>

      <h1 className="display mt-4 text-[clamp(3.25rem,16vw,12rem)] text-ink">{title}.</h1>

      <div className="mt-6 grid grid-cols-1 gap-8 md:mt-8 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 border-b border-ink pb-2">
            <span aria-hidden className="h-3 w-3 bg-ink" />
            <span className="code text-xs text-ink md:text-sm">{code}</span>
            {meta && <span className="label ml-auto text-ink">{meta}</span>}
          </div>
          {intro && <p className="datatext mt-3 max-w-md">{intro}</p>}
        </div>

        {aside && <div className="relative md:col-span-6 md:col-start-7">{aside}</div>}
      </div>
    </header>
  );
}
