/**
 * Ficha de datos de expediente: un título en microtipografía y filas
 * "término ........ valor" con línea de puntos. La usan la ficha del visor de
 * Fotografía y el cierre de expediente de Juegos.
 */
export default function SpecList({
  title,
  rows,
  className = "",
}: {
  title: string;
  rows: [term: string, value: string][];
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="label text-ink">{title}</span>
      <dl className="mt-2 border-t-2 border-ink">
        {rows.map(([term, value]) => (
          <div key={term} className="flex items-baseline gap-3 border-b border-ink/15 py-2 text-ink">
            <dt className="font-mono text-xs">{term}</dt>
            <span aria-hidden className="min-w-4 flex-1 -translate-y-1 border-b border-dotted border-ink/40" />
            <dd className="code pr-1 text-[11px]">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
