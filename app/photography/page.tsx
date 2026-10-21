import Image from "next/image";
import BackLink from "@/components/BackLink";
import Footer from "@/components/Footer";
import { Brackets, XStack } from "@/components/Hud";
import PhotoGallery from "@/components/PhotoGallery";
import SectionHeader from "@/components/SectionHeader";
import { PHOTOS } from "@/lib/photos";

const count = String(PHOTOS.length).padStart(2, "0");

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

export default function PhotographyPage() {
  return (
    <div className="min-h-screen-safe w-full bg-paper font-sans text-ink">
      <div className="mx-auto flex min-h-screen-safe w-full max-w-6xl flex-col px-4 py-5 md:px-8 md:py-8">
        <BackLink />

        <SectionHeader
          className="reveal mt-6 md:mt-8"
          eyebrow="Gallery"
          title="Photography"
          code="File 01 // Frames"
          meta={`${count} frames`}
          intro="Landscapes, cities and the odd quiet corner. Click any frame to open it full screen."
          aside={<HeaderSpecimen />}
        />

        <div className="mt-8 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          <PhotoGallery />
        </div>

        <Footer className="mt-16 md:mt-24" />
      </div>
    </div>
  );
}
