import AnimatedBackground from "@/components/AnimatedBackground";
import BackLink from "@/components/BackLink";
import Footer from "@/components/Footer";
import PhotoGallery from "@/components/PhotoGallery";
import SectionHeader from "@/components/SectionHeader";
import { PHOTOS } from "@/lib/photos";

export default function PhotographyPage() {
  return (
    <div className="relative min-h-screen-safe w-full bg-sand font-sans text-offblack">
      <AnimatedBackground variant="minimal" />

      <div className="relative z-10 mx-auto flex min-h-screen-safe w-full max-w-6xl flex-col px-4 py-6 md:px-8 md:py-10">
        <BackLink className="mb-6 md:mb-8" />

        <SectionHeader
          className="reveal"
          eyebrow="Gallery"
          title="Photography"
          meta={`${String(PHOTOS.length).padStart(2, "0")} frames`}
          intro="Landscapes, cities and the odd quiet corner. Click any frame to open it full screen."
        />

        <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:grid-cols-2 lg:grid-cols-3 md:gap-5">
          <PhotoGallery />
        </div>

        <Footer className="mt-14 md:mt-20" />
      </div>
    </div>
  );
}
