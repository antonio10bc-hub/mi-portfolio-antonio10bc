import BackLink from "@/components/BackLink";
import Footer from "@/components/Footer";
import { Barcode, DataBars, Diamonds, PixelGlyph, Slashes } from "@/components/Hud";
import ProjectCard from "@/components/ProjectCard";
import SectionHeader from "@/components/SectionHeader";
import { PROJECTS } from "@/lib/projects";
import { dictFor, type Dict } from "@/lib/i18n";

const count = String(PROJECTS.length).padStart(2, "0");

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

export default async function ProjectsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = dictFor(lang);
  return (
    <div className="min-h-screen-safe w-full bg-paper font-sans text-ink">
      <div className="mx-auto flex min-h-screen-safe w-full max-w-6xl flex-col px-4 py-5 md:px-8 md:py-8">
        <BackLink label={t.back} />

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
        />

        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-14 md:mt-14 md:grid-cols-2 md:gap-y-20">
          {PROJECTS.map((project, index) => (
            <div key={project.name} className="reveal" style={{ animationDelay: `${80 + index * 70}ms` }}>
              <ProjectCard project={project} index={index} t={t} lang={lang} />
            </div>
          ))}
        </div>

        <Footer className="mt-16 md:mt-24" />
      </div>
    </div>
  );
}
