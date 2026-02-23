import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#EAE8E0] overflow-x-hidden text-offblack font-sans">
      
      {/* --- FONDO ANIMADO --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-lime-400/80 to-green-500/80 rounded-full mix-blend-multiply filter blur-[64px] opacity-80 animate-blob"></div>
          <div className="absolute top-0 -right-20 w-96 h-96 bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-full mix-blend-multiply filter blur-[80px] opacity-80 animate-blob [animation-delay:2s]"></div>
          <div className="absolute top-[30%] -left-20 w-72 h-72 bg-gradient-to-r from-orange-400/80 to-amber-500/80 rounded-full mix-blend-multiply filter blur-[64px] opacity-80 animate-blob [animation-delay:4s]"></div>
          <div className="absolute top-[50%] -right-20 w-80 h-80 bg-gradient-to-r from-cyan-400/80 to-blue-500/80 rounded-full mix-blend-multiply filter blur-[70px] opacity-80 animate-blob [animation-delay:6s]"></div>
          <div className="absolute -bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-indigo-500/80 to-violet-500/80 rounded-full mix-blend-multiply filter blur-[90px] opacity-80 animate-blob [animation-delay:3s]"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-r from-yellow-400/80 to-lime-500/80 rounded-full mix-blend-multiply filter blur-[64px] opacity-80 animate-blob [animation-delay:5s]"></div>
      </div>

      <div className="relative z-10 w-full min-h-screen max-w-7xl mx-auto p-4 md:p-8 flex flex-col">
        {/* BOTÓN BACK */}
        <div className="mb-6">
            <Link href="/" className="inline-block text-sm md:text-base font-bold uppercase tracking-widest hover:text-lime transition-colors">
            ← Back
            </Link>
        </div>

        {/* GRID CONTENEDOR: 1 columna en móvil, 2 en ordenador */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 flex-1 content-start pb-10">

            {/* TÍTULO: Ocupa las 2 columnas enteras (md:col-span-2) */}
            <div className="md:col-span-2 rounded-3xl border border-white/40 p-5 pt-4 flex flex-col justify-center h-auto bg-transparent backdrop-blur-md shadow-sm ring-1 ring-white/30">
                <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none">
                    Projects
                </h1>
            </div>

            {/* PROYECTO 1: COINFLIIP */}
            <a 
            href="https://www.coinfliip.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full h-[250px] md:h-[300px] rounded-3xl text-offblack flex flex-col items-center justify-center group hover:bg-lime/60 hover:scale-[1.02] transition-all duration-500 relative overflow-hidden
            bg-lime/40 backdrop-blur-md border border-white/20 shadow-lg ring-1 ring-white/20"
            >
              <div className="text-center z-10 p-4">
                  <h2 className="text-3xl md:text-5xl font-bold mb-2 tracking-tighter">COINFLIIP</h2>
                  <p className="uppercase tracking-widest text-xs md:text-sm border-b border-current inline-block pb-1 opacity-70 group-hover:opacity-100">
                  Visit Website ↗
                  </p>
              </div>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>

            {/* PROYECTO 2: MAGIC POKER */}
            <a 
            href="https://magic-poker-kappa.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full h-[250px] md:h-[300px] rounded-3xl text-white flex flex-col items-center justify-center group hover:scale-[1.02] transition-all duration-500 relative overflow-hidden
            bg-gradient-to-br from-purple-600/80 via-purple-500/70 to-orange-500/80 backdrop-blur-md border border-white/20 shadow-lg ring-1 ring-white/20"
            >
              <div className="text-center z-10 p-4">
                  <h2 className="text-3xl md:text-5xl font-bold mb-2 tracking-tighter drop-shadow-md">MAGIC POKER</h2>
                  <p className="uppercase tracking-widest text-xs md:text-sm border-b border-current inline-block pb-1 opacity-80 group-hover:opacity-100">
                  Visit Website ↗
                  </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>

            {/* PROYECTO 3: CHAOTIC GOLF */}
            <a 
            href="https://chaothicgolf.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full h-[250px] md:h-[300px] rounded-3xl text-white flex flex-col items-center justify-center group hover:scale-[1.02] transition-all duration-500 relative overflow-hidden border border-white/20 shadow-lg ring-1 ring-white/20"
            style={{ backgroundColor: '#2a4f29' }}
            >
              <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
              
              <div className="text-center z-10 p-4">
                  <h2 className="text-3xl md:text-5xl font-bold mb-2 tracking-tighter drop-shadow-md">CHAOTIC GOLF</h2>
                  <p className="uppercase tracking-widest text-xs md:text-sm border-b border-current inline-block pb-1 opacity-80 group-hover:opacity-100">
                  Visit Website ↗
                  </p>
              </div>
              
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>

            {/* PROYECTO 4: ASCII FOREST */}
            <a 
            href="https://asciiforest-game.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full h-[250px] md:h-[300px] rounded-3xl flex flex-col items-center justify-center group hover:scale-[1.02] transition-all duration-500 relative overflow-hidden
            bg-gradient-to-br from-black via-gray-900 to-green-600/80 backdrop-blur-md border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)] ring-1 ring-green-500/30"
            >
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
              
              <div className="text-center z-10 p-4 text-green-400 font-mono">
                  <h2 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">ASCII FOREST</h2>
                  <p className="uppercase tracking-widest text-xs md:text-sm border-b border-green-400/50 inline-block pb-1 opacity-80 group-hover:opacity-100 group-hover:text-green-300 transition-colors">
                  Visit Website ↗
                  </p>
              </div>
              
              <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>

        </div>

        {/* FOOTER */}
        <footer className="mt-auto flex flex-col md:flex-row justify-between text-[10px] md:text-xs text-softgray font-bold uppercase tracking-widest border-t border-softgray/20 pt-6 gap-4">
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <span>© 2026 Antonio Asis Bastos de Cordoba</span>
                <span className="hidden md:inline text-softgray/50">|</span>
                <a href="https://www.instagram.com/antonio10bc/" target="_blank" rel="noopener noreferrer" className="hover:text-offblack transition-colors underline decoration-softgray/50 hover:decoration-offblack">
                Instagram
                </a>
            </div>
            <span>Madrid, ES</span>
        </footer>
      </div>
    </div>
  );
}