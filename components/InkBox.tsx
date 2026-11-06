"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { roughEllipse, roughPill, roughRect, roughUnderline } from "@/lib/ink";

/*
 * Las formas a mano que se estiran con su caja: marco, círculo y subrayado. Miden
 * su propio tamaño (ResizeObserver) y dibujan el trazo en píxeles reales, sin
 * escalar: el grosor es el mismo en una foto grande que en un enlace, y el guion de
 * pathLength="1" que los "dibuja" (globals.css) coincide con lo que se ve. Hasta
 * medirse (el HTML del servidor) el SVG va vacío: son decoración.
 */

type Drawn = {
  /** Se dibuja al montarse, con este retraso en segundos. */
  draw?: boolean;
  delay?: number;
  /** Se dibuja con el scroll (un antepasado debe llevar `ink-host`). */
  scroll?: boolean;
  /** Solo se ve al pasar el ratón por su `.group` (o con el foco de teclado). */
  hover?: boolean;
  /** Grosor del trazo en px. */
  width?: number;
  className?: string;
  style?: CSSProperties;
};

function useBox() {
  const ref = useRef<SVGSVGElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox((prev) =>
        prev && Math.abs(prev.w - width) < 1 && Math.abs(prev.h - height) < 1 ? prev : { w: width, h: height },
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, box] as const;
}

function Stroke({
  shape,
  seed,
  draw,
  delay = 0,
  scroll,
  hover,
  width = 2.6,
  className = "",
  style,
}: Drawn & { shape: (seed: string, w: number, h: number) => string; seed: string }) {
  const [ref, box] = useBox();
  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox={box ? `0 0 ${box.w} ${box.h}` : undefined}
      // min-w-0: sin viewBox (antes de medir) un SVG mide 300px por defecto y, en
      // una fila flex, no encogería por debajo de eso.
      className={`pointer-events-none min-w-0 overflow-visible ${className}`}
      style={style}
    >
      {box && box.w > 0 && box.h > 0 && (
        <path
          d={shape(seed, box.w, box.h)}
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`ink-line ${draw ? "ink-draw" : ""} ${scroll ? "ink-scroll" : ""} ${hover ? "ink-hover" : ""}`}
          style={draw ? ({ "--d": `${delay}s` } as CSSProperties) : undefined}
        />
      )}
    </svg>
  );
}

/** Marco a mano alrededor del padre (que debe ser `relative`), `outset` px por fuera. */
export function InkFrame({ seed, outset = 7, className = "", ...drawn }: Drawn & { seed: string; outset?: number }) {
  return (
    <Stroke
      shape={roughRect}
      seed={seed}
      {...drawn}
      className={`absolute ${className}`}
      style={{ inset: -outset, width: `calc(100% + ${outset * 2}px)`, height: `calc(100% + ${outset * 2}px)` }}
    />
  );
}

/** Círculo a mano encima del padre (`relative`), algo más grande que él. */
export function ScribbleCircle({ seed, className = "", ...drawn }: Drawn & { seed: string }) {
  return (
    <Stroke
      shape={roughEllipse}
      seed={seed}
      {...drawn}
      className={`absolute -inset-x-4 -inset-y-3 h-[calc(100%+1.5rem)] w-[calc(100%+2rem)] ${className}`}
    />
  );
}

/** Subrayado a mano; su tamaño lo da `className` (ancho y alto). */
export function Scribble({ seed, width = 3.4, className = "", ...drawn }: Drawn & { seed: string }) {
  return <Stroke shape={roughUnderline} seed={seed} width={width} {...drawn} className={`block ${className}`} />;
}

/**
 * Contorno de píldora a mano, encima del padre (`relative`). Con `fill`, debajo va
 * la misma forma rellena de tinta, apagada; el padre la enciende al pasar el
 * ratón (`group-hover:[&_.ink-pill-fill]:opacity-100`).
 */
export function InkPill({ seed, fill = false, width = 2.2, className = "" }: { seed: string; fill?: boolean; width?: number; className?: string }) {
  const [ref, box] = useBox();
  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox={box ? `0 0 ${box.w} ${box.h}` : undefined}
      // Siempre en tinta: el botón que la lleva cambia su color a papel al activarse
      // (para invertir el texto o el icono), y en `currentColor` la píldora se
      // pintaba en blanco sobre blanco y desaparecía.
      className={`pointer-events-none absolute inset-0 h-full w-full min-w-0 overflow-visible text-ink ${className}`}
    >
      {box && box.w > 0 && (
        <>
          {fill && <path d={roughPill(seed, box.w, box.h)} fill="currentColor" stroke="none" className="ink-pill-fill opacity-0 transition-opacity duration-300" />}
          <path d={roughPill(seed, box.w, box.h)} fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}
