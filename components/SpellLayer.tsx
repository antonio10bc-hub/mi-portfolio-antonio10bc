"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSpell } from "@/components/SpellProvider";
import { track } from "@/lib/analytics";
import { DICTS } from "@/lib/i18n";
import { matches, NAME, type Element, type Point } from "@/lib/spellbook";
import { confetti, INK, projectile, puff, spell, type Effect, type Vec } from "@/lib/spells";

/*
 * La capa de los hechizos (ver SpellProvider): un canvas transparente a pantalla
 * completa encima de la home. Dos modos:
 *  - Suelto: solo pinta los hechizos de las marcas de abajo, de la varita a la obra
 *    que flota; no recoge el puntero, la página se sigue usando.
 *  - Minijuego (`active`): recoge el trazo, enseña la letra guía y la X, bloquea el
 *    scroll y lee cada letra.
 * El mago es el de la home: la varita sale de su SVG y las poses van en su
 * envoltorio (`wizardRef`). Todo lo que se mueve va en un único bucle de
 * requestAnimationFrame mientras la capa está montada.
 */

/** Pausa tras el último trazo antes de leer la letra: deja dibujar la barra de la "t" o el punto de la "i". */
const READ_DELAY = 650;
const MAX_DPR = 2;

export default function SpellLayer({ pendingRef }: { pendingRef: React.RefObject<Element | null> }) {
  const { lang, active, step, status, setStep, setStatus, setMessage, strike, stop, wizardRef, targetRef, castRef, lineWidth } = useSpell();
  const t = DICTS[lang];
  const onClose = stop;

  const canvasRef = useRef<HTMLCanvasElement>(null);
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
  const statusRef = useRef(status);
  const celebration = useRef<ReturnType<typeof confetti> | null>(null);
  const width = useRef(lineWidth);
  useEffect(() => {
    width.current = lineWidth;
  }, [lineWidth]);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  /** Punta de la varita en coordenadas de pantalla (el SVG del mago se encuadra con márgenes). */
  const wandTip = useCallback((): Vec => {
    const svg = wizardRef.current?.querySelector("svg");
    if (!svg) return { x: window.innerWidth * 0.7, y: window.innerHeight * 0.75 };
    const r = svg.getBoundingClientRect();
    const scale = Math.min(r.width / 240, r.height / 290);
    return { x: r.left + (r.width - 240 * scale) / 2 + 8 * scale, y: r.top + (r.height - 290 * scale) / 2 + 180 * scale };
  }, [wizardRef]);

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
  }, [add, setMessage, setStatus, setStep, strike, t, wandTip]);

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
      ctx.lineWidth = width.current;
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

  // "Otra vez" (en el lema) devuelve el paso a 0: se acaba la lluvia de cruces.
  useEffect(() => {
    if (step === 0) {
      celebration.current?.stop();
      celebration.current = null;
    }
  }, [step]);

  // Hechizo suelto: de la varita al centro de la obra que flota. Se registra en el
  // proveedor y lanza el que estuviera esperando a que la capa se montara.
  useEffect(() => {
    const cast = (element: Element) => {
      const box = targetRef.current?.getBoundingClientRect();
      const at = box ? { x: box.left + box.width / 2, y: box.top + box.height / 2 } : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      strike("wizard-cast", 750);
      const hit = () => add(spell(element, at, window.innerHeight));
      if (element === "lightning") window.setTimeout(hit, 180);
      else add(projectile(wandTip(), at, hit));
    };
    castRef.current = cast;
    if (pendingRef.current) {
      cast(pendingRef.current);
      pendingRef.current = null;
    }
    return () => {
      castRef.current = null;
    };
  }, [add, castRef, pendingRef, strike, targetRef, wandTip]);

  // Teclado, scroll del fondo y foco: solo en el minijuego.
  useEffect(() => {
    if (!active) return;
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
      celebration.current = null;
      strokes.current = [];
    };
  }, [active, onClose]);

  const point = (e: React.PointerEvent | PointerEvent): Point => ({ x: e.clientX, y: e.clientY, stroke: strokeId.current });

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!active || statusRef.current !== "drawing") return;
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

  const current = NAME[Math.min(step, NAME.length - 1)];

  return createPortal(
    // El contenedor no recoge el puntero: solo el canvas (mientras se dibuja) y la X.
    <div className="pointer-events-none fixed inset-0 z-40 select-none">
      {/* La letra que toca, enorme y casi invisible, en el centro: se puede calcar. */}
      {active && status !== "done" && (
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span key={step} className="hand-display animate-fade-in text-[min(56vw,52vh)] text-ink/5">
            {current.letter}
          </span>
        </div>
      )}

      {/* Al terminar deja de recoger el puntero: así se puede pulsar "otra vez" o "cerrar" en el lema. */}
      <canvas
        ref={canvasRef}
        aria-label={t.spellIntro}
        className={`absolute inset-0 h-full w-full touch-none ${active && status !== "done" ? "pointer-events-auto cursor-crosshair" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />

      {active && (
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="pointer-events-auto absolute right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] p-2 text-ink transition-transform duration-300 hover:rotate-90 md:right-8 md:top-6"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 overflow-visible" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
            <path d="M4.5 5.5 C9 10 14 15 19.5 18.5 M18.5 4.5 C14 9.5 9.5 14 5 19.5" />
          </svg>
        </button>
      )}
    </div>,
    document.body,
  );
}
