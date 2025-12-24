import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-[100dvh] p-3 md:p-8 max-w-7xl mx-auto text-offblack bg-[#EAE8E0] flex flex-col overflow-hidden">
      
      {/* --- FONDO ABSTRACTO INTENSO --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          {/* 1. Lima/Verde Potente */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-lime-400/80 to-green-500/80 rounded-full mix-blend-multiply filter blur-[64px] opacity-80 animate-blob"></div>
          
          {/* 2. Morado/Rosa Fuerte */}
          <div className="absolute -top-10 -right-10 w-96 h-96 bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-full mix-blend-multiply filter blur-[80px] opacity-80 animate-blob [animation-delay:2s]"></div>
          
          {/* 3. Naranja/Ámbar Vivo */}
          <div className="absolute top-[30%] -left-20 w-72 h-72 bg-gradient-to-r from-orange-400/80 to-amber-500/80 rounded-full mix-blend-multiply filter blur-[64px] opacity-80 animate-blob [animation-delay:4s]"></div>
          
          {/* 4. Cian/Azul Eléctrico */}
          <div className="absolute top-[40%] -right-20 w-80 h-80 bg-gradient-to-r from-cyan-400/80 to-blue-500/80 rounded-full mix-blend-multiply filter blur-[70px] opacity-80 animate-blob [animation-delay:6s]"></div>
          
          {/* 5. Indigo Profundo */}
          <div className="absolute -bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-indigo-500/80 to-violet-500/80 rounded-full mix-blend-multiply filter blur-[90px] opacity-80 animate-blob [animation-delay:3s]"></div>
          
          {/* 6. Amarillo/Lima Neón */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gradient-to-r from-yellow-400/80 to-lime-500/80 rounded-full mix-blend-multiply filter blur-[64px] opacity-80 animate-blob [animation-delay:5s]"></div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="relative z-10 flex flex-col flex-1 h-full">
        
        {/* GRID PRINCIPAL */}
        {/* md:grid-rows-[auto_1fr] para evitar huecos grandes en móvil */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[auto_1fr] gap-2 md:gap-5 font-sans flex-1 content-start md:content-stretch">
          
          {/* HEADER BLOCK */}
          <div className="md:col-span-3 rounded-3xl p-4 md:p-10 flex flex-col justify-center h-auto min-h-0 bg-transparent backdrop-blur-md border border-white/40 shadow-sm ring-1 ring-white/30">
            <h1 className="text-4xl md:text-7xl font-bold tracking-tighter uppercase mb-0 leading-none">
              ANTONIO
            </h1>
            <p className="text-softgray text-sm md:text-lg font-medium leading-tight mt-1">
              Photography & Creative Game Design
            </p>
          </div>

          {/* FILA INFERIOR */}
          
          {/* PHOTOGRAPHY */}
          <Link href="/photography" className="md:col-span-2 relative h-[250px] md:h-full group overflow-hidden rounded-3xl cursor-pointer block transition-all duration-500
              bg-transparent backdrop-blur-md border border-white/40 shadow-sm ring-1 ring-white/30 text-offblack
              hover:bg-white/20 hover:border-lime/50 hover:shadow-lime/10">
            
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

          {/* PROJECTS */}
          <Link href="/projects" className="md:col-span-1 relative h-[250px] md:h-full group overflow-hidden rounded-3xl cursor-pointer block transition-all duration-500
              bg-transparent backdrop-blur-md border border-white/40 shadow-sm ring-1 ring-white/30 text-offblack
              hover:bg-white/20 hover:border-lime/50 hover:shadow-lime/10">
              
              <div className="absolute top-4 right-4 border border-current w-8 h-8 rounded-full flex items-center justify-center z-20">
                 <span className="font-mono text-xs font-medium">02</span>
              </div>
              
              <div className="absolute bottom-0 left-0 p-4 md:p-8 z-20 w-full">
                <h2 className="text-3xl md:text-5xl font-bold uppercase mb-1 tracking-tight leading-none">
                  Projects
                </h2>
                <p className="text-softgray font-medium group-hover:text-offblack transition-colors text-xs md:text-base leading-tight">
                  Experiments & Code.
                </p>
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