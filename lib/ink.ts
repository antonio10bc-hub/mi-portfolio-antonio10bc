/*
 * Geometría de los trazos a mano (components/Ink.tsx e InkBox.tsx). Todo sale de
 * una semilla de texto con un hash determinista, nunca de Math.random(): el mismo
 * marco tiene siempre el mismo temblor, en el servidor y en el cliente.
 */

/** Hash FNV-1a + xorshift: una secuencia estable de enteros a partir de un texto. */
function sequence(seed: string, length: number) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const out: number[] = [];
  for (let i = 0; i < length; i++) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    out.push(Math.abs(h));
  }
  return out;
}

/** Números deterministas en [-1, 1) a partir de una semilla. */
export function noise(seed: string, length: number) {
  return sequence(seed, length).map((v) => (v % 2000) / 1000 - 1);
}

export type Pt = [number, number];

/** Redondeo a centésimas, para que el `d` de los trazos no sea kilométrico. */
export const r2 = (n: number) => Math.round(n * 100) / 100;

/** Catmull-Rom a Bézier: una curva suave que pasa por todos los puntos, como una mano. */
export function smooth(points: Pt[]) {
  let d = `M${r2(points[0][0])} ${r2(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${r2(c1[0])} ${r2(c1[1])} ${r2(c2[0])} ${r2(c2[1])} ${r2(p2[0])} ${r2(p2[1])}`;
  }
  return d;
}

/*
 * Las tres formas que se estiran con su caja (marco, círculo, subrayado) se
 * generan en píxeles reales, con la caja ya medida: así el trazo no se deforma y
 * el guion de pathLength="1" coincide con la longitud que se ve. Con un viewBox
 * genérico estirado (preserveAspectRatio="none" y non-scaling-stroke) Chrome
 * calcula el guion en otro espacio y el trazo salía a trozos.
 */

/**
 * Rectángulo a mano: cuatro trazos que se combean y se pasan un poco de las
 * esquinas, como al cerrar un marco sin levantar mucho el rotulador.
 */
export function roughRect(seed: string, w: number, h: number) {
  const r = noise(seed, 32);
  let i = 0;
  const n = () => r[i++ % r.length];
  const wobble = Math.min(3.5, Math.min(w, h) * 0.02);
  // Con 9px de tope, marco + sobrante + inclinación caben en el margen de 20px del móvil.
  const overshoot = Math.min(9, Math.min(w, h) * 0.05);
  const corners: Pt[] = [
    [n() * wobble, n() * wobble],
    [w + n() * wobble, n() * wobble],
    [w + n() * wobble, h + n() * wobble],
    [n() * wobble, h + n() * wobble],
  ];
  let d = "";
  for (let k = 0; k < 4; k++) {
    const a = corners[k];
    const b = corners[(k + 1) % 4];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const ux = (b[0] - a[0]) / len;
    const uy = (b[1] - a[1]) / len;
    const o1 = overshoot * (0.25 + 0.75 * Math.abs(n()));
    const o2 = overshoot * (0.25 + 0.75 * Math.abs(n()));
    const bow = n() * wobble * 1.5;
    const s: Pt = [a[0] - ux * o1, a[1] - uy * o1];
    const e: Pt = [b[0] + ux * o2, b[1] + uy * o2];
    const c: Pt = [(a[0] + b[0]) / 2 - uy * bow, (a[1] + b[1]) / 2 + ux * bow];
    d += `M${r2(s[0])} ${r2(s[1])}Q${r2(c[0])} ${r2(c[1])} ${r2(e[0])} ${r2(e[1])}`;
  }
  return d;
}

/** Círculo a mano alrededor de una palabra: algo más de una vuelta, sin cerrar donde empieza. */
export function roughEllipse(seed: string, w: number, h: number) {
  const r = noise(seed, 40);
  const steps = 26;
  const start = -2.3 + r[0] * 0.3;
  const sweep = Math.PI * 2 * 1.16;
  const points: Pt[] = Array.from({ length: steps + 1 }, (_, k) => {
    const t = start + (sweep * k) / steps;
    const grow = 1 + (k / steps) * 0.05;
    return [
      w / 2 + Math.cos(t) * (w / 2) * (0.96 + r[k + 1] * 0.035) * grow,
      h / 2 + Math.sin(t) * (h / 2) * (0.94 + r[k + 2] * 0.05) * grow,
    ];
  });
  return smooth(points);
}

/** Subrayado a mano: una ida ondulada y una vuelta más corta por debajo. */
export function roughUnderline(seed: string, w: number, h: number) {
  const r = noise(seed, 16);
  const steps = 7;
  const out: Pt[] = Array.from({ length: steps }, (_, k) => [
    w * 0.01 + (w * 0.98 * k) / (steps - 1),
    h * (0.42 + r[k] * 0.14) - (k / steps) * h * 0.1,
  ]);
  const back: Pt[] = [0, 1, 2, 3].map((k) => [w * (0.95 - k * 0.24), h * (0.78 + r[k + 8] * 0.1)]);
  return smooth([...out, ...back]);
}
