import Image from "next/image";
import Link from "next/link";
import { Arrow, Barcode, Dots } from "@/components/Hud";

/**
 * Cierre de una página interior: el panel grafito que lleva al otro expediente,
 * el mismo lenguaje que el panel "games." de la home. En /projects ocupa la
 * celda que deja libre un número impar de juegos; en /photography va a todo el
 * ancho antes del pie.
 */
export default function NextFile({
  href,
  section,
  label,
  code,
  title,
  text,
  previews = [],
  previewClassName = "grid-cols-3 [&>*]:aspect-[4/3]",
  className = "",
}: {
  href: string;
  /** Nombre fijo para las analíticas (no cambia con el idioma) */
  section: string;
  /** "Next file" */
  label: string;
  code: string;
  title: string;
  text: string;
  /** Hoja de contactos del expediente de destino: el color lo pone el contenido. */
  previews?: { src: string; unoptimized?: boolean }[];
  /** Columnas y proporción de la hoja de contactos. */
  previewClassName?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      data-track="next_file_clicked"
      data-track-section={section}
      className={`group flex min-h-[14rem] flex-col justify-between gap-8 bg-graphite p-6 text-paper
                  transition-colors duration-500 ease-smooth hover:bg-ink md:p-8 ${className}`}
    >
      <div className="flex items-center gap-3">
        <Dots />
        <span className="code whitespace-nowrap text-[11px] md:text-xs">{label}</span>
        {/* Código y código de barras solo desde xl: en media celda, a 768 y 1024,
            el español ("Siguiente expediente", "Expediente 01 // ...") no cabe. */}
        <span className="code ml-auto hidden whitespace-nowrap text-[11px] md:text-xs xl:inline">{code}</span>
      </div>

      {previews.length > 0 && (
        <div aria-hidden className={`grid gap-2 ${previewClassName}`}>
          {previews.map((preview) => (
            <div key={preview.src} className="relative overflow-hidden bg-ink">
              <Image
                src={preview.src}
                alt=""
                fill
                unoptimized={preview.unoptimized}
                sizes="(max-width: 768px) 33vw, 16vw"
                className="object-cover opacity-90 transition-[opacity,transform] duration-700 ease-smooth
                           group-hover:scale-[1.04] group-hover:opacity-100 motion-reduce:group-hover:scale-100"
              />
            </div>
          ))}
        </div>
      )}

      <div>
        <div className="flex items-end justify-between gap-4 border-b-2 border-paper pb-3">
          <h2 className="display text-[clamp(2.75rem,7vw,5.5rem)]">{title}</h2>
          <Arrow
            direction="right"
            className="mb-2 h-6 w-6 shrink-0 transition-transform duration-500 ease-smooth group-hover:translate-x-1.5 md:h-8 md:w-8"
          />
        </div>
        <div className="mt-3 flex items-center gap-6">
          <p className="font-mono text-[11px] leading-snug md:text-xs">{text}</p>
          <Barcode seed={`next-${section}`} className="ml-auto hidden h-6 w-40 shrink-0 xl:block" />
        </div>
      </div>
    </Link>
  );
}
