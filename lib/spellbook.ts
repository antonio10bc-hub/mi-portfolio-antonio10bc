/*
 * El libro de hechizos del minijuego secreto (components/Spellbook.tsx): reconoce
 * letras dibujadas a mano y dice qué hechizo lanza cada letra del nombre.
 *
 * El reconocedor es $P (Vatavu, Anthony y Wobbrock, 2012): compara la nube de
 * puntos de lo dibujado con la de cada plantilla, sin importar el orden ni el
 * sentido de los trazos, así que una "t" vale empezando por la barra o por el
 * palo, y una "i" con o sin punto. Sin dependencias ni servidor.
 */

export type Point = { x: number; y: number; stroke: number };

const N = 32; // puntos por nube

// --- $P ---------------------------------------------------------------------

function pathLength(points: Point[]) {
  let d = 0;
  for (let i = 1; i < points.length; i++) {
    if (points[i].stroke === points[i - 1].stroke) d += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  return d;
}

/** Remuestrea a N puntos equidistantes a lo largo de los trazos (sin unir un trazo con el siguiente). */
function resample(input: Point[], n: number): Point[] {
  const points = input.map((p) => ({ ...p }));
  const total = pathLength(points);
  // Todo un punto (una "i" sin palo, un toque): N copias del mismo.
  if (total === 0) return Array.from({ length: n }, () => ({ ...points[0] }));
  const interval = total / (n - 1);
  let acc = 0;
  const out: Point[] = [{ ...points[0] }];
  for (let i = 1; i < points.length; i++) {
    if (points[i].stroke !== points[i - 1].stroke) continue;
    const d = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    if (acc + d >= interval && d > 0) {
      const t = (interval - acc) / d;
      const q: Point = {
        x: points[i - 1].x + t * (points[i].x - points[i - 1].x),
        y: points[i - 1].y + t * (points[i].y - points[i - 1].y),
        stroke: points[i].stroke,
      };
      out.push(q);
      points.splice(i, 0, q);
      acc = 0;
    } else {
      acc += d;
    }
  }
  while (out.length < n) out.push({ ...points[points.length - 1] });
  return out.slice(0, n);
}

/** Escala uniforme a la caja unidad (conserva la proporción) y centra en el origen. */
function normalize(points: Point[]): Point[] {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of points) {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
  }
  const size = Math.max(maxX - minX, maxY - minY) || 1;
  const scaled = points.map((p) => ({ x: (p.x - minX) / size, y: (p.y - minY) / size, stroke: p.stroke }));
  const cx = scaled.reduce((s, p) => s + p.x, 0) / scaled.length;
  const cy = scaled.reduce((s, p) => s + p.y, 0) / scaled.length;
  return scaled.map((p) => ({ x: p.x - cx, y: p.y - cy, stroke: p.stroke }));
}

function cloudDistance(a: Point[], b: Point[], start: number) {
  const matched = new Array(a.length).fill(false);
  let sum = 0;
  let i = start;
  do {
    let min = Infinity;
    let index = -1;
    for (let j = 0; j < b.length; j++) {
      if (matched[j]) continue;
      const d = Math.hypot(a[i].x - b[j].x, a[i].y - b[j].y);
      if (d < min) { min = d; index = j; }
    }
    matched[index] = true;
    const weight = 1 - ((i - start + a.length) % a.length) / a.length;
    sum += weight * min;
    i = (i + 1) % a.length;
  } while (i !== start);
  return sum;
}

function greedyMatch(points: Point[], template: Point[]) {
  const step = Math.floor(Math.pow(points.length, 0.5));
  let min = Infinity;
  for (let i = 0; i < points.length; i += step) {
    min = Math.min(min, cloudDistance(points, template, i), cloudDistance(template, points, i));
  }
  return min;
}

const prepare = (points: Point[]) => normalize(resample(points, N));

// --- Plantillas ---------------------------------------------------------------
// En una caja de 0 a 100, con la y hacia abajo. Varias por letra: minúscula,
// mayúscula y las formas más comunes de escribirlas.

type Stroke = [number, number][];
const line = (x1: number, y1: number, x2: number, y2: number, n = 12): Stroke =>
  Array.from({ length: n }, (_, k) => [x1 + ((x2 - x1) * k) / (n - 1), y1 + ((y2 - y1) * k) / (n - 1)]);
/** Arco de elipse; ángulos en grados, 0 a la derecha y creciendo en sentido horario. */
const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 24): Stroke =>
  Array.from({ length: n }, (_, k) => {
    const a = ((a0 + ((a1 - a0) * k) / (n - 1)) * Math.PI) / 180;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
  });
const dot = (x: number, y: number): Stroke => [[x, y]];

export type Letter = "a" | "n" | "t" | "o" | "i";

const TEMPLATES: Record<Letter, Stroke[][]> = {
  o: [
    [arc(50, 50, 40, 45, -90, 270)],
    [arc(50, 50, 45, 36, -90, 270)],
    [arc(50, 50, 34, 48, -100, 275)],
  ],
  a: [
    // a de una panza: círculo y palo a la derecha
    [arc(42, 60, 30, 32, -20, 340), line(74, 28, 74, 94)],
    [[...arc(42, 60, 30, 32, -20, 340), ...line(72, 50, 76, 94, 6)]],
    // a de imprenta: gancho arriba y panza abajo
    [[...arc(48, 34, 26, 22, 200, 360), ...line(74, 34, 74, 94, 10)], arc(50, 70, 25, 20, -10, 350)],
    // A mayúscula
    [line(12, 95, 50, 5), line(50, 5, 88, 95), line(28, 62, 72, 62)],
    [[...line(12, 95, 50, 5), ...line(50, 5, 88, 95)], line(28, 62, 72, 62)],
  ],
  n: [
    // n: palo y joroba
    [line(22, 25, 22, 95), [...arc(48, 48, 26, 24, 180, 360), ...line(74, 48, 74, 95, 10)]],
    [[...line(22, 25, 22, 95, 10), ...line(22, 95, 22, 50, 6), ...arc(48, 48, 26, 24, 180, 360), ...line(74, 48, 74, 95, 10)]],
    // N mayúscula
    [line(20, 95, 20, 5), line(20, 5, 80, 95), line(80, 95, 80, 5)],
    [[...line(20, 95, 20, 5), ...line(20, 5, 80, 95), ...line(80, 95, 80, 5)]],
  ],
  t: [
    // t: palo (con o sin gancho) y barra
    [line(45, 5, 45, 95), line(18, 32, 74, 32)],
    [[...line(45, 5, 45, 82), ...arc(60, 82, 15, 13, 180, 70, 10)], line(18, 32, 74, 32)],
    // T mayúscula
    [line(8, 8, 92, 8), line(50, 8, 50, 95)],
  ],
  i: [
    // i: palo y punto, o solo el palo
    [line(50, 38, 50, 95), dot(50, 12)],
    [line(50, 30, 50, 95)],
    // I mayúscula con o sin remates
    [line(30, 5, 70, 5), line(50, 5, 50, 95), line(30, 95, 70, 95)],
  ],
};

const toPoints = (strokes: Stroke[]): Point[] =>
  strokes.flatMap((stroke, s) => stroke.map(([x, y]) => ({ x, y, stroke: s })));

const PREPARED = (Object.keys(TEMPLATES) as Letter[]).map((letter) => ({
  letter,
  clouds: TEMPLATES[letter].map((strokes) => prepare(toPoints(strokes))),
}));

/** Distancia de lo dibujado a cada letra (la mejor de sus plantillas). Menor es mejor. */
export function score(points: Point[]): Record<Letter, number> {
  const cloud = prepare(points);
  const out = {} as Record<Letter, number>;
  for (const { letter, clouds } of PREPARED) out[letter] = Math.min(...clouds.map((c) => greedyMatch(cloud, c)));
  return out;
}

/**
 * Por encima de esto, lo dibujado no se parece a la letra. Medido con letras a mano
 * sintéticas (estiradas, inclinadas, giradas, con temblor y trazos en otro orden):
 * el 99% puntúa por debajo de 1.62 y el máximo fue 1.91; garabatos al azar, la
 * mitad por encima de 2.2 y solo el 10% por debajo de 1.6.
 */
const GARBAGE = 1.8;
/** La letra que toca se acepta aunque otra puntúe algo mejor: el juego es amable. */
const LENIENCY = 1.3;

/**
 * ¿Es lo dibujado la letra que toca? Acepta si es la mejor, o si queda cerca de
 * la mejor (las letras a mano se parecen mucho entre sí) y no es un garabato.
 */
export function matches(points: Point[], expected: Letter) {
  if (points.length === 0) return { ok: false, best: null as Letter | null };
  const scores = score(points);
  const best = (Object.keys(scores) as Letter[]).reduce((a, b) => (scores[a] <= scores[b] ? a : b));
  const ok = scores[expected] < GARBAGE && (best === expected || scores[expected] <= scores[best] * LENIENCY);
  return { ok, best, scores };
}

// --- Hechizos -------------------------------------------------------------------

export type Element = "fire" | "water" | "wind" | "earth" | "lightning" | "ice" | "light";

/** Las letras del nombre, en orden, y el hechizo de cada una (por posición: las dos "n" y las dos "o" lanzan cosas distintas). */
export const NAME: { letter: Letter; element: Element }[] = [
  { letter: "a", element: "fire" },
  { letter: "n", element: "water" },
  { letter: "t", element: "wind" },
  { letter: "o", element: "earth" },
  { letter: "n", element: "lightning" },
  { letter: "i", element: "ice" },
  { letter: "o", element: "light" },
];
