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
 * Cuatro capas:
 *  - Viento: la copa se desplaza con ondas lentas y rachas; el tronco y el suelo
 *    apenas se mueven. Como se vuelve a tramar, los puntos titilan como hojas.
 *  - Hojas: de vez en cuando un punto se suelta de la copa, cae, se posa y se apaga.
 *  - Escáner: cada 10 a 14 s una línea barre el espécimen e invierte los puntos a su
 *    paso, con una lectura que la acompaña.
 *  - Impresión: la primera vez en la sesión los puntos llegan dispersos y se colocan
 *    de abajo arriba hasta formar el árbol.
 *
 * tree.png sigue en el HTML: es lo que se ve antes de hidratar, sin JavaScript y con
 * movimiento reducido (entonces no se anima nada). El script de arranque de la home
 * marca `data-tree-intro` para ocultarlo antes del primer pintado si toca impresión.
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
const INTRO_SECONDS = 2.6;

const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Pseudoaleatorio con semilla: la impresión sale igual cada vez. */
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

export default function TreeSpecimen({ alt, scanLabel }: { alt: string; scanLabel: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const introRef = useRef(false);

  // Antes del primer pintado: decide si toca impresión y, si se llega navegando
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
    const readout = readoutRef.current;
    if (!canvas || !img || !wrap || !readout) return;
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
    const frame = ctx.createImageData(W, H);
    const px = new Uint32Array(frame.data.buffer);
    const gw = new Float32Array(H); // peso del viento por fila
    const rowC = new Float32Array(H);
    const rowS = new Float32Array(H);
    const colA = new Float32Array(W);
    const colB = new Float32Array(W);
    const canopy: number[] = []; // celdas oscuras de la copa, de donde salen las hojas
    const colTop = new Int16Array(W); // alto que ocupa el espécimen en cada columna
    const colBot = new Int16Array(W);
    const leaves: Leaf[] = [];
    let introDots: Float32Array | null = null; // x, y destino, dx, dy de salida, retardo
    const rand = rng(9);

    const threshold = (x: number, y: number) => MATRIX[((y + OFF_Y) & 3) * 4 + ((x + OFF_X) & 3)];

    // Rachas: picos suaves cada 7 a 11 s (el ciclo se repite cada 10 minutos).
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

    // Escáner: barridos de 2,2 s cada 10 a 14 s.
    const scans: number[] = [];
    for (let t = 5.5; t < 600; t += 10 + rand() * 4) scans.push(t);
    const SCAN_DUR = 2.2;

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

    let start = 0;
    let last = 0;
    let liveFrom = 0; // momento en que termina la impresión y arranca el viento
    let nextLeaf = 1.5;

    const placeReadout = (sx: number, pct: number) => {
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      const scale = Math.min(cw / W, ch / H);
      const offX = (cw - W * scale) / 2;
      const offY = (ch - H * scale) / 2;
      const bottom = colBot[sx] >= 0 ? colBot[sx] + 8 : H - 4;
      const left = sx < W * 0.62;
      const x = offX + sx * scale + (left ? 6 : -6 - readout.offsetWidth);
      const y = offY + Math.min(bottom, H - 4) * scale;
      readout.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
      readout.textContent = `${scanLabel} ${String(pct).padStart(3, "0")}% · X${String(Math.round(sx * 4)).padStart(4, "0")}`;
    };

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      px.fill(0);

      // Impresión
      if (introDots && t < INTRO_SECONDS) {
        const d = introDots;
        for (let i = 0; i < d.length; i += 5) {
          const p = (t - d[i + 4]) / 0.95;
          if (p <= 0) continue;
          const e = p >= 1 ? 0 : (1 - p) ** 3;
          const x = Math.round(d[i] + d[i + 2] * e);
          const y = Math.round(d[i + 1] + d[i + 3] * e);
          if (x >= 0 && y >= 0 && x < W && y < H) px[y * W + x] = INK;
        }
        ctx.putImageData(frame, 0, 0);
        return;
      }
      if (introDots) {
        introDots = null;
        liveFrom = t;
      }

      // Viento: arranca suave tras la impresión y crece en las rachas.
      const ramp = smooth(0, 1.6, t - liveFrom);
      const g = ramp * (1 + 0.75 * gust(t));
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
        if (w < 0.002) {
          for (let x = 0; x < W; x++) if (src[base + x] * 9 < threshold(x, y)) px[base + x] = INK;
          continue;
        }
        const rc = rowC[y] * 1.7;
        const rs = rowS[y] * 0.8;
        for (let x = 0; x < W; x++) {
          const dx = w * (colA[x] * rc + rs);
          const dy = w * 0.55 * colB[x];
          if (sample(x - dx, y - dy) * 9 < threshold(x, y)) px[base + x] = INK;
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

      // Escáner
      let scanning = false;
      const st = (t - liveFrom) % 600;
      for (const s of scans) {
        const p = (st - s) / SCAN_DUR;
        if (p < 0) break;
        if (p > 1) continue;
        scanning = true;
        const e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
        const sx = Math.round(-6 + e * (W + 12));
        for (let x = Math.max(0, sx - 9); x <= Math.min(W - 1, sx - 1); x++) {
          // Estela que invierte el semitono dentro del espécimen y se disuelve hacia atrás.
          const fade = (sx - x) / 10;
          for (let y = 0; y < H; y++) {
            if (src[y * W + x] > 0.97) continue;
            if (fade > 0.45 && ((x * 7 + y * 13) & 7) < fade * 8) continue;
            const i = y * W + x;
            px[i] = px[i] ? 0 : INK;
          }
        }
        // La línea solo recorre el alto del espécimen en su columna, con un margen.
        if (sx >= 0 && sx < W && colBot[sx] >= 0) {
          for (let y = Math.max(0, colTop[sx] - 6); y <= Math.min(H - 1, colBot[sx] + 6); y++) px[y * W + sx] = INK;
        }
        placeReadout(Math.min(Math.max(sx, 0), W - 1), Math.round(e * 100));
        break;
      }
      readout.style.opacity = scanning ? "1" : "0";

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
      for (let x = 0; x < W; x++) {
        let top = H;
        let bot = -1;
        for (let y = 0; y < H; y++) if (src[y * W + x] < 0.97) { if (y < top) top = y; bot = y; }
        colTop[x] = top;
        colBot[x] = bot;
      }

      if (introRef.current) {
        const pts: number[] = [];
        const r = rng(3);
        for (let y = 0; y < H; y++)
          for (let x = 0; x < W; x++) {
            if (!(src[y * W + x] * 9 < threshold(x, y))) continue;
            const a = r() * Math.PI * 2;
            const dist = 18 + r() * 46;
            const delay = (1 - y / H) * 1.05 + r() * 0.55;
            pts.push(x, y, Math.cos(a) * dist, Math.sin(a) * dist - 10, delay);
          }
        introDots = new Float32Array(pts);
        try {
          sessionStorage.setItem(INTRO_KEY, "1");
        } catch {}
      }

      start = performance.now();
      draw(start);
      // El canvas ya pinta lo mismo que la imagen: relevo.
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
  }, [scanLabel]);

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
      <span
        ref={readoutRef}
        aria-hidden
        className="code pointer-events-none absolute left-0 top-0 whitespace-nowrap text-[9px] text-ink opacity-0 md:text-[10px]"
      />
    </div>
  );
}
