import Link from "next/link";
import Image from "next/image"; // Importamos el componente optimizado de Next.js

export default function PhotographyPage() {
  
  // AQUÍ CONFIGURAS TUS FOTOS REALES
  // Asegúrate de que los nombres de archivo (src) coincidan con los que subiste a public/images
  const photos = [
    { 
      id: 1, 
      src: "/images/foto1.jpg", 
      alt: "Descripción de la foto 1", 
      title: "Urban Silence" 
    },
    { 
      id: 2, 
      src: "/images/foto2.jpg", 
      alt: "Descripción de la foto 2", 
      title: "Neon Lights" 
    },
    { 
      id: 3, 
      src: "/images/foto3.jpg", 
      alt: "Descripción de la foto 3", 
      title: "Nature" 
    },
    { 
      id: 4, 
      src: "/images/foto4.jpg", 
      alt: "Descripción de la foto 4", 
      title: "Architecture" 
    },
    { 
      id: 5, 
      src: "/images/foto5.jpg", 
      alt: "Descripción de la foto 5", 
      title: "Portrait" 
    },
  ];

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto text-offblack bg-bone flex flex-col">
      
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

        {/* FOTOS REALES */}
        {photos.map((photo, index) => (
          <div 
            key={photo.id}
            // La primera foto ocupa 2 espacios en escritorio (aspect-[16/9]), las demás son verticales
            className={`relative rounded-2xl overflow-hidden border border-softgray/20 group hover:shadow-xl transition-all duration-300 ${
              index === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/5]'
            }`}
          >
            {/* COMPONENTE DE IMAGEN DE NEXT.JS */}
            {/* 'fill' hace que la imagen llene el contenedor. 'object-cover' hace que no se deforme */}
            <Image 
              src={photo.src} 
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Capa oscura al pasar el ratón + Título */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <span className="text-bone font-bold uppercase tracking-widest text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
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
    </main>
  );
}