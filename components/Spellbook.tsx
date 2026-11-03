"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Wizard } from "@/components/Ink";
import { Scribble } from "@/components/InkBox";
import { track } from "@/lib/analytics";
import { DICTS, type Lang } from "@/lib/i18n";
import { matches, NAME, type Point } from "@/lib/spellbook";
import { confetti, INK, projectile, puff, spell, type Effect, type Vec } from "@/lib/spells";

/*
 * Minijuego secreto: se abre al pulsar el mago de la home. A pantalla completa,
 * sobre papel, se dibuja con el dedo o el ratón cada letra de "antonio"; si se
 * parece a la que toca (lib/spellbook.ts), el mago levanta la varita y lanza su
 * hechizo (lib/spells.ts) al sitio donde se dibujó. Si no, niega con la cabeza y
 * la letra se deshace en humo. Tras la última "o", fiesta de cruces.
 *
 * Todo lo que se mueve en el canvas va en un único bucle de requestAnimationFrame
 * mientras el juego está abierto; el mago es el mismo SVG de la home, con su
 * balanceo, su parpadeo y las clases `wizard-cast` / `wizard-shake` (globals.css).
 */

/** Pausa tras el último trazo antes de leer la letra: deja dibujar la barra de la "t" o el punto de la "i". */
const READ_DELAY = 650;
const MAX_DPR = 2;

type Status = "drawing" | "casting" | "done";

export default function Spellbook({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const t = DICTS[lang];
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("drawing");
  const [message, setMessage] = useState(t.spellIntro);
  const [pose, setPose] = useState<"" | "wizard-cast" | "wizard-shake">("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wizardRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Estado del bucle: refs, para no re-renderizar React en cada trazo.
  const strokes = useRef<Point[]>([]);
  const fading = useRef<{ points: Point[]; life: number; shake: boolean }[]>([]);
  const effects = useRef<Effect[]>([]);
  /*
   * Efectos nuevos: entran en el siguiente fotograma. No se meten directamente en
   * `effects` porque el proyectil lanza su hechizo desde dentro de `update`, que
   * corre mientras el bucle filtra esa lista, y `filter` no ve lo añadido a mitad:
   * el hechizo se perdía y solo se veía el rayo (que sale de un setTimeout).
   */
  const queued = useRef<Effect[]>([]);
  const add = useCallback((e: Effect) => queued.current.push(e), []);
  const strokeId = useRef(0);
  const drawing = useRef(false);
  const readTimer = useRef<number | null>(null);
  const stepRef = useRef(0);
  const statusRef = useRef<Status>("drawing");
  const celebration = useRef<ReturnType<typeof confetti> | null>(null);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const strike = useCallback((next: typeof pose, ms: number) => {
    setPose(next);
    window.setTimeout(() => setPose(""), ms);
  }, []);

  /** Punta de la varita en coordenadas de pantalla (el SVG del mago se encuadra con márgenes). */
  const wandTip = useCallback((): Vec => {
    const svg = wizardRef.current?.querySelector("svg");
    if (!svg) return { x: window.innerWidth * 0.7, y: window.innerHeight * 0.75 };
    const r = svg.getBoundingClientRect();
    const scale = Math.min(r.width / 240, r.height / 290);
    return { x: r.left + (r.width - 240 * scale) / 2 + 8 * scale, y: r.top + (r.height - 290 * scale) / 2 + 180 * scale };
  }, []);

  /** Lee lo dibujado y lanza el hechizo o el humo. */
  const read = useCallback(() => {
    readTimer.current = null;
    const points = strokes.current;
    strokes.current = [];
    if (points.length < 2) return;
    const box = points.reduce(
      (b, p) => ({ minX: Math.min(b.minX, p.x), maxX: Math.max(b.maxX, p.x), minY: Math.min(b.minY, p.y), maxY: Math.max(b.maxY, p.y) }),
      { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
    );
    const at = { x: (box.minX + box.maxX) / 2, y: (box.minY + box.maxY) / 2 };
    const current = stepRef.current;
    const { letter, element } = NAME[current];

    if (!matches(points, letter).ok) {
      fading.current.push({ points, life: 1, shake: true });
      add(puff(at));
      strike("wizard-shake", 600);
      setMessage(t.notThat(letter));
      track("minigame_missed", { letter, position: current + 1 });
      return;
    }

    fading.current.push({ points, life: 1, shake: false });
    setStatus("casting");
    strike("wizard-cast", 750);
    setMessage(t.elements[element]);
    const cast = () => add(spell(element, at, window.innerHeight));
    // El rayo cae del cielo; lo demás sale de la varita.
    if (element === "lightning") window.setTimeout(cast, 180);
    else add(projectile(wandTip(), at, cast));

    const last = current === NAME.length - 1;
    window.setTimeout(
      () => {
        setStep(current + 1);
        if (last) {
          setStatus("done");
          celebration.current = confetti(window.innerWidth);
          add(celebration.current);
          track("minigame_completed");
        } else {
          setStatus("drawing");
          setMessage(t.drawLetter(NAME[current + 1].letter));
        }
      },
      last ? 2200 : 1500,
    );
  }, [add, strike, t, wandTip]);

  // Canvas a pantalla completa con su densidad de píxeles, y el bucle de dibujo.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let last = performance.now();
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const ink = (points: Point[], dx = 0) => {
      ctx.strokeStyle = INK;
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      points.forEach((p, i) => {
        const prev = points[i - 1];
        if (!prev || prev.stroke !== p.stroke) {
          ctx.moveTo(p.x + dx, p.y);
          ctx.lineTo(p.x + dx + 0.01, p.y); // un toque suelto (el punto de la "i") también se ve
        } else {
          ctx.lineTo(p.x + dx, p.y);
        }
      });
      ctx.stroke();
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      effects.current = [...effects.current.filter((e) => e.update(dt)), ...queued.current.splice(0)];
      fading.current = fading.current.filter((f) => (f.life -= dt * 2.2) > 0);
      const shake = Math.max(0, ...effects.current.map((e) => e.shake ?? 0));

      ctx.save();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (shake > 0) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
      fading.current.forEach((f) => {
        ctx.globalAlpha = f.life;
        ink(f.points, f.shake ? Math.sin(f.life * 40) * 8 * f.life : 0);
      });
      ctx.globalAlpha = 1;
      ink(strokes.current);
      effects.current.forEach((e) => e.draw(ctx));
      ctx.restore();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Teclado, scroll del fondo y foco: como el visor de fotos.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      if (readTimer.current) window.clearTimeout(readTimer.current);
      celebration.current?.stop();
    };
  }, [onClose]);

  const point = (e: React.PointerEvent | PointerEvent): Point => ({ x: e.clientX, y: e.clientY, stroke: strokeId.current });

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (statusRef.current !== "drawing") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    if (readTimer.current) window.clearTimeout(readTimer.current);
    drawing.current = true;
    strokeId.current += 1;
    strokes.current.push(point(e));
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    // Los eventos agrupados dan un trazo suave aunque el navegador junte movimientos.
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent];
    events.forEach((ev) => strokes.current.push(point(ev)));
  };
  const onPointerUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    readTimer.current = window.setTimeout(read, READ_DELAY);
  };

  const restart = () => {
    celebration.current?.stop();
    celebration.current = null;
    setStep(0);
    setStatus("drawing");
    setMessage(t.drawLetter(NAME[0].letter));
  };

  const current = NAME[Math.min(step, NAME.length - 1)];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.spellbook}
      className="animate-fade-in fixed inset-0 z-50 touch-none select-none overflow-hidden overscroll-none bg-paper text-ink"
    >
      {/* La letra que toca, enorme y casi invisible: se puede calcar. */}
      {status !== "done" && (
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span key={step} className="hand-display animate-fade-in text-[min(56vw,52vh)] text-ink/5">
            {current.letter}
          </span>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full cursor-crosshair"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />

      {/* El nombre: las letras hechas en tinta, la que toca subrayada, las demás en lápiz. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 px-5 pt-5 md:px-10 md:pt-8">
        <div>
          <span className="note text-ink">{t.spellbook}</span>
          <div className="mt-1 flex gap-[clamp(0.25rem,1.5vw,1rem)]" aria-label="antonio">
            {NAME.map((n, i) => (
              <span key={i} className="relative flex flex-col items-center">
                <span
                  className={`hand-display text-[clamp(2.25rem,7vw,4.75rem)] transition-colors duration-500 ${
                    i < step ? "text-ink" : i === step && status !== "done" ? "text-ink" : "text-ink/15"
                  }`}
                >
                  {n.letter}
                </span>
                {i === step && status !== "done" && (
                  // Absoluto: un SVG aún sin medir ocupa 300px y ensancharía la columna de la letra.
                  <Scribble key={`u-${step}`} seed={`spell-${i}`} width={3} draw className="absolute -bottom-1.5 left-0 h-2.5 w-full" />
                )}
                {i < step && <span className="note mt-0.5 hidden whitespace-nowrap text-[11px] md:block">{t.elements[n.element]}</span>}
              </span>
            ))}
          </div>
          <p aria-live="polite" className="hand mt-3 max-w-xs md:max-w-md">
            {message}
          </p>
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="pointer-events-auto -mr-2 -mt-1 p-2 text-ink transition-transform duration-300 hover:rotate-90"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 overflow-visible" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
            <path d="M4.5 5.5 C9 10 14 15 19.5 18.5 M18.5 4.5 C14 9.5 9.5 14 5 19.5" />
          </svg>
        </button>
      </div>

      {/* El mago, abajo a la derecha, apuntando con la varita hacia el papel. */}
      <div
        ref={wizardRef}
        className={`pointer-events-none absolute bottom-[max(1rem,env(safe-area-inset-bottom))] right-[4%] aspect-[240/290] h-[min(30vh,19rem)] ${pose}`}
      >
        <Wizard id="spellbook" title={t.wizardAlt} className="wizard-idle origin-bottom animate-bob" />
      </div>

      {status === "done" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="hand-display wiggle animate-pop text-[clamp(4.5rem,18vw,12rem)]">antonio</p>
          <Scribble seed="spell-done" width={4} draw delay={0.3} className="h-4 w-[min(80vw,34rem)]" />
          <p className="hand text-mute md:text-lg">{t.spellDone}</p>
          <div className="mt-2 flex items-center gap-8">
            <button type="button" onClick={restart} className="hand-display text-[1.75rem] underline decoration-wavy decoration-2 underline-offset-8">
              {t.again}
            </button>
            <button type="button" onClick={onClose} className="hand-display text-[1.75rem] text-mute">
              {t.close.toLowerCase()}
            </button>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
