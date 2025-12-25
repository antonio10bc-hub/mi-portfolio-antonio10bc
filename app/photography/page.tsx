"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";

export default function PhotographyPage() {
  
  const photos = [
    { id: 1, src: "/images/foto3.jpg", alt: "Ciudad de noche", title: "City Nights" },
    { id: 4, src: "/images/foto4.jpg", alt: "Río urbano", title: "Urban River" },
    { id: 6, src: "/images/foto6.jpg", alt: "Luz oscura", title: "Minimal Light" },
    { id: 7, src: "/images/foto7.jpg", alt: "Lago y montañas", title: "Lake Mirror" },
    { id: 8, src: "/images/foto8.jpg", alt: "Picos rocosos", title: "Rocky Peaks" },
    { id: 9, src: "/images/foto9.jpg", alt: "Árbol solitario", title: "Solitude" },
    { id: 10, src: "/images/foto10.jpg", alt: "Pueblo medieval", title: "Old Town" },
    { id: 11, src: "/images/foto11.jpg", alt: "Acantilado", title: "Cliffside" },
    { id: 12, src: "/images/foto12.jpg", alt: "Montaña abierta", title: "Highlands" },
    { id: 13, src: "/images/foto13.jpg", alt: "Nieve B&N", title: "Snow Peak" },
    { id: 14, src: "/images/foto14.jpg", alt: "Niebla", title: "Misty Mood" },
    { id: 15, src: "/images/foto15.jpg", alt: "Colina verde", title: "Green Hill" },
    { id: 16, src: "/images/foto16.jpg", alt: "Tormenta", title: "Storm Horizon" },
    { id: 17, src: "/images/foto17.jpg", alt: "Rayos de sol", title: "Sun Rays" },
    { id: 18, src: "/images/foto18.jpg", alt: "Valle", title: "The Valley" },
    { id: 19, src: "/images/foto19.jpg", alt: "Karst oscuro", title: "Dark Karst" },
    { id: 20, src: "/images/foto20.jpg", alt: "Lineas", title: "Abstract Lines" },
    { id: 21, src: "/images/foto21.jpg", alt: "Tierra", title: "Earth Texture" },
  ];

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null;
  const closeModal = () => setSelectedIndex(null);

  const handlePrevious = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    const newIndex = (selectedIndex - 1 + photos.length) % photos.length;
    setSelectedIndex(newIndex);
  }, [selectedIndex, photos.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    const newIndex = (selectedIndex + 1) % photos.length;
    setSelectedIndex(newIndex);
  }, [selectedIndex, photos.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handleNext, handlePrevious]);


  return (
    <div className="relative min-h-screen w-full bg-[#EAE8E0] overflow-x-hidden text-offblack font-sans">
      
      {/* FONDO ANIMADO */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-lime-400/80 to-green-500/80 rounded-full mix-blend-multiply filter blur-[64px] opacity-80 animate-blob"></div>
          <div className="absolute top-[30%] right-0 w-80 h-80 bg-gradient-to-r from-cyan-400/80 to-blue-500/80 rounded-full mix-blend-multiply filter blur-[70px] opacity-80 animate-blob [animation-delay:2s]"></div>
          <div className="absolute -bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-indigo-500/80 to-violet-500/80 rounded-full mix-blend-multiply filter blur-[90px] opacity-80 animate-blob [animation-delay:4s]"></div>
      </div>

      {/* CONTENIDO */}
      <div className="relative z-10 w-full min-h-screen max-w-7xl mx-auto p-4 md:p-8 flex flex-col">
        <div className="mb-6">
            <Link href="/" className="inline-block text-sm md:text-base font-bold uppercase tracking-widest hover:text-lime transition-colors">
            ← Back
            </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 content-start">
            <div className="col-span-1 md:col-span-2 lg:col-span-3 rounded-3xl border border-white/40 p-5 pt-4 flex flex-col justify-center h-auto bg-transparent backdrop-blur-md shadow-sm ring-1 ring-white/30">
                <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none">
                Photography
                </h1>
            </div>

            {photos.map((photo, index) => {
            const isFirst = index === 0;
            const sizesAttr = isFirst 
                ? "(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw" 
                : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

            return (
            <div 
                key={photo.id}
                onClick={() => setSelectedIndex(index)}
                className={`relative rounded-2xl overflow-hidden border border-softgray/20 group hover:shadow-xl transition-all duration-300 cursor-pointer ${
                isFirst ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/5]'
                }`}
            >
                <Image 
                src={photo.src} 
                alt={photo.alt}
                fill
                quality={95}
                sizes={sizesAttr}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lime opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>
                <span className="text-bone font-bold uppercase tracking-widest text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 z-10">
                    {photo.title}
                </span>
                </div>
            </div>
            )})}
        </div>

        <footer className="mt-8 md:mt-12 flex flex-col md:flex-row justify-between text-[10px] md:text-xs text-softgray font-bold uppercase tracking-widest border-t border-softgray/20 pt-6 gap-4">
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <span>© 2025 Antonio Asis Bastos de Cordoba</span>
                <span className="hidden md:inline text-softgray/50">|</span>
                <a href="https://www.instagram.com/antonio10bc/" target="_blank" rel="noopener noreferrer" className="hover:text-offblack transition-colors underline decoration-softgray/50 hover:decoration-offblack">
                Instagram
                </a>
            </div>
            <span>Madrid, ES</span>
        </footer>
      </div>

      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-zoom-out select-none"
          onClick={closeModal}
        >
          <button onClick={handlePrevious} className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-50 text-bone/70 hover:text-lime p-2 md:p-4 hover:bg-white/10 rounded-full transition-all cursor-pointer">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
          </button>
           <button onClick={handleNext} className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-50 text-bone/70 hover:text-lime p-2 md:p-4 hover:bg-white/10 rounded-full transition-all cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
          </button>
          <button onClick={closeModal} className="absolute top-4 right-4 z-50 bg-black/50 text-bone p-2 rounded-full hover:bg-lime hover:text-offblack transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          <div className="relative w-full h-full max-w-6xl max-h-[85vh] rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()} >
            <Image src={selectedPhoto.src} alt={selectedPhoto.alt} fill className="object-contain" quality={95} sizes="100vw" priority />
          </div>
           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-bone text-[10px] md:text-sm uppercase tracking-widest font-bold bg-black/50 px-4 py-2 rounded-full pointer-events-none whitespace-nowrap">
              {selectedPhoto.title}
              <span className="text-bone/60 ml-2 normal-case">
                ({selectedIndex !== null ? selectedIndex + 1 : 0} / {photos.length})
              </span>
           </div>
        </div>
      )}
    </div>
  );
}