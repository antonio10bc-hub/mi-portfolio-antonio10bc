"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useState } from "react";
import { InkArrow } from "@/components/Ink";
import { InkFrame, ScribbleCircle } from "@/components/InkBox";
import { track } from "@/lib/analytics";
import { PHOTOS } from "@/lib/photos";
import { DICTS, type Lang } from "@/lib/i18n";

const FEATURED_SIZES = "(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 66vw";
const GRID_SIZES = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

/** Cada foto, pegada un poco torcida y siempre igual (la inclinación depende de su posición). */
const TILTS = ["-rotate-[0.8deg]", "rotate-[1.1deg]", "-rotate-[1.3deg]", "rotate-[0.6deg]", "rotate-[1.4deg]", "-rotate-[0.5deg]"];

const pad = (n: number) => String(n).padStart(2, "0");

/** Botón del visor: una flecha o una cruz a mano, rodeada al pasar el ratón. */
function ViewerButton({ label, onClick, className = "", children }: { label: string; onClick: (e: React.MouseEvent) => void; className?: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-label={label} className={`group absolute z-10 p-3 text-ink md:p-4 ${className}`}>
      <ScribbleCircle seed={`viewer-${label}`} width={2.2} hover className="!-inset-1 !h-[calc(100%+0.5rem)] !w-[calc(100%+0.5rem)]" />
      {children}
    </button>
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
            className={`reveal ink-host group flex w-full flex-col text-left ${isFirst ? "md:col-span-2" : ""}`}
          >
            {/* La foto, pegada torcida en su marco a mano (que se dibuja al llegar con
                el scroll). Al pasar el ratón se endereza. En 3 columnas la destacada no
                lleva proporción propia: llena el alto de la fila menos el pie, igual
                que la 4:5 de al lado, y las dos cuadran. */}
            <span
              className={`relative block w-full transition-transform duration-700 ease-spring group-hover:rotate-0
                          ${TILTS[index % TILTS.length]}
                          ${isFirst ? "aspect-[16/10] lg:aspect-auto lg:flex-1" : "aspect-[4/5]"}`}
            >
              <span className="absolute inset-0 overflow-hidden bg-smudge">
                <Image
                  src={photo.src}
                  alt={altOf(photo)}
                  fill
                  priority={isFirst}
                  sizes={isFirst ? FEATURED_SIZES : GRID_SIZES}
                  className="object-cover transition-transform duration-[900ms] ease-smooth group-hover:scale-[1.03]"
                />
              </span>
              <InkFrame seed={`photo-${photo.id}`} scroll outset={6} width={2.6} />
            </span>

            {/* Pie a mano: el título y su número. */}
            <span className="mt-5 flex items-baseline justify-between gap-3 px-1">
              <span className="hand-display text-[1.5rem] md:text-[1.75rem]">{photo.title}</span>
              <span className="note shrink-0">#{pad(index + 1)}</span>
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
                       bg-paper p-4 text-ink md:p-12"
            onClick={closeModal}
          >
            <ViewerButton label={t.previousPhoto} onClick={handlePrevious} className="left-1 top-1/2 -translate-y-1/2 md:left-6">
              <InkArrow seed="viewer-prev" direction="left" className="h-6 w-14 md:h-8 md:w-20" />
            </ViewerButton>

            <ViewerButton label={t.nextPhoto} onClick={handleNext} className="right-1 top-1/2 -translate-y-1/2 md:right-6">
              <InkArrow seed="viewer-next" className="h-6 w-14 md:h-8 md:w-20" />
            </ViewerButton>

            <ViewerButton label={t.close} onClick={closeModal} className="right-2 top-2 md:right-6 md:top-6">
              <svg viewBox="0 0 24 24" className="h-6 w-6 overflow-visible md:h-7 md:w-7" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
                <path d="M4.5 5.5 C9 10 14 15 19.5 18.5 M18.5 4.5 C14 9.5 9.5 14 5 19.5" />
              </svg>
            </ViewerButton>

            <figure
              className="relative flex h-full w-full max-w-[90rem] flex-col items-center justify-center gap-6 cursor-default md:px-20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* La clave reinicia el marco con cada foto: se vuelve a dibujar al pasar. */}
              <div key={selectedPhoto.id} className="relative h-full max-h-[76vh] w-full">
                <Image
                  src={selectedPhoto.src}
                  alt={altOf(selectedPhoto)}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain"
                />
              </div>

              <figcaption className="flex items-baseline gap-4">
                <span className="hand-display text-[1.75rem] md:text-[2.25rem]">{selectedPhoto.title}</span>
                <span className="note">
                  {pad((selectedIndex ?? 0) + 1)} / {pad(PHOTOS.length)}
                </span>
              </figcaption>
            </figure>
          </div>,
          document.body
        )}
    </>
  );
}
