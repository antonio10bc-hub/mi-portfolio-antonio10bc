import Image from "next/image";
import type { PreviewKind, Project } from "@/lib/projects";

/*
 * Una ilustración plana por juego, sobre el color de acento del proyecto.
 * Todas comparten viewBox (16:10) y el mismo lenguaje: formas lisas, sin
 * degradados ni sombras difusas, para que la rejilla se lea como un sistema.
 * Si el proyecto trae `screenshot`, se usa la captura real en su lugar.
 */

const W = 320;
const H = 200;

function Coin() {
  return (
    <>
      {/* Arco de lanzamiento */}
      <path d="M58 150 C 70 40, 150 22, 168 60" fill="none" stroke="#111" strokeOpacity={0.35} strokeWidth={2} strokeDasharray="2 7" strokeLinecap="round" />
      <ellipse cx={118} cy={168} rx={40} ry={6} fill="#111" fillOpacity={0.14} />
      <circle cx={118} cy={104} r={52} fill="#111" />
      <circle cx={118} cy={104} r={42} fill="none" stroke="#B8D900" strokeWidth={1.5} strokeOpacity={0.6} />
      <text x={118} y={120} textAnchor="middle" className="font-sans" fontSize={46} fontWeight={600} fill="#B8D900">
        H
      </text>

      {/* Marcador */}
      <rect x={196} y={50} width={100} height={108} rx={12} fill="#111" />
      <text x={210} y={72} className="font-mono" fontSize={8} letterSpacing={1.4} fill="#B8D900" fillOpacity={0.7}>
        STREAK
      </text>
      {[0.95, 0.7, 0.5].map((width, row) => (
        <g key={row} transform={`translate(210 ${88 + row * 22})`}>
          <text y={7} className="font-mono" fontSize={9} fill="#F6F4EE" fillOpacity={0.6}>
            {row + 1}
          </text>
          <rect x={14} y={0} width={58 * width} height={8} rx={4} fill="#B8D900" fillOpacity={1 - row * 0.25} />
        </g>
      ))}
    </>
  );
}

/* Palos como trazados, no como glifos: el glifo depende de la fuente de cada sistema. */
const SUITS = {
  spade: "M12 2C9 6 3 9.5 3 14c0 2.8 2.2 4.5 4.5 4.5 1.7 0 3-.8 3.8-2L10 22h4l-1.3-5.5c.8 1.2 2.1 2 3.8 2 2.3 0 4.5-1.7 4.5-4.5 0-4.5-6-8-9-12Z",
  heart: "M12 21s-7-4.6-9.5-9C.8 8.6 2.6 4 6.5 4c2.2 0 3.6 1.3 5.5 3.4C13.9 5.3 15.3 4 17.5 4c3.9 0 5.7 4.6 4 8-2.5 4.4-9.5 9-9.5 9Z",
  diamond: "M12 2 20 12 12 22 4 12Z",
};

const CARDS = [
  { rank: "A", suit: SUITS.spade, color: "#111", angle: -14 },
  { rank: "K", suit: SUITS.heart, color: "#E5484D", angle: 0 },
  { rank: "Q", suit: SUITS.diamond, color: "#E5484D", angle: 14 },
];

function Poker() {
  return (
    <>
      {CARDS.map(({ rank, suit, color, angle }) => (
        <g key={rank} transform={`rotate(${angle} 160 260)`}>
          <rect x={122} y={44} width={76} height={108} rx={9} fill="#F6F4EE" />
          <text x={132} y={64} className="font-sans" fontSize={15} fontWeight={600} fill={color}>
            {rank}
          </text>
          <path d={suit} transform="translate(143.2 83.2) scale(1.4)" fill={color} />
        </g>
      ))}

      {/* Fichas */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <ellipse cx={262} cy={162 - i * 7} rx={22} ry={8} fill="#111" />
          <ellipse cx={262} cy={160 - i * 7} rx={22} ry={8} fill="#F6F4EE" />
          <ellipse cx={262} cy={160 - i * 7} rx={14} ry={5} fill="none" stroke="#7C5CFF" strokeWidth={1.5} strokeDasharray="3 3" />
        </g>
      ))}
    </>
  );
}

/* Cada fila es texto monoespaciado: el bosque se dibuja como en el juego. */
const FOREST = [
  "   ^        ^^        ^     ",
  "  ^^^  ^   ^^^^   ^  ^^^  ^ ",
  " ^^^^^^^^ ^^^^^^ ^^^^^^^^^^^",
  "   |   |    ||    |   |   | ",
  ".,'.,~.'.,.'.,~,.'.,.'.~,.'.",
];

function Forest() {
  return (
    <>
      <text x={20} y={30} className="font-mono" fontSize={9} letterSpacing={1.2} fill="#F6F4EE" fillOpacity={0.55}>
        DAY 12
      </text>
      <text x={300} y={30} textAnchor="end" className="font-mono" fontSize={9} letterSpacing={1.2} fill="#F6F4EE" fillOpacity={0.55}>
        FLORA 34 · FAUNA 9
      </text>
      <line x1={20} y1={40} x2={300} y2={40} stroke="#F6F4EE" strokeOpacity={0.15} />

      {FOREST.map((row, i) => (
        <text
          key={i}
          x={160}
          y={82 + i * 19}
          textAnchor="middle"
          xmlSpace="preserve"
          className="font-mono"
          fontSize={15}
          fill={i < 3 ? "#9BE3A8" : "#F6F4EE"}
          fillOpacity={i < 3 ? 1 - i * 0.12 : 0.45}
        >
          {row}
        </text>
      ))}

      {/* El cursor del juego, en lima */}
      <rect x={220} y={164} width={9} height={14} fill="#D4FF00" />
    </>
  );
}

function Golf() {
  return (
    <>
      {/* Green */}
      <path d="M150 74 C 190 40, 290 46, 296 92 C 302 136, 236 152, 196 140 C 150 128, 120 104, 150 74 Z" fill="#F6F4EE" fillOpacity={0.12} />
      {/* Trayectoria caótica de la bola */}
      <path d="M52 166 L 96 128 L 82 104 L 140 116 L 168 82 L 214 104" fill="none" stroke="#F6F4EE" strokeOpacity={0.6} strokeWidth={2} strokeDasharray="2 6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={52} cy={166} r={6} fill="#F6F4EE" />
      {/* Hoyo y bandera */}
      <ellipse cx={226} cy={104} rx={9} ry={4} fill="#111" fillOpacity={0.7} />
      <line x1={226} y1={104} x2={226} y2={50} stroke="#F6F4EE" strokeWidth={2} />
      <path d="M226 50 L 254 59 L 226 68 Z" fill="#D4FF00" />

      {/* Cartas del juego */}
      <g transform="rotate(-10 44 64)">
        <rect x={22} y={30} width={44} height={62} rx={6} fill="#F6F4EE" />
        <text x={44} y={68} textAnchor="middle" className="font-sans" fontSize={16} fontWeight={600} fill="#1F5E38">
          +2
        </text>
      </g>
      <g transform="rotate(8 92 58)">
        <rect x={70} y={26} width={44} height={62} rx={6} fill="#111" />
        <text x={92} y={64} textAnchor="middle" fontSize={18} fill="#D4FF00">
          ↺
        </text>
      </g>
    </>
  );
}

const ILLUSTRATIONS: Record<PreviewKind, () => React.JSX.Element> = {
  coin: Coin,
  poker: Poker,
  forest: Forest,
  golf: Golf,
};

export default function ProjectPreview({ project }: { project: Project }) {
  if (project.screenshot) {
    return (
      <Image
        src={project.screenshot}
        alt=""
        fill
        sizes="(min-width: 1152px) 540px, (min-width: 768px) 46vw, 100vw"
        className="object-cover object-top"
      />
    );
  }

  const Illustration = ILLUSTRATIONS[project.preview];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className="absolute inset-0 h-full w-full"
    >
      <Illustration />
    </svg>
  );
}
