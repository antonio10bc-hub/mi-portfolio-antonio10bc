import { CATEGORY_LABEL, type Project } from "@/lib/projects";

/*
 * Tres elipses superpuestas en vez de un circulo: la silueta resultante es
 * irregular y cubre la tarjeta entera, no solo una esquina. Sin `filter: blur()`,
 * que era el mayor coste de GPU y el origen de los artefactos en Safari iOS.
 * La elipse inferior izquierda es la mas debil a proposito: es la zona donde
 * se apoya el texto de la tarjeta.
 */
const blobStyle = (accent: string) =>
  [
    `radial-gradient(ellipse 62% 88% at 88% 6%, ${accent}e0 0%, ${accent}96 30%, ${accent}45 58%, ${accent}00 82%)`,
    `radial-gradient(ellipse 78% 62% at 52% 52%, ${accent}a8 0%, ${accent}63 34%, ${accent}26 64%, ${accent}00 88%)`,
    `radial-gradient(ellipse 58% 70% at 12% 96%, ${accent}82 0%, ${accent}47 36%, ${accent}1a 66%, ${accent}00 90%)`,
    `radial-gradient(ellipse 44% 52% at 30% 18%, ${accent}70 0%, ${accent}33 42%, ${accent}00 78%)`,
  ].join(", ");

function ArrowBadge() {
  return (
    <span
      aria-hidden
      className="relative flex h-9 w-9 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-full
                 border border-offblack/10 bg-white/50 text-offblack
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
      className="group glass relative flex h-full flex-col gap-8 overflow-hidden rounded-4xl p-6 md:gap-10 md:p-8
                 transition-[transform,box-shadow] duration-500 ease-smooth
                 hover:-translate-y-1.5 hover:shadow-lift motion-reduce:hover:translate-y-0"
    >
      {/* Blob de acento del proyecto. En reposo apenas se intuye; al pasar el
          ratón sube de intensidad y crece, que es todo el efecto de hover. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 opacity-25
                   transition-[opacity,transform] duration-700 ease-smooth
                   group-hover:scale-105 group-hover:opacity-80 motion-reduce:group-hover:scale-100"
        style={{ backgroundImage: blobStyle(project.accent) }}
      />

      {/* Cabecera: índice y flecha */}
      <div className="relative flex items-start justify-between gap-4">
        <span className="font-mono text-[11px] tracking-label text-softblack transition-colors duration-500 ease-smooth group-hover:text-offblack">
          {String(index + 1).padStart(2, "0")}
        </span>
        <ArrowBadge />
      </div>

      {/* Pie: identidad del proyecto */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: project.accent }}
          />
          <span className="label transition-colors duration-500 ease-smooth group-hover:text-offblack">
            {CATEGORY_LABEL[project.category]}
          </span>
        </div>

        <h2 className="mt-2.5 text-3xl md:text-[2.375rem] font-semibold leading-[1.02] tracking-tight text-offblack">
          {project.name}
        </h2>

        <p className="mt-2.5 text-sm leading-relaxed text-softblack transition-colors duration-500 ease-smooth group-hover:text-offblack">
          {project.tagline}
        </p>
      </div>
    </a>
  );
}
