import Link from "next/link";
import BackLink from "@/components/BackLink";
import type { Dict } from "@/lib/i18n";

/**
 * Fila superior de las páginas interiores: "Volver" a la izquierda y, en
 * escritorio, los dos expedientes a la derecha para saltar de uno a otro sin
 * pasar por la home. El activo va en tinta maciza, como un botón pulsado.
 * No es una fila de titulares (esa se quitó a propósito): es microtipografía.
 */
export default function FileNav({ t, current }: { t: Dict; current: "photography" | "games" }) {
  const files = [
    { key: "photography", number: "01", label: t.photoTitle, href: "/photography" },
    { key: "games", number: "02", label: t.gamesTitle, href: "/projects" },
  ] as const;

  return (
    <div className="flex items-center justify-between gap-4">
      <BackLink label={t.back} />
      <nav aria-label={t.files} className="hidden items-center gap-2 md:flex">
        {files.map((file) => {
          const active = file.key === current;
          return (
            <Link
              key={file.key}
              href={file.href}
              aria-current={active ? "page" : undefined}
              className={`code border-2 px-3 py-1.5 text-[11px] transition-colors duration-300
                          ${active ? "border-ink bg-ink text-paper" : "border-transparent text-ink hover:border-ink"}`}
            >
              {file.number} <span aria-hidden>{"//"}</span> {file.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
