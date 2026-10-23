"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";

/*
 * El árbol de la home, vivo. En vez de la imagen fija se trama en cada fotograma
 * a partir de la foto en grises (tree-src.png, 287x203: el mismo recorte, niveles
 * y fundido que tree.png, un píxel por punto). Con la misma matriz de semitono que
 * ImageMagick (h4x4a) y el mismo desfase de recorte, el fotograma en reposo es
 * idéntico punto por punto a tree.png, así que el relevo no se nota.
 *
 * Tres capas:
 *  - Crecimiento: la primera vez en la sesión el árbol brota desde la base del
 *    tronco. Un frente de borde irregular avanza por la copa y, donde pasa, la tinta
 *    sube de tono poco a poco; como se vuelve a tramar, los puntos aparecen de los
 *    grises claros a los oscuros, como tinta que florece en el papel. A la vez, unas
 *    chispas de savia suben por el tronco en curvas y llegan a cada zona justo
 *    cuando florece, con un destello al posarse.
 *  - Viento: la copa se desplaza con ondas lentas y rachas; el tronco y el suelo
 *    apenas se mueven. Como se vuelve a tramar, los puntos titilan como hojas.
 *  - Hojas: de vez en cuando un punto se suelta de la copa, cae, se posa y se apaga.
 *
 * tree.png sigue en el HTML: es lo que se ve antes de hidratar, sin JavaScript y con
 * movimiento reducido (entonces no se anima nada). El script de arranque de la home
 * marca `data-tree-intro` para ocultarlo antes del primer pintado si toca crecimiento.
 */

const W = 287;
const H = 203;
// Matriz h4x4a de ImageMagick y desfase del recorte (22, 21) sobre la rejilla original.
const MATRIX = [4, 2, 7, 5, 3, 1, 8, 6, 7, 5, 4, 2, 8, 6, 3, 1];
const OFF_X = 22;
const OFF_Y = 21;
const INK = 0xff201e20; // #201E20 en ABGR (little endian)
const FPS = 30;

const INTRO_KEY = "treeIntro";
const GROW_SECONDS = 4.0;
const GROW_SPAN = 1.46; // hasta dónde llega el frente: la celda más lejana (~1,2 con ruido) más el ancho del borde (0,24)
// Base del tronco, de donde brota todo, en celdas del lienzo.
const ROOT_X = 125;
const ROOT_Y = 168;
const SPARKS = 190;

const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
// Avance del frente: sale despacio, acelera y se posa (easeInOutSine), y su inversa.
const growAt = (t: number) => (GROW_SPAN * (1 - Math.cos(Math.PI * Math.min(1, Math.max(0, t / GROW_SECONDS))))) / 2;
const timeFor = (front: number) => (GROW_SECONDS * Math.acos(1 - (2 * Math.min(front, GROW_SPAN)) / GROW_SPAN)) / Math.PI;

/** Pseudoaleatorio con semilla: el crecimiento sale igual cada vez. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let r = Math.imul(s ^ (s >>> 15), 1 | s);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

type Leaf = { x0: number; y: number; vy: number; drift: number; phase: number; age: number; rest: number; landY: number };
// Chispa de savia: curva de Bézier cúbica de la raíz a su celda de destino.
type Spark = { t0: number; t1: number; p: number[] };

export default function TreeSpecimen({ alt }: { alt: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef(false);

  // Antes del primer pintado: decide si toca crecimiento y, si se llega navegando
  // (sin el script de arranque), oculta la imagen para que no asome un fotograma.
  useLayoutEffect(() => {
    const root = document.documentElement;
    let reduced = false;
    let seen = true;
    try {
      reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      seen = sessionStorage.getItem(INTRO_KEY) === "1";
    } catch {}
    introRef.current = !reduced && (root.dataset.treeIntro === "1" || !seen);
    if (introRef.current && imgRef.current) imgRef.current.style.visibility = "hidden";
    delete root.dataset.treeIntro;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !img || !wrap) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      img.style.visibility = "";
      return;
    }

    let raf = 0;
    let running = false;
    let visible = true;
    let disposed = false;

    const src = new Float32Array(W * H);
    const bloom = new Float32Array(W * H); // cuándo florece cada celda (distancia a la raíz con ruido)
    const frame = ctx.createImageData(W, H);
    const px = new Uint32Array(frame.data.buffer);
    const gw = new Float32Array(H); // peso del viento por fila
    const rowC = new Float32Array(H);
    const rowS = new Float32Array(H);
    const colA = new Float32Array(W);
    const colB = new Float32Array(W);
    const canopy: number[] = []; // celdas oscuras de la copa, de donde salen las hojas
    const leaves: Leaf[] = [];
    const sparks: Spark[] = [];
    let growing = false;
    const rand = rng(9);

    const threshold = (x: number, y: number) => MATRIX[((y + OFF_Y) & 3) * 4 + ((x + OFF_X) & 3)];

    // Rachas: picos suaves cada 8 a 13 s (el ciclo se repite cada 10 minutos).
    const gusts: number[] = [];
    for (let t = 9; t < 600; t += 8 + rand() * 5) gusts.push(t);
    const gust = (time: number) => {
      const t = time % 600;
      let g = 0;
      for (const c of gusts) {
        const d = (t - c) / 1.4;
        if (d > -1 && d < 1) g = Math.max(g, Math.cos(d * Math.PI * 0.5) ** 2);
        if (c > t + 2) break;
      }
      return g;
    };

    const sample = (fx: number, fy: number) => {
      if (fx < 0 || fy < 0 || fx > W - 1 || fy > H - 1) return 1;
      const x0 = fx | 0;
      const y0 = fy | 0;
      const x1 = x0 < W - 1 ? x0 + 1 : x0;
      const y1 = y0 < H - 1 ? y0 + 1 : y0;
      const ax = fx - x0;
      const ay = fy - y0;
      const top = src[y0 * W + x0] * (1 - ax) + src[y0 * W + x1] * ax;
      const bot = src[y1 * W + x0] * (1 - ax) + src[y1 * W + x1] * ax;
      return top * (1 - ay) + bot * ay;
    };

    const dot = (x: number, y: number) => {
      const ix = Math.round(x);
      const iy = Math.round(y);
      if (ix >= 0 && iy >= 0 && ix < W && iy < H) px[iy * W + ix] = INK;
    };

    let start = 0;
    let last = 0;
    let nextLeaf = 1.5;

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      px.fill(0);
      if (growing && t > GROW_SECONDS + 0.4) growing = false;
      const front = growing ? growAt(t) : 0;

      // Viento: entra suave desde el principio y crece en las rachas.
      const g = smooth(0, 2.4, t) * (1 + 0.75 * gust(t));
      for (let x = 0; x < W; x++) {
        colA[x] = Math.sin(0.043 * x + 0.85 * t);
        colB[x] = Math.sin(0.071 * x + 1.35 * t + 1.7);
      }
      for (let y = 0; y < H; y++) {
        rowC[y] = Math.cos(0.035 * y - 0.4 * t);
        rowS[y] = Math.sin(0.09 * y - 1.6 * t);
      }
      for (let y = 0; y < H; y++) {
        const w = gw[y] * g;
        const base = y * W;
        const rc = rowC[y] * 1.7;
        const rs = rowS[y] * 0.8;
        for (let x = 0; x < W; x++) {
          let v = w < 0.002 ? src[base + x] : sample(x - w * (colA[x] * rc + rs), y - w * 0.55 * colB[x]);
          if (growing) {
            // La tinta sube de tono a medida que el frente pasa: blanco, grises, su tono.
            const b = bloom[base + x];
            v = 1 - (1 - v) * smooth(b - 0.02, b + 0.24, front);
          }
          if (v * 9 < threshold(x, y)) px[base + x] = INK;
        }
      }

      // Savia: chispas que suben por el tronco y se abren hacia su zona de la copa.
      if (growing) {
        for (const s of sparks) {
          if (t < s.t0 || t > s.t1 + 0.16) continue;
          const p = s.p;
          if (t > s.t1) {
            // Destello al llegar: una cruz de cinco puntos que dura un instante.
            const x = p[6];
            const y = p[7];
            dot(x, y);
            if (t - s.t1 < 0.1) {
              dot(x - 1, y);
              dot(x + 1, y);
              dot(x, y - 1);
              dot(x, y + 1);
            }
            continue;
          }
          const u = (t - s.t0) / (s.t1 - s.t0);
          // Estela de tres puntos detrás de la chispa.
          for (let k = 0; k < 3; k++) {
            const q = u - k * 0.035;
            if (q < 0) break;
            const e = q < 0.5 ? 4 * q * q * q : 1 - (-2 * q + 2) ** 3 / 2;
            const m = 1 - e;
            const a = m * m * m;
            const b = 3 * m * m * e;
            const c = 3 * m * e * e;
            const d = e * e * e;
            dot(a * p[0] + b * p[2] + c * p[4] + d * p[6], a * p[1] + b * p[3] + c * p[5] + d * p[7]);
          }
        }
      }

      // Hojas
      if (t > nextLeaf && canopy.length) {
        const n = gust(t) > 0.5 ? 2 : 1;
        for (let k = 0; k < n; k++) {
          const c = canopy[(rand() * canopy.length) | 0];
          leaves.push({
            x0: c % W,
            y: (c / W) | 0,
            vy: 7 + rand() * 6,
            drift: (rand() - 0.3) * 4,
            phase: rand() * 6.28,
            age: 0,
            rest: 0,
            landY: H * (0.78 + rand() * 0.18),
          });
        }
        nextLeaf = t + 1.4 + rand() * 2.2;
      }
      const dt = Math.min(0.1, (now - last) / 1000);
      for (let i = leaves.length - 1; i >= 0; i--) {
        const l = leaves[i];
        l.age += dt;
        if (l.y < l.landY) {
          l.y += l.vy * dt;
          l.x0 += (l.drift + 2.2 * gust(t)) * dt;
        } else {
          l.rest += dt;
        }
        // Al posarse parpadea unos instantes y desaparece.
        if (l.rest > 1.4 || l.x0 < -4 || l.x0 > W + 4) {
          leaves.splice(i, 1);
          continue;
        }
        if (l.rest > 0.6 && ((l.rest * 12) | 0) % 2) continue;
        const sway = l.rest > 0 ? 0 : Math.sin(l.phase + l.age * 3.1) * 1.8;
        const x = Math.round(l.x0 + sway);
        const y = Math.round(l.y);
        if (x >= 0 && x < W && y >= 0 && y < H) {
          px[y * W + x] = INK;
          // Gira: a ratos se ve de canto (un punto) y a ratos de plano (dos).
          if (l.rest === 0 && Math.cos(l.phase + l.age * 3.1) > 0.2 && x + 1 < W) px[y * W + x + 1] = INK;
        }
      }

      ctx.putImageData(frame, 0, 0);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / FPS - 2) return;
      draw(now);
      last = now;
    };

    const update = () => {
      const shouldRun = visible && !document.hidden && !disposed;
      if (shouldRun && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });

    const source = new window.Image();
    source.src = "/images/dither/tree-src.png";
    source.decode().then(() => {
      if (disposed) return;
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      octx.drawImage(source, 0, 0);
      const data = octx.getImageData(0, 0, W, H).data;
      for (let i = 0; i < W * H; i++) src[i] = data[i * 4] / 255;

      // El viento manda en la copa y se apaga hacia el tronco y el suelo.
      for (let y = 0; y < H; y++) gw[y] = 0.9 * smooth(0.74 * H, 0.08 * H, y);
      for (let y = 0; y < H * 0.5; y++) for (let x = 0; x < W; x++) if (src[y * W + x] < 0.3) canopy.push(y * W + x);

      if (introRef.current) {
        growing = true;
        nextLeaf = GROW_SECONDS + 1.5;
        // Distancia a la raíz, algo achatada (la copa se abre a lo ancho), con un
        // ruido suave que hace irregular el borde del frente, como tinta que se expande.
        const r = rng(5);
        const ph = [r() * 6.28, r() * 6.28, r() * 6.28, r() * 6.28];
        const maxD = Math.hypot(W * 0.62, H * 1.0);
        for (let y = 0; y < H; y++)
          for (let x = 0; x < W; x++) {
            const d = Math.hypot((x - ROOT_X) * 0.62, (y - ROOT_Y) * 1.0) / maxD;
            const n =
              0.07 * Math.sin(x * 0.061 + ph[0]) * Math.sin(y * 0.083 + ph[1]) +
              0.045 * Math.sin(x * 0.17 + y * 0.11 + ph[2]) +
              0.03 * Math.sin(x * 0.31 - y * 0.27 + ph[3]);
            bloom[y * W + x] = Math.max(0, d * 1.05 + n);
          }
        // Cada chispa llega a su celda cuando el frente pasa por ella.
        for (let i = 0; i < SPARKS; i++) {
          const c = canopy[(r() * canopy.length) | 0];
          const tx = c % W;
          const ty = (c / W) | 0;
          const t1 = timeFor(bloom[c] + 0.04);
          const dur = 0.85 + r() * 0.6;
          const t0 = Math.max(0.05, t1 - dur);
          const sx = ROOT_X + (r() - 0.5) * 8;
          const sy = ROOT_Y + r() * 4;
          sparks.push({
            t0,
            t1,
            p: [
              sx, sy,
              ROOT_X + (r() - 0.5) * 14, ROOT_Y - 38 - r() * 24, // sube por el tronco
              tx + (r() - 0.5) * 70, ty + 18 + r() * 26, // y se abre en curva
              tx, ty,
            ],
          });
        }
        try {
          sessionStorage.setItem(INTRO_KEY, "1");
        } catch {}
      }

      start = performance.now();
      draw(start);
      // El canvas ya pinta lo mismo que la imagen (o el primer fotograma del
      // crecimiento): relevo.
      canvas.style.visibility = "visible";
      img.style.visibility = "hidden";
      io.observe(wrap);
      document.addEventListener("visibilitychange", update);
      update();
    }).catch(() => {
      img.style.visibility = "";
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Image
        ref={imgRef}
        src="/images/dither/tree.png"
        alt={alt}
        fill
        priority
        unoptimized
        className="tree-png object-contain"
      />
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        aria-hidden
        className="invisible absolute inset-0 h-full w-full object-contain [image-rendering:pixelated]"
      />
    </div>
  );
}
