import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import FileNav from "@/components/FileNav";
import { PHOTOS } from "@/lib/photos";
import { PROJECTS } from "@/lib/projects";
import NextFile from "@/components/NextFile";
import Footer from "@/components/Footer";
import { Brackets, XStack } from "@/components/Hud";
import PhotoGallery from "@/components/PhotoGallery";
import SectionHeader from "@/components/SectionHeader";
import { dictFor, isLang, type Dict } from "@/lib/i18n";

/** Ficha del visor, bajo la intro: cuántos fotogramas hay y cómo se recorren. */
function ViewerSpec({ t }: { t: Dict }) {
  const rows = [
    [t.framesLabel, String(PHOTOS.length).padStart(2, "0")],
    [t.browse, "\u2190 \u2192"],
    [t.close, "Esc"],
  ];
  return (
    <div className="mt-8 hidden max-w-md md:block">
      <span className="label text-ink">{t.viewer}</span>
      <dl className="mt-2 border-t-2 border-ink">
        {rows.map(([term, value]) => (
          <div key={term} className="flex items-baseline gap-3 border-b border-ink/15 py-2 text-ink">
            <dt className="font-mono text-xs">{term}</dt>
            <span aria-hidden className="min-w-4 flex-1 -translate-y-1 border-b border-dotted border-ink/40" />
            <dd className="code pr-1 text-[11px]">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Espécimen de la cabecera: "Snow Peak" tramado, dentro de un marco de visor. */
function HeaderSpecimen() {
  return (
    <div className="relative flex items-center gap-4 text-ink">
      <XStack className="hidden md:flex" />
      <div className="relative flex-1 bg-panel/50 p-3">
        <Brackets size={20} weight={2} />
        <Image
          src="/images/dither/peak.png"
          alt=""
          width={1500}
          height={720}
          unoptimized
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = dictFor(lang);
  return pageMetadata(lang, { title: t.photoMetaTitle, description: t.photoMetaDescription, path: "/photography" });
}

export default async function PhotographyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = dictFor(lang);
  return (
    <div className="min-h-screen-safe w-full bg-paper font-sans text-ink">
      <div className="page flex min-h-screen-safe flex-col py-5 md:py-8">
        <FileNav t={t} current="photography" />

        <SectionHeader
          className="reveal mt-6 md:mt-8"
          eyebrow={t.photoEyebrow}
          title={t.photoTitle}
          code={t.photoCode}
          meta={
            <a
              href="https://www.instagram.com/antonio10bc/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @antonio10bc"
              data-track="instagram_clicked"
              className="normal-case tracking-normal underline decoration-1 underline-offset-4 transition-opacity duration-300 hover:opacity-60"
            >
              @antonio10bc
            </a>
          }
          intro={t.photoIntro}
          aside={<HeaderSpecimen />}
          contents={<ViewerSpec t={t} />}
        />

        <div className="mt-8 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          <PhotoGallery lang={isLang(lang) ? lang : "en"} />
        </div>

        <NextFile
          href="/projects"
          section="games"
          label={t.nextFile}
          code={t.gamesCode}
          title={t.gamesPanelTitle}
          text={t.gamesPanelText}
          // Las capturas ya son WebP de 1280px: tal cual, como en las fichas.
          previews={PROJECTS.map((project) => ({ src: project.screenshot, unoptimized: true }))}
          previewClassName="grid-cols-3 md:grid-cols-5 [&>*]:aspect-[16/10] [&>*:nth-child(n+4)]:hidden md:[&>*:nth-child(n+4)]:block"
          className="mt-14 md:mt-20"
        />

        <Footer lang={lang} className="mt-16 md:mt-24" />
      </div>
    </div>
  );
}
