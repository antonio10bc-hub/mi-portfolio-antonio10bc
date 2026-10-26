import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PERSON, SITE_URL, listJoin } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import FileNav from "@/components/FileNav";
import NextFile from "@/components/NextFile";
import Footer from "@/components/Footer";
import { Barcode, DataBars, Diamonds, PixelGlyph, Slashes } from "@/components/Hud";
import ProjectCard from "@/components/ProjectCard";
import SectionHeader from "@/components/SectionHeader";
import { PROJECTS } from "@/lib/projects";
import { PHOTOS } from "@/lib/photos";
import { dictFor, type Dict } from "@/lib/i18n";

const count = String(PROJECTS.length).padStart(2, "0");

const codeOf = (index: number) => `G-${String(index + 1).padStart(2, "0")}`;

/**
 * Índice real del expediente, bajo la intro: cada juego con su código y un
 * salto a su ficha. Llena la columna izquierda, que en escritorio quedaba vacía
 * frente a la tabla de datos.
 */
function Contents({ t }: { t: Dict }) {
  return (
    <nav aria-label={t.contents} className="mt-8 hidden max-w-md md:block">
      <span className="label text-ink">{t.contents}</span>
      <ol className="mt-2 border-t-2 border-ink">
        {PROJECTS.map((project, index) => (
          <li key={project.name}>
            <a
              href={`#${codeOf(index).toLowerCase()}`}
              className="group flex items-baseline gap-3 border-b border-ink/15 py-2 text-ink transition-colors duration-300 hover:bg-panel"
            >
              <span className="code w-10 shrink-0 text-[11px]">{codeOf(index)}</span>
              <span className="font-mono text-xs">{project.name}</span>
              <span aria-hidden className="min-w-4 flex-1 -translate-y-1 border-b border-dotted border-ink/40" />
              <span className="code pr-1 text-[11px] text-mute transition-colors duration-300 group-hover:text-ink">
                #{String(index + 1).padStart(2, "0")}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Columna de datos de la cabecera: textura, no información. */
function HeaderData({ t }: { t: Dict }) {
  return (
    <div aria-hidden className="hidden text-ink md:block">
      <div className="flex items-center justify-between">
        <Slashes className="text-sm">{t.index}</Slashes>
        <div className="flex items-center gap-3">
          <Diamonds />
          <PixelGlyph mask={0b110011101} />
        </div>
      </div>
      <DataBars seed="projects" className="mt-5" />
      <Barcode seed="antonio-projects" className="mt-5 h-14 w-full" />
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
        <FileNav t={t} current="games" />

        <SectionHeader
          className="reveal mt-6 md:mt-8"
          eyebrow={t.gamesEyebrow}
          title={t.gamesTitle}
          code={t.gamesCode}
          meta={t.games(count)}
          intro={
            <>
              {t.gamesIntro1}
              <br />
              {t.gamesIntro2}
            </>
          }
          aside={<HeaderData t={t} />}
          contents={<Contents t={t} />}
        />

        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-14 md:mt-14 md:grid-cols-2 md:gap-y-20">
          {PROJECTS.map((project, index) => (
            <div
              key={project.name}
              id={codeOf(index).toLowerCase()}
              className="reveal scroll-mt-8"
              style={{ animationDelay: `${80 + index * 70}ms` }}
            >
              <ProjectCard project={project} index={index} t={t} lang={lang} />
            </div>
          ))}

          {/* Con un número impar de juegos ocupa la celda libre de la última fila;
              con uno par, va a todo el ancho. */}
          <NextFile
            href="/photography"
            section="photography"
            label={t.nextFile}
            code={t.photoCode}
            title={t.photoPanelTitle}
            text={t.photoPanelText}
            previews={[0, 2, 4, 6, 8, 12].map((i) => ({ src: PHOTOS[i].src }))}
            className={`reveal ${PROJECTS.length % 2 === 0 ? "md:col-span-2" : ""}`}
          />
        </div>

        <Footer lang={lang} className="mt-16 md:mt-24" />
      </div>
    </div>
  );
}
