import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen md:h-screen p-3 md:p-8 max-w-7xl mx-auto text-offblack bg-bone flex flex-col md:overflow-hidden overflow-hidden">
      
      {/* --- FONDO ABSTRACTO (MEJORADO: 6 Manchas) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          {/* 1. Lima Brillante (Arriba Izquierda) */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-lime-300/60 to-green-300/60 rounded-full mix-blend-multiply filter blur-[64px] opacity-70 animate-pulse-slow"></div>
          
          {/* 2. Rosa/Morado (Arriba Derecha) */}
          <div className="absolute -top-10 -right-10 w-96 h-96 bg-gradient-to-r from-purple-300/60 to-pink-300/60 rounded-full mix-blend-multiply filter blur-[80px] opacity-60"></div>
          
          {/* 3. Naranja Cálido (Centro Izquierda) */}
          <div className="absolute top-[30%] -left-20 w-72 h-72 bg-gradient-to-r from-orange-300/50 to-amber-300/50 rounded-full mix-blend-multiply filter blur-[64px] opacity-60"></div>

          {/* 4. Azul Cian (Centro Derecha) */}
          <div className="absolute top-[40%] -right-20 w-80 h-80 bg-gradient-to-r from-cyan-300/50 to-blue-300/50 rounded-full mix-blend-multiply filter blur-[70px] opacity-60"></div>
          
          {/* 5. Violeta Profundo (Abajo Izquierda) */}
          <div className="absolute -bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-indigo-300/50 to-violet-300/50 rounded-full mix-blend-multiply filter blur-[90px] opacity-50"></div>

           {/* 6. Amarillo Suave (Abajo Derecha) */}
           <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gradient-to-r from-yellow-200/60 to-lime-200/60 rounded-full mix-blend-multiply filter blur-[64px] opacity-60"></div>
      </div>


      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="relative z-10 flex flex-col flex-1 h-full">
        
        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[auto_1fr] gap-2 md:gap-5 font-sans content-start md:content-stretch flex-1">
          
          {/* HEADER BLOCK (Cristal) */}
          <div className="md:col-span-3 rounded-3xl p-4 md:p-10 flex flex-col justify-center h-auto min-h-0 bg-white/40 backdrop-blur-md border border-white/50 shadow-lg ring-1 ring-white/20">
            <h1 className="text-4xl md:text-7xl font-bold tracking-tighter uppercase mb-0 leading-none">
              ANTONIO
            </h1>
            <p className="text-softgray text-sm md:text-lg font-medium leading-tight mt-1">
              Photography & Creative Game Design
            </p>
          </div>


          {/* FILA INFERIOR */}
          
          {/* PHOTOGRAPHY (Cristal Claro) */}
          <Link href="/photography" className="md:col-span-2 relative h-[200px] md:h-full group overflow-hidden rounded-3xl cursor-pointer block transition-all duration-500
              bg-white/40 backdrop-blur-md border border-white/50 shadow-lg ring-1 ring-white/20
              hover:bg-lime/30 hover:border-lime/50 hover:shadow-lime/20">
            
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

          {/* PROJECTS (Cristal Oscuro) */}
          <Link href="/projects" className="md:col-span-1 relative h-[120px] md:h-full group overflow-hidden rounded-3xl cursor-pointer block transition-all duration-500
              bg-offblack/70 backdrop-blur-md border border-white/10 shadow-lg text-bone ring-1 ring-black/5
              hover:bg-lime/30 hover:border-lime/50 hover:text-offblack hover:shadow-lime/20">
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

      </div>
    </main>
  );
}