import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto text-offblack bg-bone flex flex-col">
      
      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-[auto_auto] md:grid-rows-[auto_450px] gap-4 md:gap-6 font-sans flex-1">
        
        {/* --- HEADER BLOCK --- */}
        <div className="md:col-span-3 bg-white rounded-3xl border border-softgray/30 p-6 md:p-12 flex flex-col justify-end h-auto">
           <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase mb-2">
            ANTONIO
          </h1>
          {/* Tu configuración de texto preferida */}
          <p className="text-softgray text-base md:text-lg font-medium">
            Photography & Creative Game Design
          </p>
        </div>


        {/* --- FILA INFERIOR --- */}
        
        {/* BLOQUE 1: PHOTOGRAPHY */}
        {/* CAMBIO ALTURA MÓVIL: h-[220px] (antes 400px) */}
        <Link href="/photography" className="md:col-span-2 relative h-[220px] md:h-full group overflow-hidden rounded-3xl border border-softgray/30 bg-white text-offblack hover:bg-lime transition-all duration-500 cursor-pointer block">
          
          <div className="absolute top-6 right-6 border border-current w-10 h-10 rounded-full flex items-center justify-center z-20">
            <span className="font-mono text-lg font-medium">01</span>
          </div>
          
          <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20 w-full">
            <h2 className="text-3xl md:text-5xl font-bold uppercase mb-2 tracking-tight">
              Photography
            </h2>
            <p className="text-softgray font-medium group-hover:text-offblack transition-colors text-sm md:text-base">
              Places where I found beauty.
            </p>
          </div>
        </Link>

        {/* BLOQUE 2: PROJECTS */}
        {/* CAMBIO ALTURA MÓVIL: h-[140px] (antes 250px) */}
        <Link href="/projects" className="md:col-span-1 relative h-[140px] md:h-full group overflow-hidden rounded-3xl border border-softgray/30 bg-offblack text-bone hover:bg-lime hover:text-offblack transition-all duration-500 cursor-pointer block">
          <div className="h-full flex flex-col justify-between p-6 md:p-8">
            <div className="self-end">
              <div className="w-8 h-8 md:w-10 md:h-10 border border-current rounded-full flex items-center justify-center font-mono text-xs md:text-lg">
                 <span>02</span>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl md:text-5xl font-bold uppercase mb-2 tracking-tight">
                Projects
              </h2>
              <p className="text-xs md:text-sm opacity-80 font-medium group-hover:opacity-100">
                Experiments & Code.
              </p>
            </div>
          </div>
        </Link>

      </div>
      
      {/* FOOTER ACTUALIZADO */}
      <footer className="mt-8 md:mt-12 flex flex-col md:flex-row justify-between text-[10px] md:text-xs text-softgray font-bold uppercase tracking-widest border-t border-softgray/20 pt-6 gap-4">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <span>© 2025 Antonio Asis Bastos de Cordoba</span>
            <span className="hidden md:inline text-softgray/50">|</span>
            {/* CAMBIO: Solo subrayado, sin flecha */}
            <a href="https://www.instagram.com/antonio10bc/" target="_blank" rel="noopener noreferrer" className="hover:text-offblack transition-colors underline decoration-softgray/50 hover:decoration-offblack">
              Instagram
            </a>
        </div>
        <span>Madrid, ES</span>
      </footer>

    </main>
  );
}