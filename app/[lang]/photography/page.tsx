import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import FileNav from "@/components/FileNav";
import Footer from "@/components/Footer";
import { CameraDoodle } from "@/components/Ink";
import NextFile from "@/components/NextFile";
import PhotoGallery from "@/components/PhotoGallery";
import SectionHeader from "@/components/SectionHeader";
import SpecList from "@/components/SpecList";
import { PHOTOS } from "@/lib/photos";
import { dictFor, isLang, type Dict } from "@/lib/i18n";

/** Ficha del visor, bajo la intro: cuántas fotos hay y cómo se recorren. */
function ViewerSpec({ t }: { t: Dict }) {
  return (
    <SpecList
      title={t.viewer}
      className="mt-8 hidden max-w-md md:block"
      rows={[
        [t.framesLabel, String(PHOTOS.length)],
        [t.browse, "← →"],
        [t.close, "Esc"],
      ]}
    />
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
          className="reveal mt-10 md:mt-16"
          eyebrow={t.photoEyebrow}
          title={t.photoTitle}
          intro={t.photoIntro}
          meta={
            <a
              href="https://www.instagram.com/antonio10bc/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @antonio10bc"
              data-track="instagram_clicked"
              className="hand font-semibold text-ink underline decoration-wavy decoration-2 underline-offset-[6px] transition-colors duration-300 hover:text-mute"
            >
              @antonio10bc
            </a>
          }
          contents={<ViewerSpec t={t} />}
          aside={<CameraDoodle className="w-[min(100%,22rem)] rotate-6" />}
        />

        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-12 md:mt-10 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
          <PhotoGallery lang={isLang(lang) ? lang : "en"} />
        </div>

        <NextFile
          href="/projects"
          section="games"
          label={t.nextUp}
          title={t.gamesPanelTitle}
          text={t.gamesPanelText}
          className="mt-20 md:mt-28"
        />

        <Footer lang={lang} className="mt-20 md:mt-28" />
      </div>
    </div>
  );
}
