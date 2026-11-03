import Link from "next/link";
import { Cross, InkArrow } from "@/components/Ink";
import { InkFrame } from "@/components/InkBox";

/**
 * Cierre de una página interior: lo siguiente del cuaderno, dentro de un marco a
 * mano que se dibuja al llegar con el scroll. Va a todo el ancho antes del pie de
 * /photography y lleva a los juegos. Sin imágenes de la otra sección.
 */
export default function NextFile({
  href,
  section,
  label,
  title,
  text,
  className = "",
}: {
  href: string;
  /** Nombre fijo para las analíticas (no cambia con el idioma) */
  section: string;
  /** "next up" */
  label: string;
  title: string;
  text: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      data-track="next_file_clicked"
      data-track-section={section}
      className={`ink-host group relative flex flex-col gap-4 px-6 py-8 text-ink md:flex-row md:items-center md:justify-between md:px-12 md:py-12 ${className}`}
    >
      <InkFrame seed={`next-${section}`} scroll outset={0} width={2.8} />
      <div>
        <span className="note flex items-center gap-2 text-ink">
          <Cross className="h-3 w-3" />
          {label}
        </span>
        <h2 className="hand-display mt-2 text-[clamp(3rem,9vw,7rem)]">{title}</h2>
        <p className="hand mt-3 text-mute">{text}</p>
      </div>
      <InkArrow
        seed={`next-${section}-arrow`}
        curl
        className="h-12 w-32 shrink-0 self-end transition-transform duration-500 ease-spring group-hover:translate-x-3 md:h-20 md:w-52 md:self-center"
      />
    </Link>
  );
}
