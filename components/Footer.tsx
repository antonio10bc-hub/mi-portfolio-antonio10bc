const INSTAGRAM = { handle: "@antonio10bc", href: "https://www.instagram.com/antonio10bc/" };

/** Regla de pie con quiebro, como los corchetes de línea de la base de la referencia. */
function FootRule({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 16"
      preserveAspectRatio="none"
      className={`hidden h-4 min-w-0 flex-1 md:block ${flip ? "-scale-x-100" : ""}`}
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
 * Fila inferior: a la izquierda el usuario de Instagram como titular (el
 * "@ctmak" de la referencia), a la derecha la ciudad. Sin año, a propósito.
 */
export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer className={`shrink-0 text-ink ${className}`}>
      <div className="flex items-end justify-between gap-6">
        <a
          href={INSTAGRAM.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          data-track="instagram_clicked"
          className="display text-[clamp(1.25rem,3vw,2.25rem)] transition-opacity duration-300 hover:opacity-60"
        >
          {INSTAGRAM.handle}
        </a>
        <FootRule />
        <FootRule flip />
        <span className="display text-right text-[clamp(1.25rem,3vw,2.25rem)]">madrid, es.</span>
      </div>
      <p className="label mt-2">&copy; Antonio Asis Bastos de Cordoba</p>
    </footer>
  );
}
