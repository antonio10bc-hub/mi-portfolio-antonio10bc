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

import LangSwitch from "@/components/LangSwitch";
import { dictFor, isLang } from "@/lib/i18n";

/**
 * Fila inferior, simétrica: el copyright a la izquierda y la ciudad a la
 * derecha, los dos en la misma microtipografía. El Instagram no va aquí: vive
 * en la cabecera de Fotografía. Sin año, a propósito. Junto a la ciudad, el selector
 * de idioma, en la misma microtipografía. En un móvil estrecho no cabe todo en una
 * fila: idioma y ciudad bajan a una segunda línea, alineados a la derecha.
 */
export default function Footer({ lang, className = "" }: { lang: string; className?: string }) {
  const t = dictFor(lang);
  return (
    <footer className={`flex shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-2 text-ink ${className}`}>
      <span className="label whitespace-nowrap">&copy; Antonio Asis Bastos de Cordoba</span>
      <FootRule />
      <FootRule flip />
      <span className="ml-auto flex shrink-0 items-center gap-3 md:gap-4">
        <LangSwitch lang={isLang(lang) ? lang : "en"} label={t.langLabel} />
        <span aria-hidden className="h-3 w-px bg-ink/25" />
        <span className="label text-right">Madrid, ES</span>
      </span>
    </footer>
  );
}
