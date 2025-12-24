import Link from "next/link";

export default function PhotographyPage() {
  // Simulamos 5 fotos vacías
  const photos = [1, 2, 3, 4, 5];

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto text-offblack bg-bone flex flex-col">
      
      {/* BOTÓN BACK (Fuera del bloque, más grande) */}
      <div className="mb-6">
        <Link href="/" className="inline-block text-sm md:text-base font-bold uppercase tracking-widest hover:text-lime transition-colors">
          ← Back
        </Link>
      </div>

      {/* GRID CONTENEDOR */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 content-start">
        
        {/* BLOQUE TÍTULO (Ahora solo contiene el texto) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-3xl border border-softgray/30 p-6 md:p-10 flex flex-col justify-center h-auto min-h-[150px]">
            <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">
            Photography
            </h1>
        </div>

        {/* FOTOS */}
        {photos.map((item, index) => (
          <div 
            key={index}
            className={`bg-white rounded-2xl overflow-hidden border border-softgray/20 aspect-[4/5] hover:shadow-xl transition-all duration-300 group relative ${index === 0 ? 'md:col-span-2 aspect-[16/9]' : ''}`}
          >
            <div className="w-full h-full bg-softgray/10 flex items-center justify-center text-softgray group-hover:bg-lime/20 transition-colors">
              <span className="font-mono text-xs uppercase">Photo {item}</span>
            </div>
          </div>
        ))}

      </div>

      {/* FOOTER GLOBAL */}
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