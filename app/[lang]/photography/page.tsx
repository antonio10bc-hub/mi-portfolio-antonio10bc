import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import NextFile from "@/components/NextFile";
import PhotoGallery from "@/components/PhotoGallery";
import SectionHeader from "@/components/SectionHeader";
import { dictFor, isLang } from "@/lib/i18n";

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
        <TopBar lang={lang} current="photography" />

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
