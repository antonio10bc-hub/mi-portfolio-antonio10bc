"use client";

import { Wizard } from "@/components/Ink";
import { useSpell } from "@/components/SpellProvider";
import { DICTS } from "@/lib/i18n";

/**
 * El mago de la home, que es también la puerta del minijuego secreto: pulsarlo
 * pone la propia home en modo hechizo (SpellProvider), sin pantalla aparte, y el
 * mago pasa de estar quieto a lanzar. Nada lo anuncia (es un secreto), pero es un
 * botón de verdad: tiene nombre accesible, se alcanza con el teclado y da un
 * saltito al pasar el ratón. Su envoltorio recibe las poses (lanzar, negar).
 */
export default function WizardButton() {
  const { lang, active, start, pose, wizardRef } = useSpell();
  const t = DICTS[lang];
  return (
    <div ref={wizardRef} className={`absolute inset-0 ${pose}`}>
      <button
        type="button"
        aria-label={t.secretLabel}
        aria-pressed={active}
        onClick={start}
        className="absolute inset-0 cursor-pointer transition-transform duration-500 ease-spring hover:-translate-y-2"
      >
        <Wizard hint={active ? undefined : t.homeHint} className="wizard-idle origin-bottom animate-bob" />
      </button>
    </div>
  );
}
