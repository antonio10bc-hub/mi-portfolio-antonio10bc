import GameMedia from "@/components/GameMedia";
import { Arrow, Barcode, Brackets, Dots } from "@/components/Hud";
import type { Project } from "@/lib/projects";
import type { Dict } from "@/lib/i18n";

/**
 * Ficha de un juego: código de proyecto, la captura real dentro de un panel
 * gris con marco de visor, el nombre como titular, una regla de tinta, la
 * tagline en texto de datos y la acción. La captura va a todo color: es el
 * contenido, y la regla monocroma es solo para la interfaz.
 */
export default function ProjectCard({
  project,
  index,
  t,
  lang,
}: {
  project: Project;
  index: number;
  t: Dict;
  lang: string;
}) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      data-track="game_clicked"
      data-track-game={project.name}
      data-track-position={index + 1}
      className="group flex h-full flex-col text-ink"
    >
      <div className="flex items-center gap-3">
        <Dots />
        <span className="code text-[11px] md:text-xs">{t.projectCode}: G-{number}</span>
        <span className="label ml-auto text-ink">{t.game}</span>
      </div>

      <div className="relative mt-3 bg-panel p-4 md:p-6">
        <Brackets size={22} weight={2} inset={8} className="z-10 text-ink" />
        <div className="relative aspect-[16/10] overflow-hidden" style={{ backgroundColor: project.tint }}>
          {/* Las capturas ya son WebP de 1280px optimizados: se sirven tal cual desde
              el CDN, sin pasar por el optimizador (que en la primera visita las
              generaba al vuelo y tardaban en aparecer). Las dos primeras se piden ya.
              Encima, el vídeo del juego en bucle (GameMedia). */}
          <div className="absolute inset-0 transition-transform duration-700 ease-smooth group-hover:scale-[1.03] motion-reduce:group-hover:scale-100">
            <GameMedia
              screenshot={project.screenshot}
              video={project.video}
              alt={t.screenshot(project.name)}
              priority={index < 2}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4 border-b-2 border-ink pb-3">
        <h2 className="display text-[clamp(2.5rem,7vw,4.5rem)]">{project.name}.</h2>
        <span className="code shrink-0 text-xs text-mute">#{number}</span>
      </div>

      <p className="datatext mt-3 flex-1">{lang === "es" ? project.taglineEs : project.tagline}</p>

      <div className="mt-5 flex items-center gap-4">
        <span
          className="code inline-flex items-center gap-2 border-2 border-ink px-3 py-1.5 text-[11px]
                     transition-colors duration-300 group-hover:bg-ink group-hover:text-paper"
        >
          {t.play}
          <Arrow className="h-3.5 w-3.5" />
        </span>
        <Barcode seed={project.name} className="hidden h-8 flex-1 md:block" />
      </div>
    </a>
  );
}
