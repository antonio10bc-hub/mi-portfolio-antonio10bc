import Link from "next/link";
import LangSwitch from "@/components/LangSwitch";
import { Scribble } from "@/components/InkBox";
import { dictFor, isLang } from "@/lib/i18n";

/**
 * La barra de arriba de todas las páginas, mínima: las dos secciones a la
 * izquierda (la actual, subrayada a mano), "antonio" pequeño en el centro, que
 * lleva a la home, y el idioma (y la ciudad, en escritorio) a la derecha.
 */
export default function TopBar({ lang, current, className = "" }: { lang: string; current?: "photography" | "games"; className?: string }) {
  const t = dictFor(lang);
  const sections = [
    { key: "photography", label: t.photoPanelTitle, href: "/photography" },
    { key: "games", label: t.gamesPanelTitle, href: "/projects" },
  ] as const;
  return (
    <header className={`grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 ${className}`}>
      {/* En un móvil estrecho las dos secciones van una encima de otra: en fila no caben junto al nombre. */}
      <nav aria-label={t.sections} className="flex flex-col items-start sm:flex-row sm:items-center sm:gap-4 md:gap-6">
        {sections.map((section) => {
          const active = section.key === current;
          return (
            <Link
              key={section.key}
              href={section.href}
              aria-current={active ? "page" : undefined}
              className="relative text-[13px] font-semibold text-ink transition-colors duration-300 hover:text-mute md:text-[15px]"
            >
              {section.label}
              {active && <Scribble seed={`top-${section.key}`} width={2} draw delay={0.4} className="absolute -bottom-1.5 left-0 h-2 w-full" />}
            </Link>
          );
        })}
      </nav>
      <Link href="/" className="hand-display wiggle text-[1.6rem] md:text-[1.9rem]">
        antonio
      </Link>
      <div className="flex items-center justify-end gap-4">
        <LangSwitch lang={isLang(lang) ? lang : "en"} label={t.langLabel} />
        <span className="note hidden text-ink md:inline">Madrid, ES</span>
      </div>
    </header>
  );
}
