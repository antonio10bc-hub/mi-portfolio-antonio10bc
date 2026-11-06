import Link from "next/link";
import LangSwitch from "@/components/LangSwitch";
import { InkPill } from "@/components/InkBox";
import { dictFor, isLang } from "@/lib/i18n";

/** Cámara a mano, en una caja de 24. */
const CAMERA = (
  <>
    <path d="M3.6 8.4 C3.5 7.1 4.3 6.4 5.5 6.4 H7.6 L9 4.6 H15 L16.4 6.4 H18.5 C19.7 6.4 20.5 7.2 20.4 8.5 L20.3 17.3 C20.3 18.6 19.5 19.3 18.3 19.3 H5.7 C4.5 19.3 3.7 18.6 3.7 17.3 Z" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinejoin="round" />
    <circle cx="12" cy="12.9" r="3.5" fill="none" stroke="currentColor" strokeWidth={1.9} />
    <circle cx="17.3" cy="9.1" r="0.9" fill="currentColor" />
  </>
);

/** Mando a mano, en una caja de 24. */
const GAMEPAD = (
  <>
    <path d="M7 7.6 C9.4 7.2 10.6 8.2 12 8.2 C13.4 8.2 14.6 7.2 17 7.6 C19.6 8 21 11.8 21.4 15 C21.7 17.4 20.4 18.6 18.8 17.8 C17.4 17.1 16.6 15.4 15.2 15 C13.8 14.7 10.2 14.7 8.8 15 C7.4 15.4 6.6 17.1 5.2 17.8 C3.6 18.6 2.3 17.4 2.6 15 C3 11.8 4.4 8 7 7.6 Z" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinejoin="round" />
    <path d="M7.4 10.2 V13.4 M5.8 11.8 H9" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" />
    <circle cx="15.6" cy="10.9" r="1" fill="currentColor" />
    <circle cx="17.5" cy="12.7" r="1" fill="currentColor" />
  </>
);

/**
 * La barra de arriba de todas las páginas, mínima. A la izquierda, las dos
 * secciones como botones redondos con su icono (cámara y mando), dibujados a mano:
 * caben uno al lado del otro también en un móvil estrecho y tienen el tamaño de un
 * dedo. La sección actual va rellena de tinta; la otra se rellena al pasar el
 * ratón. Cada uno lleva su nombre (para lectores de pantalla) y su rótulo al pasar
 * el ratón. En el centro "antonio10bc", que lleva a la home; a la derecha el
 * idioma (y la ciudad, en escritorio). En el móvil la fila va repartida en vez de
 * centrada: con el nombre largo, tres columnas iguales no caben a 320px.
 */
export default function TopBar({ lang, current, className = "" }: { lang: string; current?: "photography" | "games"; className?: string }) {
  const t = dictFor(lang);
  const sections = [
    { key: "photography", label: t.photoTitle, href: "/photography", icon: CAMERA },
    { key: "games", label: t.gamesTitle, href: "/projects", icon: GAMEPAD },
  ] as const;
  return (
    <header className={`flex shrink-0 items-center justify-between gap-2 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-3 ${className}`}>
      <nav aria-label={t.sections} className="flex items-center gap-1.5 md:gap-2.5">
        {sections.map((section) => {
          const active = section.key === current;
          return (
            <Link
              key={section.key}
              href={section.href}
              aria-label={section.label}
              aria-current={active ? "page" : undefined}
              title={section.label}
              className={`group relative grid h-10 w-10 shrink-0 place-items-center transition-colors duration-300 md:h-11 md:w-11
                          ${active ? "text-paper" : "text-ink hover:text-paper focus-visible:text-paper"}`}
            >
              <InkPill
                seed={`top-${section.key}`}
                fill
                width={2}
                className={active ? "[&_.ink-pill-fill]:opacity-100" : "group-hover:[&_.ink-pill-fill]:opacity-100 group-focus-visible:[&_.ink-pill-fill]:opacity-100"}
              />
              <svg aria-hidden viewBox="0 0 24 24" className="relative h-5 w-5 overflow-visible md:h-[22px] md:w-[22px]">
                {section.icon}
              </svg>
            </Link>
          );
        })}
      </nav>
      <Link href="/" className="hand-display wiggle min-w-0 text-[1.2rem] sm:text-[1.6rem] md:text-[1.9rem]">
        antonio10bc
      </Link>
      <div className="flex items-center justify-end gap-4">
        <LangSwitch lang={isLang(lang) ? lang : "en"} label={t.langLabel} />
        <span className="note hidden text-ink md:inline">Madrid, ES</span>
      </div>
    </header>
  );
}
