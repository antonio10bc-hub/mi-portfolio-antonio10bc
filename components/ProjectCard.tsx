import Image from "next/image";
import type { Project } from "@/lib/projects";

function ArrowBadge() {
  return (
    <span
      aria-hidden
      className="relative flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full
                 border border-offblack/10 text-offblack
                 transition-all duration-500 ease-smooth
                 group-hover:border-offblack group-hover:bg-offblack group-hover:text-bone"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 transition-transform duration-500 ease-smooth
                   group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
      >
        <path d="M7 17 17 7" />
        <path d="M9 7h8v8" />
      </svg>
    </span>
  );
}

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group surface relative flex h-full flex-col overflow-hidden rounded-4xl p-2
                 transition-[transform,box-shadow] duration-500 ease-smooth
                 hover:-translate-y-1.5 hover:shadow-lift motion-reduce:hover:translate-y-0"
    >
      {/* Captura real del juego. El radio es el de la tarjeta menos su padding,
          para que las esquinas sean concéntricas; el filo interior la separa del
          papel cuando la captura es clara. */}
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-3xl"
        style={{ backgroundColor: project.tint }}
      >
        <Image
          src={project.screenshot}
          alt={`${project.name} screenshot`}
          fill
          sizes="(min-width: 1152px) 540px, (min-width: 768px) 46vw, 100vw"
          className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-offblack/10" />
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-5 md:px-6 md:pb-6 md:pt-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] tracking-label text-softblack">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span aria-hidden className="text-softblack/40">/</span>
          <span className="label">Game</span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-semibold leading-tight tracking-tight text-offblack">
            {project.name}
          </h2>
          <ArrowBadge />
        </div>

        <p className="mt-2 text-sm leading-relaxed text-softblack">{project.tagline}</p>
      </div>
    </a>
  );
}
