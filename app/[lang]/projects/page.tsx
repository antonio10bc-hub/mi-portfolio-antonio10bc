import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { PERSON, SITE_URL, listJoin } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { Cross, GamepadDoodle, InkArrow } from "@/components/Ink";
import { InkFrame, ScribbleCircle } from "@/components/InkBox";
import ProjectCard from "@/components/ProjectCard";
import SectionHeader from "@/components/SectionHeader";
import SpecList from "@/components/SpecList";
import { PROJECTS } from "@/lib/projects";
import { dictFor, type Dict } from "@/lib/i18n";

const count = String(PROJECTS.length).padStart(2, "0");
const anchorOf = (index: number) => `game-${index + 1}`;

/**
 * Índice bajo la intro: cada juego con su número y un salto a su entrada. Solo en
 * escritorio, donde la columna izquierda de la cabecera tiene sitio.
 */
function Contents({ t }: { t: Dict }) {
  return (
    <nav aria-label={t.contents} className="mt-8 hidden max-w-md md:block">
      <span className="note text-ink">{t.contents}</span>
      <ol className="mt-2">
        {PROJECTS.map((project, index) => (
          <li key={project.name}>
            <a href={`#${anchorOf(index)}`} className="group flex items-baseline gap-3 py-1.5 text-ink">
              <span className="hand w-5 shrink-0 font-bold">{index + 1}.</span>
              <span className="hand relative">
                {project.name}
                {/* Al pasar el ratón, el nombre se subraya con un trazo recto a mano. */}
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-ink transition-transform duration-500 ease-smooth group-hover:scale-x-100"
                />
              </span>
              <span aria-hidden className="min-w-4 flex-1 -translate-y-1 border-b-2 border-dotted border-ink/30" />
              <InkArrow seed={`contents-${index}`} direction="down" className="h-4 w-6 shrink-0 text-mute transition-colors duration-300 group-hover:text-ink" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Fin del cuaderno de juegos, en la celda que deja libre un número impar (o a
 * todo el ancho con uno par): "fin" rotulado, la letra pequeña común a todos los
 * juegos y una salida a Fotografía. Sin imágenes: es el final de los juegos.
 */
function TheEnd({ t, className = "" }: { t: Dict; className?: string }) {
  return (
    <div className={`ink-host relative flex min-h-[20rem] flex-col justify-between gap-10 p-5 text-ink md:p-10 ${className}`}>
      <InkFrame seed="the-end" scroll outset={0} width={2.8} />
      <div>
        <span className="note flex items-center gap-2">
          <Cross className="h-3 w-3" />
          {t.endNote}
        </span>
        <p className="hand-display mt-3 text-[clamp(4rem,8vw,7.5rem)]">{t.endTitle}</p>
      </div>

      <SpecList
        title={t.finePrint}
        rows={[
          [t.gamesTitle, count],
          [t.platform, t.browser],
          [t.install, t.none],
          [t.price, t.free],
        ]}
      />

      <Link
        href="/photography"
        data-track="next_file_clicked"
        data-track-section="photography"
        className="group flex w-fit flex-wrap items-center gap-x-3 gap-y-1"
      >
        <span className="note w-full sm:w-auto">{t.nextUp}:</span>
        <span className="relative">
          <ScribbleCircle seed="the-end-link" width={2.2} hover />
          <span className="hand-display block text-[1.75rem]">{t.photoPanelTitle}</span>
        </span>
        <InkArrow seed="the-end-arrow" className="h-4 w-12 transition-transform duration-500 ease-spring group-hover:translate-x-2" />
      </Link>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = dictFor(lang);
  return pageMetadata(lang, { title: t.gamesMetaTitle, description: t.gamesMetaDescription(listJoin(PROJECTS.map((p) => p.name), t.and)), path: "/projects" });
}

export default async function ProjectsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = dictFor(lang);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t.gamesMetaTitle,
    itemListElement: PROJECTS.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoGame",
        name: project.name,
        url: project.href,
        description: lang === "es" ? project.taglineEs : project.tagline,
        image: `${SITE_URL}${project.screenshot}`,
        gamePlatform: "Web browser",
        applicationCategory: "Game",
        operatingSystem: "Any",
        author: { "@type": "Person", name: PERSON.name, url: SITE_URL },
        offers: { "@type": "Offer", price: 0, priceCurrency: "EUR" },
      },
    })),
  };
  return (
    <div className="min-h-screen-safe w-full bg-paper font-sans text-ink">
      <div className="page flex min-h-screen-safe flex-col py-5 md:py-8">
        <JsonLd data={jsonLd} />
        <TopBar lang={lang} current="games" />

        <SectionHeader
          className="reveal mt-10 md:mt-16"
          eyebrow={t.gamesEyebrow}
          title={t.gamesTitle}
          intro={t.gamesIntro}
          contents={<Contents t={t} />}
          aside={<GamepadDoodle className="w-[min(100%,22rem)] -rotate-6" />}
        />

        <div className="mt-6 grid grid-cols-1 gap-x-14 gap-y-20 md:mt-10 md:grid-cols-2 md:gap-y-28">
          {PROJECTS.map((project, index) => (
            <div
              key={project.name}
              id={anchorOf(index)}
              className="reveal scroll-mt-10"
              style={{ animationDelay: `${80 + index * 70}ms` }}
            >
              <ProjectCard project={project} index={index} t={t} lang={lang} />
            </div>
          ))}

          {/* Con un número impar de juegos ocupa la celda libre de la última fila;
              con uno par, va a todo el ancho. */}
          <TheEnd t={t} className={`reveal ${PROJECTS.length % 2 === 0 ? "md:col-span-2" : ""}`} />
        </div>

        <Footer lang={lang} className="mt-24 md:mt-32" />
      </div>
    </div>
  );
}
