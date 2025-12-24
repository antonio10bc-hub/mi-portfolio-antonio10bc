import Link from "next/link";
import Image from "next/image";

export default function PhotographyPage() {
  
  // LISTA DE FOTOS ACTUALIZADA CON TUS ARCHIVOS REALES
  // He asignado títulos según lo que parecen las miniaturas, puedes cambiarlos a tu gusto.
  const photos = [
    { id: 1, src: "/images/foto1.jpg", alt: "Ciudad de noche con luces de neón", title: "City Nights" },
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
            // La primera foto (foto1) será grande. El resto tamaño estándar.
            className={`relative rounded-2xl overflow-hidden border border-softgray/20 group hover:shadow-xl transition-all duration-300 ${
              index === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/5]'
            }`}
          >
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