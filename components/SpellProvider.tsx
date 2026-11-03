"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { DICTS, type Lang } from "@/lib/i18n";
import { NAME } from "@/lib/spellbook";

/*
 * El minijuego secreto, dentro de la propia home: no hay pantalla aparte. Al pulsar
 * el mago la home entra en "modo hechizo": encima se pone una capa transparente
 * para dibujar (SpellLayer, que solo se descarga entonces), el título "antonio"
 * pasa a ser el marcador (sus letras se apagan y se vuelven a entintar al
 * acertarlas) y el lema de debajo, los mensajes del juego. El mago lanza desde
 * donde está. Este contexto es lo que comparten esas piezas.
 */

const SpellLayer = dynamic(() => import("@/components/SpellLayer"), { ssr: false });

export type SpellStatus = "drawing" | "casting" | "done";
export type Pose = "" | "wizard-cast" | "wizard-shake";

type SpellState = {
  lang: Lang;
  active: boolean;
  step: number;
  status: SpellStatus;
  message: string;
  pose: Pose;
  /** El envoltorio del mago: de ahí sale la punta de la varita y ahí van las poses. */
  wizardRef: React.RefObject<HTMLDivElement | null>;
  start: () => void;
  stop: () => void;
  restart: () => void;
  setStep: (n: number) => void;
  setStatus: (s: SpellStatus) => void;
  setMessage: (m: string) => void;
  strike: (pose: Pose, ms: number) => void;
};

const SpellContext = createContext<SpellState | null>(null);

export function useSpell() {
  const value = useContext(SpellContext);
  if (!value) throw new Error("useSpell fuera de SpellProvider");
  return value;
}

export function SpellProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const t = DICTS[lang];
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<SpellStatus>("drawing");
  const [message, setMessage] = useState("");
  const [pose, setPose] = useState<Pose>("");
  const wizardRef = useRef<HTMLDivElement>(null);

  const strike = useCallback((next: Pose, ms: number) => {
    setPose(next);
    window.setTimeout(() => setPose(""), ms);
  }, []);

  const restart = useCallback(() => {
    setStep(0);
    setStatus("drawing");
    setMessage(t.drawLetter(NAME[0].letter));
  }, [t]);

  const start = useCallback(() => {
    if (active) return;
    track("minigame_opened");
    setStep(0);
    setStatus("drawing");
    setMessage(t.spellIntro);
    setActive(true);
  }, [active, t]);

  const stop = useCallback(() => {
    setActive(false);
    setPose("");
  }, []);

  const value = useMemo(
    () => ({ lang, active, step, status, message, pose, wizardRef, start, stop, restart, setStep, setStatus, setMessage, strike }),
    [lang, active, step, status, message, pose, start, stop, restart, strike],
  );

  return (
    <SpellContext.Provider value={value}>
      {children}
      {active && <SpellLayer />}
    </SpellContext.Provider>
  );
}

/**
 * El título de la home. Fuera del juego es "antonio" y nada más. Dentro, es el
 * marcador: las letras acertadas en tinta, la que toca subrayada y las demás en
 * lápiz muy claro.
 */
export function SpellName({ className = "" }: { className?: string }) {
  const { active, step, status } = useSpell();
  return (
    <h1 className={`hand-display wiggle ${className}`}>
      {NAME.map((n, i) => {
        const done = !active || i < step || status === "done";
        const current = active && i === step && status !== "done";
        return (
          <span
            key={i}
            className={`transition-colors duration-500 ${done ? "text-ink" : current ? "text-ink underline decoration-wavy decoration-[0.06em] underline-offset-[0.12em]" : "text-ink/15"}`}
          >
            {n.letter}
          </span>
        );
      })}
    </h1>
  );
}

/** El lema de la home; en modo hechizo, los mensajes del juego (y al final, "otra vez" / "cerrar"). */
export function SpellTagline({ text, className = "" }: { text: string; className?: string }) {
  const { active, message, status, restart, stop, lang } = useSpell();
  const t = DICTS[lang];
  if (!active) return <p className={className}>{text}</p>;
  return (
    <p aria-live="polite" className={`${className} !text-ink`}>
      {status === "done" ? t.spellDone : message}
      {status === "done" && (
        <span className="ml-3 inline-flex gap-4 align-baseline">
          <button type="button" onClick={restart} className="relative z-50 font-bold underline decoration-wavy decoration-2 underline-offset-4">
            {t.again}
          </button>
          <button type="button" onClick={stop} className="relative z-50 font-bold text-mute">
            {t.close.toLowerCase()}
          </button>
        </span>
      )}
    </p>
  );
}
