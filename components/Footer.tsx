import LangSwitch from "@/components/LangSwitch";
import { Cross } from "@/components/Ink";
import { Scribble } from "@/components/InkBox";
import { dictFor, isLang } from "@/lib/i18n";

/**
 * Pie, simétrico: el copyright a la izquierda y el idioma y la ciudad a la
 * derecha, entre medias una línea a mano con una cruz. El Instagram no va aquí:
 * vive en la cabecera de Fotografía. Sin año, a propósito. En un móvil estrecho
 * idioma y ciudad bajan a una segunda línea, alineados a la derecha.
 */
export default function Footer({ lang, className = "" }: { lang: string; className?: string }) {
  const t = dictFor(lang);
  return (
    <footer className={`flex shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-1 text-ink ${className}`}>
      <span className="note whitespace-nowrap text-ink">&copy; Antonio Asis Bastos de Cordoba</span>
      <span aria-hidden className="hidden min-w-0 flex-1 items-center gap-4 md:flex">
        <Scribble seed="footer-a" width={2} className="h-2.5 flex-1" />
        <Cross className="h-3 w-3 shrink-0" />
        <Scribble seed="footer-b" width={2} className="h-2.5 flex-1" />
      </span>
      <span className="ml-auto flex shrink-0 items-center gap-3 md:gap-4">
        <LangSwitch lang={isLang(lang) ? lang : "en"} label={t.langLabel} />
        <Cross className="h-2.5 w-2.5" />
        <span className="note text-right text-ink">Madrid, ES</span>
      </span>
    </footer>
  );
}
