/**
 * Ficha a mano: un título y filas "término ........ valor" con una línea de
 * puntos. La usan la ficha del visor de Fotografía y el final de Juegos.
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
      <span className="note text-ink">{title}</span>
      <dl className="mt-2">
        {rows.map(([term, value]) => (
          <div key={term} className="flex items-baseline gap-3 py-1.5 text-ink">
            <dt className="hand">{term}</dt>
            <span aria-hidden className="min-w-4 flex-1 -translate-y-1 border-b-2 border-dotted border-ink/30" />
            <dd className="hand font-bold">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
