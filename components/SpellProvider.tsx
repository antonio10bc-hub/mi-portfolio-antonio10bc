"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { DICTS, type Lang } from "@/lib/i18n";
import { NAME, type Element } from "@/lib/spellbook";

/*
 * La magia de la home, sin pantallas aparte. Dos maneras de lanzar:
 *  - Hechizo suelto: cualquiera de las siete marcas de abajo a la derecha hace que
 *    el mago lo lance al momento contra la obra que flota en el centro.
 *  - El minijuego (al pulsar el mago o "lanza un hechizo"): la home entra en modo
 *    hechizo, se dibujan las letras de "antonio" sobre la propia página y cada una
 *    lanza el suyo. La frase de la escena pasa a ser el marcador y los mensajes.
 * Las dos pintan en SpellLayer, una capa de canvas que solo se descarga cuando
 * hace falta y se retira sola cuando no queda nada que pintar.
 */

const SpellLayer = dynamic(() => import("@/components/SpellLayer"), { ssr: false });

export type SpellStatus = "drawing" | "casting" | "done";
export type Pose = "" | "wizard-cast" | "wizard-shake";

type SpellState = {
  lang: Lang;
  /** El minijuego está en marcha. */
  active: boolean;
  step: number;
  status: SpellStatus;
  message: string;
  pose: Pose;
  /** El último hechizo suelto, para marcarlo en su botón, y cuántos van (para volver a dibujar la marca). */
  lastCast: Element | null;
  castCount: number;
  /** El envoltorio del mago: de ahí sale la punta de la varita y ahí van las poses. */
  wizardRef: React.RefObject<HTMLDivElement | null>;
  /** La obra que flota en el centro: allí van los hechizos sueltos. */
  targetRef: React.RefObject<HTMLAnchorElement | null>;
  /** La capa registra aquí cómo lanzar un hechizo suelto. */
  castRef: React.RefObject<((element: Element) => void) | null>;
  start: () => void;
  stop: () => void;
  restart: () => void;
  castFree: (element: Element) => void;
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

/** Tras el último hechizo suelto, cuánto espera la capa antes de retirarse. */
const LAYER_IDLE = 4000;

export function SpellProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const t = DICTS[lang];
  const [active, setActive] = useState(false);
  const [layerOn, setLayerOn] = useState(false);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<SpellStatus>("drawing");
  const [message, setMessage] = useState("");
  const [pose, setPose] = useState<Pose>("");
  const [lastCast, setLastCast] = useState<Element | null>(null);
  const [castCount, setCastCount] = useState(0);
  const wizardRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLAnchorElement>(null);
  const castRef = useRef<((element: Element) => void) | null>(null);
  const pending = useRef<Element | null>(null);
  const idle = useRef<number | null>(null);

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
    setLayerOn(true);
  }, [active, t]);

  const stop = useCallback(() => {
    setActive(false);
    setPose("");
  }, []);

  const castFree = useCallback((element: Element) => {
    track("spell_cast", { element });
    setLastCast(element);
    setCastCount((n) => n + 1);
    if (idle.current) window.clearTimeout(idle.current);
    if (castRef.current) castRef.current(element);
    else {
      // La capa aún no está montada: lanza en cuanto lo esté.
      pending.current = element;
      setLayerOn(true);
    }
  }, []);

  // La capa se retira sola cuando ni hay juego ni hechizos sueltos recientes.
  useEffect(() => {
    if (active || !layerOn) return;
    idle.current = window.setTimeout(() => setLayerOn(false), LAYER_IDLE);
    return () => {
      if (idle.current) window.clearTimeout(idle.current);
    };
  }, [active, layerOn, lastCast]);

  const value = useMemo(
    () => ({
      lang, active, step, status, message, pose, lastCast, castCount,
      wizardRef, targetRef, castRef, start, stop, restart, castFree, setStep, setStatus, setMessage, strike,
    }),
    [lang, active, step, status, message, pose, lastCast, castCount, start, stop, restart, castFree, strike],
  );

  return (
    <SpellContext.Provider value={value}>
      {children}
      {layerOn && <SpellLayer pendingRef={pending} />}
    </SpellContext.Provider>
  );
}

/**
 * La frase de la escena, a mano y en mayúsculas, en dos líneas escalonadas. En el
 * minijuego deja su sitio al marcador ("antonio": las letras acertadas en tinta,
 * la que toca subrayada, las demás en lápiz) y a los mensajes, con "otra vez" y
 * "cerrar" al terminar.
 */
export function SpellCaption({ className = "" }: { className?: string }) {
  const { active, step, status, message, restart, stop, lang } = useSpell();
  const t = DICTS[lang];
  if (!active) {
    return (
      <h1 className={`hand-caption ${className}`}>
        <span className="block">{t.homeSentence[0]}</span>
        <span className="block pl-[clamp(1.5rem,6vw,6rem)]">{t.homeSentence[1]}</span>
      </h1>
    );
  }
  return (
    <div className={className}>
      <p className="hand-display flex gap-[clamp(0.15rem,1vw,0.6rem)] text-[clamp(2.5rem,min(7vw,9vh),5rem)]" aria-label="antonio">
        {NAME.map((n, i) => {
          const done = i < step || status === "done";
          const current = i === step && status !== "done";
          return (
            <span
              key={i}
              className={`transition-colors duration-500 ${done ? "text-ink" : current ? "text-ink underline decoration-wavy decoration-[0.06em] underline-offset-[0.12em]" : "text-ink/15"}`}
            >
              {n.letter}
            </span>
          );
        })}
      </p>
      <p aria-live="polite" className="hand mt-2 md:text-lg">
        {status === "done" ? t.spellDone : message}
        {status === "done" && (
          <span className="ml-3 inline-flex gap-4 align-baseline">
            <button type="button" onClick={restart} className="font-bold underline decoration-wavy decoration-2 underline-offset-4">
              {t.again}
            </button>
            <button type="button" onClick={stop} className="font-bold text-mute">
              {t.close.toLowerCase()}
            </button>
          </span>
        )}
      </p>
    </div>
  );
}
