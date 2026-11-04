import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PERSON, SITE_URL, listJoin } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import SectionHeader from "@/components/SectionHeader";
import { PROJECTS } from "@/lib/projects";
import { dictFor } from "@/lib/i18n";

const anchorOf = (index: number) => `game-${index + 1}`;

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
        </div>

        <Footer lang={lang} className="mt-24 md:mt-32" />
      </div>
    </div>
  );
}
