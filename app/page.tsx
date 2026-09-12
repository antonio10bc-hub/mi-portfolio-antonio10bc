import Link from "next/link";
import AnimatedBackground from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";
import { PHOTOS } from "@/lib/photos";
import { PROJECTS } from "@/lib/projects";

type Section = {
  index: string;
  title: string;
  description: string;
  /** Recuento real de la sección, para que la tarjeta diga algo además del título. */
  meta: string;
  href: string;
  span: string;
};

const SECTIONS: Section[] = [
  {
    index: "01",
    title: "Photography",
    description: "Places where I found beauty.",
    meta: `${PHOTOS.length} frames`,
    href: "/photography",
    span: "md:col-span-3",
  },
  {
    index: "02",
    title: "Projects",
    description: "Experiments & code, shipped.",
    meta: `${PROJECTS.length} projects`,
    href: "/projects",
    span: "md:col-span-2",
  },
];

function SectionLink({ section, delay }: { section: Section; delay: number }) {
  return (
    <div className={`reveal min-h-0 ${section.span}`} style={{ animationDelay: `${delay}ms` }}>
      <Link
        href={section.href}
        className="group glass relative flex h-full min-h-0 flex-col justify-between overflow-hidden
                   rounded-4xl p-5 md:p-8 transition-[transform,box-shadow] duration-500 ease-smooth
                   hover:-translate-y-1.5 hover:shadow-lift motion-reduce:hover:translate-y-0"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,rgba(212,255,0,0.22)_0%,transparent_55%)]
                     opacity-0 transition-opacity duration-700 ease-smooth group-hover:opacity-100"
        />

        <div className="relative flex items-start justify-between gap-3">
          <span className="flex items-center gap-2">
            <span className="font-mono text-[11px] tracking-label text-softblack">{section.index}</span>
            <span aria-hidden className="text-softblack/40">/</span>
            <span className="label">{section.meta}</span>
          </span>
          <span
            aria-hidden
            className="flex h-8 w-8 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-full
                       border border-offblack/10 bg-white/50 text-offblack transition-all duration-500 ease-smooth
                       group-hover:border-offblack group-hover:bg-offblack group-hover:text-bone"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 transition-transform duration-500 ease-smooth group-hover:translate-x-[3px]"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </div>

        <div className="relative">
          <h2 className="text-[clamp(1.625rem,4.4vw,3.25rem)] font-semibold uppercase leading-[0.95] tracking-tighter text-offblack">
            {section.title}
          </h2>
          <p className="mt-1.5 text-[clamp(0.75rem,1.35vw,1rem)] leading-snug text-softblack">
            {section.description}
          </p>
        </div>
      </Link>
    </div>
  );
}

export default function Home() {
  return (
    // La home entra entera en pantalla, footer incluido, pero sin recortar:
    // si en algun dispositivo no cupiese, hace scroll en lugar de cortarse.
    <div className="relative min-h-screen-safe w-full bg-sand font-sans text-offblack">
      <AnimatedBackground position="absolute" />

      <main className="relative z-10 mx-auto flex min-h-screen-safe w-full max-w-6xl flex-col gap-3 px-4 py-4 md:gap-5 md:px-8 md:py-7">
        <header className="glass-strong reveal shrink-0 rounded-4xl px-5 py-5 md:px-10 md:py-8">
          <div className="flex items-center gap-2">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-lime" />
            <span className="label">Portfolio</span>
          </div>

          <h1 className="mt-3 text-[clamp(2.75rem,8.5vw,6.5rem)] font-semibold uppercase leading-[0.86] tracking-tighter text-offblack">
            Antonio
          </h1>

          <p className="mt-2 max-w-xl text-[clamp(0.875rem,1.6vw,1.25rem)] leading-snug text-softblack">
            Photography &amp; Creative Game Design.
          </p>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 md:max-h-[26rem] md:grid-cols-5 md:gap-5">
          {SECTIONS.map((section, index) => (
            <SectionLink key={section.href} section={section} delay={140 + index * 90} />
          ))}
        </div>

        <Footer className="mt-auto shrink-0" />
      </main>
    </div>
  );
}
