import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import BackLink from "@/components/BackLink";
import Footer from "@/components/Footer";
import { Brackets, XStack } from "@/components/Hud";
import PhotoGallery from "@/components/PhotoGallery";
import SectionHeader from "@/components/SectionHeader";
import { dictFor, isLang } from "@/lib/i18n";

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
      <div className="mx-auto flex min-h-screen-safe w-full max-w-6xl flex-col px-4 py-5 md:px-8 md:py-8">
        <BackLink label={t.back} />

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
        />

        <div className="mt-8 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          <PhotoGallery lang={isLang(lang) ? lang : "en"} />
        </div>

        <Footer lang={lang} className="mt-16 md:mt-24" />
      </div>
    </div>
  );
}
