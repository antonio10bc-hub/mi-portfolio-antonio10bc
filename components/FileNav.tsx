import Link from "next/link";
import BackLink from "@/components/BackLink";
import { Scribble } from "@/components/InkBox";
import type { Dict } from "@/lib/i18n";

/**
 * Fila superior de las páginas interiores: "volver" a la izquierda y, en
 * escritorio, las dos secciones a la derecha. La actual va subrayada a mano (el
 * trazo se dibuja al llegar); al pasar el ratón las letras bailan. Sin círculos:
 * rodear "photography" y "games" no gustó.
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
              className="group relative text-ink"
            >
              <span className="hand-display block text-2xl">{section.label}</span>
              {active && <Scribble seed={`nav-${section.key}`} width={2.4} draw delay={0.6} className="absolute -bottom-2.5 left-0 h-2.5 w-full" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
