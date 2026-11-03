"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { Wizard } from "@/components/Ink";
import { track } from "@/lib/analytics";
import { DICTS, type Lang } from "@/lib/i18n";

// El minijuego solo se descarga si alguien pulsa el mago.
const Spellbook = dynamic(() => import("@/components/Spellbook"), { ssr: false });

/**
 * El mago de la home, que es también la puerta del minijuego secreto: pulsarlo
 * abre el libro de hechizos. Nada lo anuncia (es un secreto), pero es un botón de
 * verdad: tiene nombre accesible, se alcanza con el teclado y da un saltito al
 * pasar el ratón.
 */
export default function WizardButton({ lang }: { lang: Lang }) {
  const t = DICTS[lang];
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button
        type="button"
        aria-label={t.secretLabel}
        onClick={() => {
          track("minigame_opened");
          setOpen(true);
        }}
        className="absolute inset-0 cursor-pointer transition-transform duration-500 ease-spring hover:-translate-y-2"
      >
        <Wizard hint={t.homeHint} className="wizard-idle origin-bottom animate-bob" />
      </button>
      {open && <Spellbook lang={lang} onClose={close} />}
    </>
  );
}
