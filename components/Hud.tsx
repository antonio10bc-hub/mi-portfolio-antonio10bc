/*
 * Vocabulario gráfico de la dirección de arte "Specimen File" (docs/art-direction).
 * Todo es decorativo (aria-hidden) y toma el color de `currentColor`, así que el
 * padre decide si se pinta en tinta o en papel. Las piezas pseudoaleatorias
 * (código de barras, tabla de datos) se derivan de una semilla de texto: son
 * deterministas, de modo que el HTML del servidor y el del cliente coinciden.
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

/** Marco de visor: cuatro esquinas en L, sin lados. El padre debe ser `relative`. */
export function Brackets({
  size = 28,
  weight = 2,
  inset = 0,
  className = "",
}: {
  size?: number;
  weight?: number;
  inset?: number;
  className?: string;
}) {
  const box = { width: size, height: size, borderWidth: 0, borderStyle: "solid" } as const;
  const w = `${weight}px`;
  return (
    <span aria-hidden className={`pointer-events-none absolute ${className}`} style={{ inset }}>
      <span className="absolute left-0 top-0 border-current" style={{ ...box, borderTopWidth: w, borderLeftWidth: w }} />
      <span className="absolute right-0 top-0 border-current" style={{ ...box, borderTopWidth: w, borderRightWidth: w }} />
      <span className="absolute bottom-0 left-0 border-current" style={{ ...box, borderBottomWidth: w, borderLeftWidth: w }} />
      <span className="absolute bottom-0 right-0 border-current" style={{ ...box, borderBottomWidth: w, borderRightWidth: w }} />
    </span>
  );
}

/** Esquina de página: una L gruesa. */
export function CornerMark({
  corner,
  size = 72,
  className = "",
}: {
  corner: "tl" | "tr" | "bl" | "br";
  size?: number;
  className?: string;
}) {
  const w = "7px";
  const sides = {
    tl: { borderTopWidth: w, borderLeftWidth: w },
    tr: { borderTopWidth: w, borderRightWidth: w },
    bl: { borderBottomWidth: w, borderLeftWidth: w },
    br: { borderBottomWidth: w, borderRightWidth: w },
  }[corner];
  return (
    <span
      aria-hidden
      className={`pointer-events-none block border-current ${className}`}
      style={{ width: size, height: size, borderWidth: 0, borderStyle: "solid", ...sides }}
    />
  );
}

/** "● ● ●": cabecera de panel. */
export function Dots({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`flex items-center gap-1.5 ${className}`}>
      <span className="h-2 w-2 rounded-full bg-current" />
      <span className="h-2 w-2 rounded-full bg-current" />
      <span className="h-2 w-2 rounded-full bg-current" />
    </span>
  );
}

/** Código de barras derivado de `seed`. Ocupa el ancho del padre. */
export function Barcode({ seed, className = "" }: { seed: string; className?: string }) {
  const bars: { x: number; width: number }[] = [];
  let x = 0;
  for (const v of sequence(seed, 34)) {
    const width = 1 + (v % 4);
    bars.push({ x, width });
    x += width + 1 + ((v >> 3) % 3);
  }
  return (
    <svg aria-hidden viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" className={`block ${className}`}>
      {bars.map((bar, i) => (
        <rect key={i} x={bar.x} y={0} width={bar.width} height={40} fill="currentColor" />
      ))}
    </svg>
  );
}

/**
 * Tabla de barras de datos, como la columna derecha de la referencia: filas de
 * un guion y barras de longitud variable, agrupadas en bloques de cuatro.
 */
export function DataBars({ seed, rows = 12, className = "" }: { seed: string; rows?: number; className?: string }) {
  const values = sequence(seed, rows * 4);
  return (
    <div aria-hidden className={`grid grid-cols-4 gap-x-4 ${className}`}>
      {[0, 1, 2, 3].map((col) => (
        <div key={col} className="flex flex-col gap-[3px]">
          {Array.from({ length: rows }, (_, row) => {
            const v = values[col * rows + row];
            const gapAfter = row % 4 === 3 && row < rows - 1;
            return (
              <div key={row} className={`flex h-[4px] items-center gap-1 ${gapAfter ? "mb-[7px]" : ""}`}>
                <span className="h-px w-1.5 bg-current" />
                <span className="h-full bg-current" style={{ width: `${30 + (v % 70)}%`, opacity: v % 5 === 0 ? 0.25 : 1 }} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** Rombos agrupados. */
export function Diamonds({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 28 28" className={`block h-7 w-7 ${className}`} fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path d="M14 3 18 7 14 11 10 7Z" />
      <path d="M7 10 11 14 7 18 3 14Z" />
      <path d="M21 10 25 14 21 18 17 14Z" />
      <path d="M14 17 18 21 14 25 10 21Z" />
    </svg>
  );
}

/** Columna de aspas. */
export function XStack({ count = 3, className = "" }: { count?: number; className?: string }) {
  return (
    <span aria-hidden className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} viewBox="0 0 16 16" className="h-4 w-4" stroke="currentColor" strokeWidth={2.6}>
          <path d="M2 2 14 14M14 2 2 14" />
        </svg>
      ))}
    </span>
  );
}

/** Glifo pixelado de 3x3 a partir de una máscara de 9 bits (1 = cuadro relleno). */
export function PixelGlyph({ mask = 0b101010101, className = "" }: { mask?: number; className?: string }) {
  return (
    <span aria-hidden className={`grid h-6 w-6 grid-cols-3 ${className}`}>
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className={mask & (1 << (8 - i)) ? "bg-current" : ""} />
      ))}
    </span>
  );
}

/** "////" seguido de un texto, como "////2025" en la referencia. */
export function Slashes({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`code flex items-center gap-2 ${className}`}>
      <span aria-hidden className="tracking-[-0.2em]">{"////"}</span>
      {children}
    </span>
  );
}

/**
 * Línea de referencia: tramo horizontal, quiebro a 45° y un punto en cada
 * extremo. Medidas en px; `drop` es lo que baja el quiebro.
 */
export function Leader({
  length = 220,
  drop = 40,
  className = "",
}: {
  length?: number;
  drop?: number;
  className?: string;
}) {
  const r = 6;
  const run = length - drop;
  return (
    <svg
      aria-hidden
      width={length + r * 2}
      height={drop + r * 2}
      viewBox={`${-r} ${-r} ${length + r * 2} ${drop + r * 2}`}
      className={`block overflow-visible ${className}`}
    >
      <path d={`M0 0H${run}L${length} ${drop}`} fill="none" stroke="currentColor" strokeWidth={2} />
      <circle cx={0} cy={0} r={r} fill="currentColor" />
      <circle cx={length} cy={drop} r={r} fill="currentColor" />
    </svg>
  );
}

/** Flecha en ángulo recto (↗ o →) para enlaces. */
export function Arrow({ direction = "out", className = "" }: { direction?: "out" | "right" | "left"; className?: string }) {
  const d = {
    out: ["M7 17 17 7", "M8 7h9v9"],
    right: ["M4 12h16", "m13 5 7 7-7 7"],
    left: ["M20 12H4", "m11 19-7-7 7-7"],
  }[direction];
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" className={`block h-4 w-4 ${className}`}>
      <path d={d[0]} />
      <path d={d[1]} />
    </svg>
  );
}
