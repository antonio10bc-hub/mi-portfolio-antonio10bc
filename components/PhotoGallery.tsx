"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useState } from "react";
import { Brackets } from "@/components/Hud";
import { track } from "@/lib/analytics";
import { PHOTOS } from "@/lib/photos";
import { DICTS, type Lang } from "@/lib/i18n";

const FEATURED_SIZES = "(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 66vw";
const GRID_SIZES = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className="h-5 w-5 md:h-6 md:w-6"
    >
      <path d={direction === "left" ? "M15 19.5 7.5 12 15 4.5" : "m9 4.5 7.5 7.5L9 19.5"} />
    </svg>
  );
}

export default function PhotoGallery({ lang }: { lang: Lang }) {
  const t = DICTS[lang];
  const altOf = (p: (typeof PHOTOS)[number]) => (lang === "es" ? p.altEs : p.alt);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedPhoto = selectedIndex !== null ? PHOTOS[selectedIndex] : null;
  const closeModal = useCallback(() => setSelectedIndex(null), []);

  const handlePrevious = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((current) =>
      current === null ? null : (current - 1 + PHOTOS.length) % PHOTOS.length
    );
  }, []);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((current) =>
      current === null ? null : (current + 1) % PHOTOS.length
    );
  }, []);

  // Analíticas: cada foto que se ve en el visor (al abrirlo y al pasar con las flechas).
  useEffect(() => {
    if (selectedIndex === null) return;
    const photo = PHOTOS[selectedIndex];
    track("photo_viewed", { photo: photo.title, frame: selectedIndex + 1 });
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") closeModal();
    };

    // Con el visor abierto, el fondo no debe desplazarse.
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, handleNext, handlePrevious, closeModal]);

  return (
    <>
      {PHOTOS.map((photo, index) => {
        const isFirst = index === 0;

        return (
          <button
            key={photo.id}
            type="button"
            onClick={() => {
              track("photo_opened", { photo: photo.title, frame: index + 1 });
              setSelectedIndex(index);
            }}
            aria-label={t.openPhoto(photo.title)}
            style={{ animationDelay: `${120 + Math.min(index, 8) * 60}ms` }}
            // En 3 columnas la destacada no lleva proporción propia: toma el alto de
            // la fila, que marca la foto 4:5 de al lado, y las dos cuadran al píxel
            // (con 16:10 fija quedaba unos 12px más alta que su vecina).
            className={`reveal group relative w-full overflow-hidden bg-panel
                        ${isFirst ? "md:col-span-2 aspect-[16/10] lg:aspect-auto" : "aspect-[4/5]"}`}
          >
            <Image
              src={photo.src}
              alt={altOf(photo)}
              fill
              priority={isFirst}
              sizes={isFirst ? FEATURED_SIZES : GRID_SIZES}
              className="object-cover transition-transform duration-[900ms] ease-smooth group-hover:scale-[1.03]"
            />

            {/* Marco de visor en papel sobre cada foto, como una cámara enfocando. La
                sombra dura en tinta lo mantiene visible sobre cielos claros. */}
            <Brackets
              size={isFirst ? 28 : 22}
              weight={3}
              inset={isFirst ? 16 : 12}
              className="text-paper [filter:drop-shadow(1px_1px_0_rgba(32,30,32,0.45))]"
            />

            {/* Código de fotograma: siempre visible, junto a la esquina superior
                izquierda del marco y alineado con su línea, sin taparla. */}
            <span
              className={`code pointer-events-none absolute bg-ink px-2 py-1 text-[10px] text-paper
                          ${isFirst ? "left-[52px] top-4" : "left-[42px] top-3"}`}
            >
              FR-{String(index + 1).padStart(2, "0")}
            </span>

            {/* El título entra al pasar el ratón; también está en el visor. */}
            <span
              className="code pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between
                         bg-ink px-3 py-2 text-[10px] text-paper transition-transform duration-500 ease-smooth
                         group-hover:translate-y-0"
            >
              {photo.title}
              <span aria-hidden>[+]</span>
            </span>
          </button>
        );
      })}

      {selectedPhoto &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedPhoto.title}
            className="animate-fade-in fixed inset-0 z-50 flex cursor-zoom-out select-none items-center justify-center
                       bg-ink/95 p-4 md:p-10"
            onClick={closeModal}
          >
            <button
              onClick={handlePrevious}
              aria-label={t.previousPhoto}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 p-3 md:left-8 md:p-4
                         border border-paper/30 bg-ink text-paper transition-colors duration-300 hover:bg-paper hover:text-ink"
            >
              <Chevron direction="left" />
            </button>

            <button
              onClick={handleNext}
              aria-label={t.nextPhoto}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 p-3 md:right-8 md:p-4
                         border border-paper/30 bg-ink text-paper transition-colors duration-300 hover:bg-paper hover:text-ink"
            >
              <Chevron direction="right" />
            </button>

            <button
              onClick={closeModal}
              aria-label={t.close}
              className="absolute right-4 top-4 z-10 p-2.5 md:right-8 md:top-8
                         border border-paper/30 bg-ink text-paper transition-colors duration-300 hover:bg-paper hover:text-ink"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter" className="h-5 w-5">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            <figure
              className="relative flex h-full w-full max-w-[90rem] flex-col items-center justify-center gap-5 cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full max-h-[78vh] w-full overflow-hidden">
                <Image
                  src={selectedPhoto.src}
                  alt={altOf(selectedPhoto)}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain"
                />
              </div>

              <figcaption className="code flex items-center gap-3 text-[10px] text-paper/70 md:text-[11px]">
                <span className="text-paper">{selectedPhoto.title}</span>
                <span aria-hidden className="h-3 w-px bg-paper/30" />
                <span>FR-
                  {String((selectedIndex ?? 0) + 1).padStart(2, "0")} / {String(PHOTOS.length).padStart(2, "0")}
                </span>
              </figcaption>
            </figure>
          </div>,
          document.body
        )}
    </>
  );
}
