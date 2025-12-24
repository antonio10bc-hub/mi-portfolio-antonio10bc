import Link from "next/link";

export default function Home() {
  return (
    // CAMBIO MAIN: 
    // - Móvil: 'min-h-screen' (crece si hace falta).
    // - PC (md): 'h-screen' (fuerza altura exacta de pantalla) y 'overflow-hidden' (corta el scroll).
    <main className="min-h-screen md:h-screen p-3 md:p-8 max-w-7xl mx-auto text-offblack bg-bone flex flex-col md:overflow-hidden">
      
      {/* GRID PRINCIPAL */}
      {/* CAMBIOS GRID PC:
          - md:grid-rows-[auto_1fr]: Fila 1 automática, Fila 2 llena el resto.
          - md:gap-5: Espacio equilibrado.
          - flex-1: Empuja el footer hacia abajo si sobra espacio.
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[auto_1fr] gap-2 md:gap-5 font-sans content-start md:content-stretch flex-1">
        
        {/* --- HEADER BLOCK --- */}
        {/* En PC: h-full para que llene su celda 'auto' asignada */}
        <div className="md:col-span-3 bg-white rounded-3xl border border-softgray/30 p-4 md:p-10 flex flex-col justify-center h-auto min-h-0">
           <h1 className="text-4xl md:text-7xl font-bold tracking-tighter uppercase mb-0 leading-none">
            ANTONIO
          </h1>
          <p className="text-softgray text-sm md:text-lg font-medium leading-tight mt-1">
            Photography & Creative Game Design
          </p>
        </div>


        {/* --- FILA INFERIOR --- */}
        {/* MAGIA AQUÍ: 
            En PC usamos 'md:h-full'. Como la fila es '1fr', esto hará que los bloques
            se estiren o encojan milimétricamente para llenar la pantalla.
        */}
        
        {/* BLOQUE 1: PHOTOGRAPHY */}
        <Link href="/photography" className="md:col-span-2 relative h-[200px] md:h-full group overflow-hidden rounded-3xl border border-softgray/30 bg-white text-offblack hover:bg-lime transition-all duration-500 cursor-pointer block">
          
          <div className="absolute top-4 right-4 border border-current w-8 h-8 rounded-full flex items-center justify-center z-20">
            <span className="font-mono text-xs font-medium">01</span>
          </div>
          
          <div className="absolute bottom-0 left-0 p-4 md:p-8 z-20 w-full">
            <h2 className="text-3xl md:text-5xl font-bold uppercase mb-1 tracking-tight leading-none">
              Photography
            </h2>
            <p className="text-softgray font-medium group-hover:text-offblack transition-colors text-xs md:text-base">
              Places where I found beauty.
            </p>
          </div>
        </Link>

        {/* BLOQUE 2: PROJECTS */}
        <Link href="/projects" className="md:col-span-1 relative h-[120px] md:h-full group overflow-hidden rounded-3xl border border-softgray/30 bg-offblack text-bone hover:bg-lime hover:text-offblack transition-all duration-500 cursor-pointer block">
          <div className="h-full flex flex-col justify-between p-4 md:p-8">
            <div className="self-end">
              <div className="w-8 h-8 md:w-10 md:h-10 border border-current rounded-full flex items-center justify-center font-mono text-xs md:text-lg">
                 <span>02</span>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl md:text-5xl font-bold uppercase mb-1 tracking-tight leading-none">
                Projects
              </h2>
              <p className="text-xs md:text-sm opacity-80 font-medium group-hover:opacity-100 leading-tight">
                Experiments & Code.
              </p>
            </div>
          </div>
        </Link>

      </div>
      
      {/* FOOTER */}
      {/* En PC: mt-4 para darle aire respecto a los bloques estirados */}
      <footer className="mt-2 md:mt-4 flex flex-col md:flex-row justify-between text-[10px] md:text-xs text-softgray font-bold uppercase tracking-widest border-t border-softgray/20 pt-4 gap-4 shrink-0">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <span>© 2025 Antonio Asis Bastos de Cordoba</span>
            <span className="hidden md:inline text-softgray/50">|</span>
            <a href="https://www.instagram.com/antonio10bc/" target="_blank" rel="noopener noreferrer" className="hover:text-offblack transition-colors underline decoration-softgray/50 hover:decoration-offblack">
              Instagram
            </a>
        </div>
        <span>Madrid, ES</span>
      </footer>

    </main>
  );
}