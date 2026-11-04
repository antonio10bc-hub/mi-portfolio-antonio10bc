/*
 * Vocabulario gráfico de la dirección de arte "Cuaderno de tinta" (docs/art-direction):
 * trazos a mano en tinta sobre papel. Todo es decorativo (aria-hidden) y pinta en
 * `currentColor`. Las formas "a mano" salen de una semilla de texto con un hash
 * determinista, nunca de Math.random(): el HTML del servidor y el del cliente
 * coinciden y cada marco tiene siempre el mismo temblor.
 *
 * Los trazos llevan pathLength="1" y la clase `ink-line`: con `ink-draw` se dibujan
 * al cargar (retraso en --d), ver globals.css. Aquí van los dibujos de tamaño fijo
 * (escalan uniformes); el marco, el círculo y el subrayado, que se estiran con su
 * caja, están en InkBox.tsx y se dibujan en píxeles medidos.
 */

import type { CSSProperties } from "react";
import { noise, r2 as f, smooth, type Pt } from "@/lib/ink";

type Drawn = {
  /** Se dibuja al cargar, con este retraso en segundos. */
  draw?: boolean;
  delay?: number;
};

/** Flecha a mano. `curl` la hace dar un rizo antes de llegar. */
export function InkArrow({
  seed = "arrow",
  direction = "right",
  curl = false,
  className = "",
  width = 3.6,
  draw,
  delay = 0,
}: {
  seed?: string;
  direction?: "right" | "left" | "down";
  curl?: boolean;
  className?: string;
  /** Grosor en unidades del viewBox (80 de ancho): escala con la flecha. */
  width?: number;
} & Drawn) {
  const r = noise(seed, 12);
  const shaft: Pt[] = curl
    ? [[2, 22], [20, 14 + r[0] * 2], [34, 6], [40, 14], [32, 20], [30, 12], [48, 10 + r[1] * 2], [76, 15]]
    : [[2, 16 + r[0] * 2], [26, 13 + r[1] * 2], [52, 16 + r[2] * 2], [76, 14]];
  const head = `M${f(62 + r[3])} ${f(4 + r[4])}L77 ${f(14.5 + r[5] * 0.5)}L${f(61 + r[6])} ${f(25 + r[7])}`;
  const rotate = direction === "left" ? "scaleX(-1)" : direction === "down" ? "rotate(90deg)" : undefined;
  return (
    <svg aria-hidden viewBox="0 0 80 30" className={`block overflow-visible ${className}`} style={{ transform: rotate }}>
      <path
        d={smooth(shaft) + head}
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`ink-line ${draw ? "ink-draw" : ""}`}
        style={draw ? ({ "--d": `${delay}s` } as CSSProperties) : undefined}
      />
    </svg>
  );
}

/** La cruz de la túnica del mago: el "+" que hace de estrella y de viñeta. */
export function Cross({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={`block h-3.5 w-3.5 overflow-visible ${className}`} style={style}>
      <path d="M2.5 8.6 13.6 7.6M7.6 2.4 8.4 13.6" fill="none" stroke="currentColor" strokeWidth={3.1} strokeLinecap="round" />
    </svg>
  );
}

/** Mancha de tinta: un círculo deforme y macizo, para números y sellos. */
export function InkBlob({ seed, className = "", children }: { seed: string; className?: string; children?: React.ReactNode }) {
  const r = noise(seed, 20);
  const steps = 14;
  const points: Pt[] = Array.from({ length: steps + 3 }, (_, k) => {
    const t = (Math.PI * 2 * k) / steps;
    const rad = 44 + r[k % steps] * 5;
    return [50 + Math.cos(t) * rad, 50 + Math.sin(t) * rad];
  });
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
        <path d={smooth(points)} fill="currentColor" />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}

/**
 * Chispas de varita: cruces que salen de un punto hacia `angle` (grados, 0 =
 * derecha, 180 = izquierda), giran y se apagan, en bucle y escalonadas.
 */
export function Sparkles({
  seed = "sparkles",
  count = 7,
  angle = 180,
  spread = 70,
  distance = 90,
  delay = 0,
  className = "",
}: {
  seed?: string;
  count?: number;
  angle?: number;
  spread?: number;
  distance?: number;
  delay?: number;
  className?: string;
}) {
  const r = noise(seed, count * 3);
  return (
    <span aria-hidden className={`pointer-events-none absolute h-0 w-0 ${className}`}>
      {Array.from({ length: count }, (_, k) => {
        const a = ((angle + r[k] * spread) * Math.PI) / 180;
        const dist = distance * (0.55 + 0.45 * Math.abs(r[k + count]));
        const size = 9 + Math.abs(r[k + count * 2]) * 9;
        return (
          <Cross
            key={k}
            className="spark absolute -translate-x-1/2 -translate-y-1/2 animate-spark text-ink"
            style={
              {
                width: size,
                height: size,
                "--dx": `${f(Math.cos(a) * dist)}px`,
                "--dy": `${f(Math.sin(a) * dist)}px`,
                animationDelay: `${f(delay + (k * 2.4) / count)}s`,
              } as CSSProperties
            }
          />
        );
      })}
    </span>
  );
}

/*
 * El mago. Dibujo propio en el estilo de la referencia (tinta gruesa, trazo
 * ingenuo, túnica con cruces y manchas), no una copia. Se dibuja trazo a trazo
 * al cargar; el filtro de tinta solo ondula los bordes, sin desenfoque. La punta
 * de la varita está en (8, 180) de un viewBox de 240x290: ahí van las chispas.
 */
/*
 * Tipos de trazo. El mago es "el sello": silueta maciza de tinta con las cruces y
 * las manchas del sombrero en blanco, y a sus pies dos gatos, uno gris y otro de
 * manchas (variante 10 de las propuestas, con los gatos pedidos aparte).
 */
const W = "f"; // relleno de papel con contorno
const S = "s"; // solo contorno
const K = "k"; // mancha maciza, sin contorno
const KK = "kk"; // macizo con contorno: se dibuja el contorno y luego se rellena
const WS = "ws"; // trazo blanco (las cruces sobre la túnica negra)
const WP = "w"; // punto blanco, sin contorno
const G = "g"; // relleno gris con contorno (el gato gris)
type Kind = typeof W | typeof S | typeof K | typeof KK | typeof WS | typeof WP | typeof G;

/** El gris del gato: el único gris del dibujo, más claro que el lápiz de las notas. */
const CAT_GREY = "#A9A5AA";

/** `arm`: parte del brazo de la varita, que va en su propio grupo para poder girar desde el hombro. */
type Part = { d: string; kind: Kind; t: number; w?: number; arm?: boolean };

/** Elipse como trazado, para meter los puntos del sombrero y de los gatos en la misma lista. */
const dot = (cx: number, cy: number, rx: number, ry = rx) =>
  `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;

/** Un gato sentado, de cara (el de la variante "Michi"); `mirror` lo pone al otro lado, mirando al mago. */
const CAT_BODY = "M170 278 C162 266 164 250 172 242 C176 238 177 232 176 226 L184 233 C190 231 196 231 201 233 L208 225 C209 232 209 240 205 246 C211 256 210 270 203 278 Z";
const CAT_TAIL = "M200 276 C214 274 224 262 218 248 C216 244 212 244 212 248";
const CAT_NOSE = "M191 250 l1.5 2 l1.5 -2";
const mirror = (d: string) =>
  // Refleja en x (x' = 238 - x) las coordenadas absolutas; las relativas (l, a) cambian de signo en x.
  d.replace(/([MLCQ])([^MLCQlaZ]+)/g, (_, cmd: string, nums: string) => {
    const v = nums.trim().split(/[ ,]+/).map(Number);
    return cmd + v.map((n, i) => (i % 2 === 0 ? 238 - n : n)).join(" ") + " ";
  }).replace(/l(-?[\d.]+) (-?[\d.]+)/g, (_, x: string, y: string) => `l${-Number(x)} ${y}`);

const WIZARD: Part[] = [
  // piernas y pies
  { d: "M114 246 L112 264 M132 246 L133 264", kind: S, t: 0.1 },
  { d: "M112 264 C100 266 90 270 88 276 C98 278 108 278 116 276 C116 272 114 267 112 264 Z", kind: KK, t: 0.2 },
  { d: "M133 264 C144 266 154 270 158 276 C148 278 138 278 130 276 C130 272 131 267 133 264 Z", kind: KK, t: 0.25 },
  // túnica maciza
  { d: "M108 122 C100 140 92 158 82 180 C74 198 66 216 56 238 C66 244 76 240 86 245 C98 249 108 242 120 247 C134 251 146 243 158 248 C168 250 176 244 184 240 C178 222 174 204 170 186 C164 162 160 142 154 122 C140 114 120 114 108 122 Z", kind: KK, t: 0.3 },
  // brazo, mano y varita
  { d: "M112 134 C98 138 82 144 66 152 C66 162 74 168 86 164 C96 158 104 154 114 152 Z", kind: KK, t: 0.55, arm: true },
  { d: "M68 148 C60 145 52 150 53 158 C56 165 66 165 70 159 Z", kind: W, t: 0.7, arm: true },
  { d: "M55 158 L8 180", kind: S, t: 0.85, w: 4.8, arm: true },
  // cruces y motas blancas sobre la tinta
  { d: "M93 176 h15 M100.5 168.5 v15", kind: WS, t: 0.9, w: 4.4 },
  { d: "M140 166 h15 M147.5 158.5 v15", kind: WS, t: 0.97, w: 4.4 },
  { d: "M112 216 h15 M119.5 208.5 v15", kind: WS, t: 1.04, w: 4.4 },
  { d: "M152 206 h14 M159 199 v14", kind: WS, t: 1.11, w: 4.4 },
  { d: "M84 222 h12 M90 216 v12", kind: WS, t: 1.18, w: 4.4 },
  { d: dot(78, 232, 1.6) + dot(170, 238, 1.4) + dot(132, 236, 1.2) + dot(108, 150, 1.3), kind: WP, t: 1.25 },
  // la otra mano
  { d: "M158 160 C168 154 180 158 182 168 C178 174 170 174 164 170", kind: W, t: 0.65 },
  // barba
  { d: "M118 114 C112 126 116 140 110 154 C106 166 108 176 102 188 C110 182 114 180 116 192 C120 182 122 176 128 186 C128 176 132 168 136 176 C136 162 140 150 138 138 C138 128 142 120 144 112 Z", kind: W, t: 0.95 },
  { d: "M124 128 C122 144 120 158 116 176 M132 128 C131 142 130 152 128 168", kind: S, t: 1.15, w: 2.6 },
  // nariz larga hacia la varita
  { d: "M126 104 C110 104 92 106 72 112 C88 118 108 120 128 117 Z", kind: W, t: 1.1 },
  // sombrero macizo con la punta vencida y manchas blancas
  { d: "M118 96 C124 72 136 46 150 22 C154 14 160 10 166 12 C160 16 158 22 158 32 C158 56 160 76 166 97 C150 102 132 101 118 96 Z", kind: KK, t: 1.2 },
  { d: dot(142, 58, 2.6, 3.2) + dot(153, 38, 2, 2.6) + dot(136, 82, 2.8, 2.4) + dot(155, 76, 2.2, 2.8), kind: WP, t: 1.55 },
  { d: "M110 97 C128 104 150 105 174 96", kind: S, t: 1.45, w: 5 },
  // el gato gris, a la derecha
  { d: CAT_TAIL, kind: S, t: 1.6, w: 4 },
  { d: CAT_BODY, kind: G, t: 1.65, w: 3 },
  { d: dot(186, 243, 2.4, 2.8) + dot(199, 243, 2.4, 2.8), kind: K, t: 2.0 },
  { d: CAT_NOSE, kind: S, t: 2.05, w: 1.8 },
  // el gato de manchas, a la izquierda, mirando al mago
  { d: mirror(CAT_TAIL), kind: S, t: 1.7, w: 4 },
  { d: mirror(CAT_BODY), kind: W, t: 1.75, w: 3 },
  { d: dot(238 - 180, 264, 6, 5) + dot(238 - 196, 270, 4.5, 3.5) + dot(238 - 199, 255, 3.5, 3) + dot(238 - 203, 236, 3.4, 4), kind: K, t: 2.05 },
  { d: dot(238 - 186, 243, 2.4, 2.8) + dot(238 - 199, 243, 2.4, 2.8), kind: K, t: 2.1 },
  { d: mirror(CAT_NOSE), kind: S, t: 2.15, w: 1.8 },
];

/** El ojo, aparte: es el que parpadea. */
const WIZARD_DOTS: { cx: number; cy: number; rx: number; ry: number; t: number }[] = [
  { cx: 136, cy: 108, rx: 2.8, ry: 2.8, t: 1.5 },
];

/** Las partes del brazo (contiguas en el orden de dibujo) juntas en un array, el resto sueltas. */
function groupArm(parts: Part[]) {
  const out: (Part | Part[])[] = [];
  for (const part of parts) {
    const last = out[out.length - 1];
    if (part.arm && Array.isArray(last)) last.push(part);
    else out.push(part.arm ? [part] : part);
  }
  return out;
}

/** Cuánto tarda el mago en quedar dibujado: después empiezan las chispas. */
export const WIZARD_DRAWN = 2.2;

/*
 * Chispas de la varita, dentro del propio SVG del mago para que sigan a la punta
 * aunque el dibujo se escale o se encuadre con márgenes. En un elemento SVG las
 * longitudes de un `transform` de CSS van en unidades del viewBox, así que --dx y
 * --dy escalan con el mago. Salen hacia la izquierda, adonde apunta la varita.
 */
const SPARKS = noise("wand", 30);
const WAND_SPARKS = Array.from({ length: 9 }, (_, k) => {
  const a = ((185 + SPARKS[k] * 55) * Math.PI) / 180;
  const dist = 44 + Math.abs(SPARKS[k + 9]) * 46;
  return {
    dx: f(Math.cos(a) * dist),
    dy: f(Math.sin(a) * dist),
    size: f(4.5 + Math.abs(SPARKS[k + 18]) * 4.5),
    delay: f((k * 2.4) / 9),
  };
});

export function Wizard({
  id = "wizard",
  animate = true,
  sparkles = true,
  className = "",
  title,
}: {
  /** Prefijo del id del filtro: único si hay más de un mago en la página. */
  id?: string;
  animate?: boolean;
  /** Chispas en bucle desde la punta de la varita. */
  sparkles?: boolean;
  className?: string;
  title?: string;
}) {
  const filter = `${id}-ink`;
  const renderPart = (part: Part, key: number | string) => {
    const { kind } = part;
    // Los macizos y los puntos caen de golpe; lo demás se dibuja trazo a trazo y,
    // si lleva relleno de color (tinta, gris), se rellena cuando el contorno ya está.
    const popped = animate && (kind === K || kind === WP);
    const drawn = animate && !popped;
    const filled = animate && (kind === KK || kind === G);
    const fill = kind === W ? "#FFFFFF" : kind === G ? CAT_GREY : kind === K || kind === KK ? "currentColor" : kind === WP ? "#FFFFFF" : "none";
    const stroke = kind === K || kind === WP ? "none" : kind === WS ? "#FFFFFF" : "currentColor";
    return (
      <path
        key={key}
        d={part.d}
        pathLength={popped ? undefined : 1}
        fill={fill}
        stroke={stroke}
        strokeWidth={part.w ?? 3.6}
        className={`${drawn ? "ink-line ink-draw" : ""} ${filled ? "ink-fill" : ""} ${popped ? "origin-center animate-pop [transform-box:fill-box]" : ""}`}
        style={
          (drawn ? { "--d": `${part.t}s`, "--f": `${part.t + 0.45}s` } : popped ? { animationDelay: `${part.t}s` } : undefined) as
            | CSSProperties
            | undefined
        }
      />
    );
  };
  return (
    <svg
      viewBox="0 0 240 290"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={`block h-full w-full overflow-visible ${className}`}
    >
      <defs>
        {/* Ondula el borde del trazo como la tinta en papel. Solo desplaza: no desenfoca. */}
        <filter id={filter} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={2} seed={7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={3.2} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter={`url(#${filter})`} strokeLinecap="round" strokeLinejoin="round">
        {groupArm(WIZARD).map((item, i) =>
          Array.isArray(item) ? (
            // El brazo, la mano y la varita: el minijuego lo hace girar desde el hombro.
            <g key={`arm-${i}`} className="wizard-arm">
              {item.map((part, j) => renderPart(part, `${i}-${j}`))}
            </g>
          ) : (
            renderPart(item, i)
          ),
        )}
        {WIZARD_DOTS.map((dot, i) => (
          <ellipse
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            rx={dot.rx}
            ry={dot.ry}
            fill="currentColor"
            className={`${i === 0 ? "wizard-eye" : ""} ${animate ? "origin-center animate-pop [transform-box:fill-box]" : ""}`}
            style={animate ? { animationDelay: `${dot.t}s` } : undefined}
          />
        ))}
      </g>
      {sparkles && (
        <g transform="translate(8 180)">
          {WAND_SPARKS.map((spark, k) => (
            <path
              key={k}
              d={`M${-spark.size} 0.6 ${spark.size} -0.6M-0.5 ${-spark.size} 0.5 ${spark.size}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              className="spark animate-spark opacity-0 [transform-box:fill-box] [transform-origin:center]"
              style={
                {
                  "--dx": `${spark.dx}px`,
                  "--dy": `${spark.dy}px`,
                  animationDelay: `${f(WIZARD_DRAWN + spark.delay)}s`,
                } as CSSProperties
              }
            />
          ))}
        </g>
      )}
    </svg>
  );
}
