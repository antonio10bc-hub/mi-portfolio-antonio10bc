import GameMedia from "@/components/GameMedia";
import { InkArrow, InkBlob } from "@/components/Ink";
import { InkFrame, ScribbleCircle } from "@/components/InkBox";
import type { Project } from "@/lib/projects";
import type { Dict } from "@/lib/i18n";

/**
 * Un juego como entrada de cuaderno: su número en una mancha de tinta, la captura
 * (y el vídeo) pegada un poco torcida dentro de un marco a mano que se dibuja al
 * llegar con el scroll, el nombre rotulado, la descripción y "jugar", que se rodea
 * con un círculo al pasar el ratón. La captura va a todo color: es el contenido.
 * Al pasar el ratón la foto se endereza; el `transform` de la ficha en sí nunca se
 * anima (las entradas van en el envoltorio de la página).
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
  const number = index + 1;
  // Torcida a un lado o al otro según la posición, como pegada a mano.
  const tilt = index % 2 === 0 ? "-rotate-[1.2deg]" : "rotate-[1deg]";

  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      data-track="game_clicked"
      data-track-game={project.name}
      data-track-position={number}
      className="group flex h-full flex-col text-ink"
    >
      <div className="flex items-center gap-3">
        <InkBlob seed={`blob-${project.name}`} className="h-10 w-10 text-ink md:h-11 md:w-11">
          <span className="text-sm font-extrabold text-paper md:text-base">{number}</span>
        </InkBlob>
        <span className="note">{t.game}</span>
      </div>

      <div
        className={`ink-host relative mt-5 transition-transform duration-700 ease-spring group-hover:rotate-0 ${tilt}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden" style={{ backgroundColor: project.tint }}>
          {/* Las capturas ya son WebP de 1280px optimizados: se sirven tal cual, sin
              pasar por el optimizador. Las dos primeras se piden ya. Encima, el vídeo
              del juego en bucle (GameMedia). */}
          <div className="absolute inset-0 transition-transform duration-700 ease-smooth group-hover:scale-[1.03] motion-reduce:group-hover:scale-100">
            <GameMedia
              screenshot={project.screenshot}
              video={project.video}
              alt={t.screenshot(project.name)}
              priority={index < 2}
            />
          </div>
        </div>
        <InkFrame seed={`frame-${project.name}`} scroll outset={6} width={2.8} />
      </div>

      <h2 className="hand-display mt-8 text-[clamp(2.5rem,5.5vw,4.5rem)]">{project.name}</h2>

      <p className="hand mt-3 flex-1 text-mute">{lang === "es" ? project.taglineEs : project.tagline}</p>

      <span className="mt-5 flex items-center gap-2">
        <span className="relative">
          <ScribbleCircle seed={`play-${project.name}`} width={2.4} hover />
          <span className="hand-display block text-[1.75rem] md:text-[2rem]">{t.play}</span>
        </span>
        <InkArrow
          seed={`play-${project.name}-arrow`}
          className="h-4 w-12 transition-transform duration-500 ease-spring group-hover:translate-x-2 md:h-5 md:w-14"
        />
      </span>
    </a>
  );
}
