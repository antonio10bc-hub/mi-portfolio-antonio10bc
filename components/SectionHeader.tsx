import { InkArrow } from "@/components/Ink";
import { Scribble } from "@/components/InkBox";

/**
 * Cabecera de página de cuaderno: una nota al margen, el título rotulado a mano
 * a todo lo ancho y subrayado de un trazo que se dibuja al llegar. Debajo, la
 * intro y `contents` (el índice de juegos, la ficha del visor) a la izquierda y
 * `aside` (un garabato) a la derecha.
 */
export default function SectionHeader({
  eyebrow,
  title,
  intro,
  meta,
  contents,
  aside,
  className = "",
}: {
  eyebrow: string;
  title: string;
  intro?: React.ReactNode;
  /** Bajo la intro: un enlace o una cifra corta. */
  meta?: React.ReactNode;
  /** Bajo la intro, en la columna izquierda. */
  contents?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={`relative pb-10 md:pb-16 ${className}`}>
      <div className="flex items-end gap-2">
        <span className="note -rotate-2 text-[15px] text-ink md:text-lg">{eyebrow}</span>
        <InkArrow seed={`eyebrow-${title}`} direction="down" curl className="mb-1 h-5 w-10 md:h-6 md:w-12" draw delay={0.2} />
      </div>

      <h1 className="hand-display wiggle mt-1 w-fit text-[clamp(2.5rem,11vw,8.5rem)]">{title}</h1>
      <Scribble seed={`title-${title}`} draw delay={0.35} className="mt-1 h-3.5 w-[min(80%,36rem)] md:mt-2 md:h-5" />

      <div className="mt-8 grid grid-cols-1 gap-10 md:mt-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-6 lg:col-span-5">
          {intro && <p className="hand max-w-lg text-mute md:text-lg">{intro}</p>}
          {meta && <div className="mt-4">{meta}</div>}
          {contents}
        </div>
        {aside && (
          <div aria-hidden className="relative hidden items-center justify-center md:col-span-5 md:col-start-8 md:flex">
            {aside}
          </div>
        )}
      </div>
    </header>
  );
}
