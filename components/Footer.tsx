/** Regla de pie con quiebro, como los corchetes de línea de la base de la referencia. */
function FootRule({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 16"
      preserveAspectRatio="none"
      className={`hidden h-3 min-w-0 flex-1 md:block ${flip ? "-scale-x-100" : ""}`}
    >
      <path
        d="M1 15V1H78L92 15H100"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * Fila inferior, simétrica: el copyright a la izquierda y la ciudad a la
 * derecha, los dos en la misma microtipografía. El Instagram no va aquí: vive
 * en la cabecera de Fotografía. Sin año, a propósito.
 */
export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer className={`flex shrink-0 items-center justify-between gap-6 text-ink ${className}`}>
      <span className="label">&copy; Antonio Asis Bastos de Cordoba</span>
      <FootRule />
      <FootRule flip />
      <span className="label text-right">Madrid, ES</span>
    </footer>
  );
}
