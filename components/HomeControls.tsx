"use client";

import { InkPill, ScribbleCircle } from "@/components/InkBox";
import { useSpell } from "@/components/SpellProvider";
import { DICTS } from "@/lib/i18n";
import type { Element } from "@/lib/spellbook";

/*
 * Los mandos de abajo de la home: las píldoras del centro (el minijuego y el
 * Instagram) y, a la derecha, las siete marcas de hechizo (cada una lo lanza al
 * momento contra la obra que flota). Fotografía y juegos no tienen píldora: ya
 * están en la barra de arriba y en la obra que flota.
 */

const pill =
  "group relative inline-flex h-9 shrink-0 items-center justify-center px-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink transition-colors duration-300 hover:text-paper focus-visible:text-paper md:h-10 md:px-6 md:text-xs";

function PillShape({ seed }: { seed: string }) {
  return <InkPill seed={seed} fill className="group-hover:[&_.ink-pill-fill]:opacity-100 group-focus-visible:[&_.ink-pill-fill]:opacity-100" />;
}

export function SpellPills({ instagram }: { instagram: string }) {
  const { lang, start } = useSpell();
  const t = DICTS[lang];
  return (
    <nav aria-label={t.sections} className="flex flex-wrap justify-center gap-x-2.5 gap-y-2">
      <button type="button" onClick={start} className={pill}>
        <PillShape seed="pill-spell" />
        <span className="relative">{t.castSpell}</span>
      </button>
      <a href={instagram} target="_blank" rel="noopener noreferrer" data-track="instagram_clicked" className={pill}>
        <PillShape seed="pill-hi" />
        <span className="relative">{t.sayHi}</span>
      </a>
    </nav>
  );
}

/** Las marcas de cada hechizo, dibujadas a mano en una caja de 24. */
const MARKS: Record<Element, React.ReactNode> = {
  fire: (
    <>
      <path d="M12 2.4 C13.4 6 16.6 8 17.2 12.2 C18.6 11 18.8 9.6 18.4 8.4 C21 11.2 21 15.8 18.8 18.6 C17 20.9 14.6 21.9 12 21.9 C8.6 21.9 5.4 19.6 5.4 15.6 C5.4 12.4 7.4 10.6 8.4 8.6 C9 10.6 10 11.4 10.8 11.6 C10.4 8.4 11 5.4 12 2.4 Z" fill="#fff" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
      <path d="M12 12.4 C14 14.6 15 16.8 13.6 19 C12.8 20.2 10.6 20.2 10 18.8 C9.4 17 10.8 15.2 12 12.4 Z" fill="currentColor" />
    </>
  ),
  water: (
    <>
      <path d="M12 2.6 C15.4 7.8 18.4 11.6 18.4 15.4 C18.4 19 15.6 21.6 12 21.6 C8.4 21.6 5.6 19 5.6 15.4 C5.6 11.6 8.6 7.8 12 2.6 Z" fill="#fff" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
      <path d="M9.2 15.6 C9.4 17.4 10.6 18.6 12.2 18.8" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
    </>
  ),
  wind: (
    <path d="M2.6 9 H14 C17.2 9 18.2 5.8 16.2 4.4 C14.4 3.4 12.6 5 13.2 6.6 M2.6 14 H19 C21.8 14 22.2 17.8 19.6 18.2 C18 18.4 17 17 17.6 15.8 M2.6 19 H10" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  ),
  earth: (
    <>
      <path d="M3.6 18.4 L6.8 10.2 L12 7 L18.2 9.2 L21 16.4 L16.4 20.4 L8 20.8 Z" fill="currentColor" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M9 11.4 L11.8 10.2" fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
    </>
  ),
  lightning: <path d="M13.4 2.4 L6.4 13.2 H11.2 L9.2 21.8 L18 9.4 H13 L15.4 2.4 Z" fill="currentColor" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />,
  ice: (
    <path d="M12 3 V21 M4.2 7.5 L19.8 16.5 M4.2 16.5 L19.8 7.5 M9.6 4.6 L12 7 L14.4 4.6 M9.6 19.4 L12 17 L14.4 19.4" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
  ),
  light: (
    <>
      <circle cx="12" cy="12" r="4.2" fill="#fff" stroke="currentColor" strokeWidth={2} />
      <path d="M12 2.6 V5.4 M12 18.6 V21.4 M2.6 12 H5.4 M18.6 12 H21.4 M5.4 5.4 L7.3 7.3 M16.7 16.7 L18.6 18.6 M5.4 18.6 L7.3 16.7 M16.7 7.3 L18.6 5.4" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" />
    </>
  ),
};

const ORDER: Element[] = ["fire", "water", "wind", "earth", "lightning", "ice", "light"];

export function SpellMarks() {
  const { lang, castFree, lastCast, castCount } = useSpell();
  const t = DICTS[lang];
  return (
    <div className="flex items-center">
      <div role="group" aria-label={t.spellsLabel} className="flex items-center gap-2.5 md:gap-3">
        {ORDER.map((element) => (
          <button
            key={element}
            type="button"
            aria-label={t.elementNames[element]}
            title={t.elementNames[element]}
            onClick={() => castFree(element)}
            className="group relative grid h-8 w-8 place-items-center text-ink transition-transform duration-300 ease-spring hover:-translate-y-1 md:h-9 md:w-9"
          >
            {lastCast === element && <ScribbleCircle key={`${element}-${castCount}`} seed={`mark-${element}`} width={2} draw className="!-inset-0.5 !h-[calc(100%+4px)] !w-[calc(100%+4px)]" />}
            <svg aria-hidden viewBox="0 0 24 24" className="h-[22px] w-[22px] overflow-visible">
              {MARKS[element]}
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
