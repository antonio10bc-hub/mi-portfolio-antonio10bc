"use client"; // ¡IMPORTANTE! Esto convierte el componente en interactivo

import Link from "next/link";
import Image from "next/image";
import { useState } from "react"; // Importamos el "estado" para saber qué foto está abierta

export default function PhotographyPage() {
  
  // ESTADO: Controla qué foto se muestra en pantalla completa.
  // Si es 'null', no hay ninguna abierta.
  // Si tiene datos (ej: {id:1, src...}), se muestra el modal.
  const [selectedPhoto, setSelectedPhoto] = useState<null | typeof photos[0]>(null);

  // FUNCIÓN PARA CERRAR EL MODAL
  const closeModal = () => setSelectedPhoto(null);

  // TUS FOTOS (Mantengo la lista que tenías)
  const photos = [
    { id: 1, src: "/images/city.jpg", alt: "Ciudad de noche con luces de neón", title: "City Nights" },
    { id: 4, src: "/images/foto4.jpg", alt: "Río urbano", title: "Urban River" },
    { id: 6, src: "/images/foto6.jpg", alt: "Luz en la oscuridad", title: "Minimal Light" },
    { id: 7, src: "/images/foto7.jpg", alt: "Lago y montañas", title: "Lake Mirror" },
    { id: 8, src: "/images/foto8.jpg", alt: "Picos de montaña rocosos", title: "Rocky Peaks" },
    { id: 9, src: "/images/foto9.jpg", alt: "Árbol solitario", title: "Solitude" },
    { id: 10, src: "/images/foto10.jpg", alt: "Pueblo medieval panorámico", title: "Old Town" },
    { id: 11, src: "/images/foto11.jpg", alt: "Pueblo en el acantilado", title: "Cliffside" },
    { id: 12, src: "/images/foto12.jpg", alt: "Paisaje de montaña abierto", title: "Highlands" },
    { id: 13, src: "/images/foto13.jpg", alt: "Montaña nevada en blanco y negro", title: "Snow Peak" },
    { id: 14, src: "/images/foto14.jpg", alt: "Montañas con niebla", title: "Misty Mood" },
    { id: 15, src: "/images/foto15.jpg", alt: "Colina verde iluminada", title: "Green Hill" },
    { id: 16, src: "/images/foto16.jpg", alt: "Mar y nubes tormentosas", title: "Storm Horizon" },
    { id: 17, src: "/images/foto17.jpg", alt: "Rayos de sol sobre el agua", title: "Sun Rays" },
    { id: 18, src: "/images/foto18.jpg", alt: "Valle neblinoso", title: "The Valley" },
    { id: 19, src: "/images/foto19.jpg", alt: "Montañas kársticas oscuras", title: "Dark Karst" },
    { id: 20, src: "/images/foto20.jpg", alt: "Textura de campo o líneas", title: "Abstract Lines" },
    { id: 21, src: "/images/foto21.jpg", alt: "Vista aérea o textura de tierra", title: "Earth Texture" },
  ];

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto text-offblack bg-bone flex flex-col relative">
      
      {/* BOTÓN BACK */}
      <div className="mb-6">
        <Link href="/" className="inline-block text-sm md:text-base font-bold uppercase tracking-widest hover:text-lime transition-colors">
          ← Back
        </Link>
      </div>

      {/* GRID CONTENEDOR */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 content-start">
        
        {/* BLOQUE TÍTULO */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-3xl border border-softgray/30 p-6 md:p-10 flex flex-col justify-center h-auto min-h-[150px]">
            <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">
            Photography
            </h1>
        </div>

        {/* FOTOS REALES (MINIATURAS) */}
        {photos.map((photo, index) => (
          <div 
            key={photo.id}
            // AHORA ES CLICABLE: Al hacer clic, guardamos esta foto en el estado 'selectedPhoto'
            onClick={() => setSelectedPhoto(photo)}
            className={`relative rounded-2xl overflow-hidden border border-softgray/20 group hover:shadow-xl transition-all duration-300 cursor-pointer ${
              index === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/5]'
            }`}
          >
            <Image 
              src={photo.src} 
              alt={photo.alt}
              fill
              // MEJORA DE CALIDAD 1: quality={90} para las miniaturas
              quality={90}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Capa de hover con título y un icono de "ampliar" */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lime opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                {/* Icono de lupa/expandir */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 4.5L9 9m11.25 12v4.5m0-4.5h4.5m-4.5 4.5L15.75 15.75" />
                </svg>
               </div>
              <span className="text-bone font-bold uppercase tracking-widest text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 z-10">
                {photo.title}
              </span>
            </div>
          </div>
        ))}

      </div>

      {/* FOOTER */}
      <footer className="mt-8 md:mt-12 flex flex-col md:flex-row justify-between text-xs text-softgray font-bold uppercase tracking-widest border-t border-softgray/20 pt-6 gap-4">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <span>© 2025 Antonio Asis Bastos de Cordoba</span>
            <span className="hidden md:inline text-softgray/50">|</span>
            <a href="https://www.instagram.com/antonio10bc/" target="_blank" rel="noopener noreferrer" className="hover:text-offblack transition-colors">
              Instagram ↗
            </a>
        </div>
        <span>Madrid, ES</span>
      </footer>

      {/* --- MODAL (LIGHTBOX) --- */}
      {/* Solo se muestra si 'selectedPhoto' tiene datos */}
      {selectedPhoto && (
        <div 
          // Fondo oscuro difuminado (backdrop-blur-md) que cubre toda la pantalla (fixed inset-0)
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          onClick={closeModal} // Al hacer clic en el fondo, se cierra
        >
          {/* Contenedor de la imagen grande */}
          <div 
            className="relative w-full h-full max-w-6xl max-h-[90vh] rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Evita que el clic en la imagen cierre el modal
          >
             {/* Botón de cerrar (X) */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-50 bg-black/50 text-bone p-2 rounded-full hover:bg-lime hover:text-offblack transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* IMAGEN GRANDE */}
            <Image 
              src={selectedPhoto.src} 
              alt={selectedPhoto.alt}
              fill
              // MEJORA DE CALIDAD 2: quality={95} para la foto grande.
              // 'object-contain' asegura que se vea la foto entera sin recortes, vertical u horizontal.
              className="object-contain"
              quality={95}
              sizes="100vw" // Le decimos que descargue la versión más grande disponible
              priority // Carga prioritaria para que aparezca rápido
            />
          </div>
           {/* Título de la foto en grande abajo */}
           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-bone text-sm uppercase tracking-widest font-bold bg-black/50 px-4 py-2 rounded-full pointer-events-none">
              {selectedPhoto.title}
           </div>
        </div>
      )}

    </main>
  );
}