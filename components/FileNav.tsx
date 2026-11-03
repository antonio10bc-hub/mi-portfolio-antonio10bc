import Link from "next/link";
import BackLink from "@/components/BackLink";
import { ScribbleCircle } from "@/components/InkBox";
import type { Dict } from "@/lib/i18n";

/**
 * Fila superior de las páginas interiores: "volver" a la izquierda y, en
 * escritorio, las dos secciones a la derecha. La actual va rodeada con un círculo
 * a mano, que se dibuja al llegar; las otras lo dibujan al pasar el ratón.
 */
export default function FileNav({ t, current }: { t: Dict; current: "photography" | "games" }) {
  const sections = [
    { key: "photography", label: t.photoPanelTitle, href: "/photography" },
    { key: "games", label: t.gamesPanelTitle, href: "/projects" },
  ] as const;

  return (
    <div className="flex items-center justify-between gap-4">
      <BackLink label={t.back} />
      <nav aria-label={t.sections} className="hidden items-center gap-10 pr-4 md:flex">
        {sections.map((section) => {
          const active = section.key === current;
          return (
            <Link
              key={section.key}
              href={section.href}
              aria-current={active ? "page" : undefined}
              className="group relative text-lg font-semibold text-ink"
            >
              <ScribbleCircle seed={`nav-${section.key}`} width={2.2} draw={active} delay={0.6} hover={!active} />
              {section.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
