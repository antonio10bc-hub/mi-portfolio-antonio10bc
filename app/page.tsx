import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto text-offblack bg-bone">
      
      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-[auto_auto] md:grid-rows-[auto_450px] gap-4 md:gap-6 font-sans">
        
        {/* --- HEADER BLOCK --- */}
        <div className="md:col-span-3 bg-white rounded-3xl border border-softgray/30 p-8 md:p-12 flex flex-col justify-end min-h-[300px] md:min-h-[auto]">
           <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase mb-2">
            ANTONIO
          </h1>
          <p className="text-softgray text-xl md:text-2xl font-medium">
            Photography & Creative Game Design
          </p>
        </div>


        {/* --- FILA INFERIOR --- */}
        
        {/* BLOQUE 1: PHOTOGRAPHY (Enlace interno) */}
        <Link href="/photography" className="md:col-span-2 relative h-[400px] md:h-full group overflow-hidden rounded-3xl border border-softgray/30 bg-white text-offblack hover:bg-lime transition-all duration-500 cursor-pointer block">
          
          <div className="absolute top-6 right-6 border border-current w-10 h-10 rounded-full flex items-center justify-center z-20">
            <span className="font-mono text-lg font-medium">01</span>
          </div>
          
          <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20 w-full">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-2 tracking-tight">
              Photography
            </h2>
            <p className="text-softgray font-medium group-hover:text-offblack transition-colors">
              Places where I found beauty.
            </p>
          </div>
        </Link>

        {/* BLOQUE 2: PROJECTS (Enlace interno) */}
        <Link href="/projects" className="md:col-span-1 relative h-[250px] md:h-full group overflow-hidden rounded-3xl border border-softgray/30 bg-offblack text-bone hover:bg-lime hover:text-offblack transition-all duration-500 cursor-pointer block">
          <div className="h-full flex flex-col justify-between p-6 md:p-8">
            <div className="self-end">
              <div className="w-10 h-10 border border-current rounded-full flex items-center justify-center font-mono">
                 <span className="text-lg">02</span>
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl md:text-5xl font-bold uppercase mb-2 tracking-tight">
                Projects
              </h2>
              {/* CAMBIO REALIZADO: Nuevo subtítulo */}
              <p className="text-sm opacity-80 font-medium group-hover:opacity-100">
                Experiments & Code.
              </p>
            </div>
          </div>
        </Link>

      </div>
      
      {/* FOOTER */}
      <footer className="mt-8 md:mt-12 flex justify-between text-xs text-softgray font-bold uppercase tracking-widest border-t border-softgray/20 pt-6">
        <span>© 2025 Antonio Bastos de Cordoba</span>
        <span>Madrid, ES</span>
      </footer>

    </main>
  );
}