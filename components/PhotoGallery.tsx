"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useState } from "react";
import { PHOTOS } from "@/lib/photos";

const FEATURED_SIZES = "(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 66vw";
const GRID_SIZES = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 md:h-6 md:w-6"
    >
      <path d={direction === "left" ? "M15 19.5 7.5 12 15 4.5" : "m9 4.5 7.5 7.5L9 19.5"} />
    </svg>
  );
}

export default function PhotoGallery() {
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
            onClick={() => setSelectedIndex(index)}
            aria-label={`Open photo: ${photo.title}`}
            style={{ animationDelay: `${120 + Math.min(index, 8) * 60}ms` }}
            className={`reveal group relative w-full overflow-hidden rounded-3xl border border-white/40
                        bg-white/20 shadow-soft transition-shadow duration-500 ease-smooth hover:shadow-lift
                        ${isFirst ? "md:col-span-2 aspect-[16/10]" : "aspect-[4/5]"}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              priority={isFirst}
              sizes={isFirst ? FEATURED_SIZES : GRID_SIZES}
              className="object-cover transition-transform duration-[900ms] ease-smooth group-hover:scale-[1.04]"
            />

            {/* Índice: siempre visible, discreto. */}
            <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-offblack/60 px-2.5 py-1
                             font-mono text-[10px] tracking-label text-bone">
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Pie con degradado: el título entra al pasar el ratón. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-offblack/70 via-offblack/20 to-transparent
                            p-5 pt-14 opacity-0 transition-opacity duration-500 ease-smooth group-hover:opacity-100">
              <div className="flex items-end justify-between gap-3">
                <span className="translate-y-2 font-mono text-[11px] uppercase tracking-label text-bone
                                 transition-transform duration-500 ease-smooth group-hover:translate-y-0">
                  {photo.title}
                </span>
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 translate-y-2 items-center justify-center rounded-full
                             border border-bone/30 text-bone transition-transform duration-500 ease-smooth
                             group-hover:translate-y-0"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                    <path d="M15 3h6v6" />
                    <path d="M10 14 21 3" />
                    <path d="M21 14v7H3V3h7" />
                  </svg>
                </span>
              </div>
            </div>
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
                       bg-offblack/95 p-4 backdrop-blur-xl md:p-10"
            onClick={closeModal}
          >
            <button
              onClick={handlePrevious}
              aria-label="Previous photo"
              className="glass-dark absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full p-3 text-bone/80
                         transition-colors duration-300 hover:text-lime md:left-8 md:p-4"
            >
              <Chevron direction="left" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next photo"
              className="glass-dark absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full p-3 text-bone/80
                         transition-colors duration-300 hover:text-lime md:right-8 md:p-4"
            >
              <Chevron direction="right" />
            </button>

            <button
              onClick={closeModal}
              aria-label="Close"
              className="glass-dark absolute right-4 top-4 z-10 rounded-full p-2.5 text-bone/80
                         transition-colors duration-300 hover:text-lime md:right-8 md:top-8"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            <figure
              className="relative flex h-full w-full max-w-6xl flex-col items-center justify-center gap-5 cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full max-h-[78vh] w-full overflow-hidden rounded-2xl">
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain"
                />
              </div>

              <figcaption className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-label text-bone/70 md:text-[11px]">
                <span className="text-bone">{selectedPhoto.title}</span>
                <span aria-hidden className="h-3 w-px bg-bone/25" />
                <span>
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
