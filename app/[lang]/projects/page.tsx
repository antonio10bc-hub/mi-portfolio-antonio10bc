import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PERSON, SITE_URL, listJoin } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
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
      <div className="mx-auto flex min-h-screen-safe w-full max-w-6xl flex-col px-4 py-5 md:px-8 md:py-8">
        <JsonLd data={jsonLd} />
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

        <Footer lang={lang} className="mt-16 md:mt-24" />
      </div>
    </div>
  );
}
