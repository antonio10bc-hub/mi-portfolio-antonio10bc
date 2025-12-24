import Link from "next/link";

export default function ProjectsPage() {
  return (
    <main className="relative min-h-screen p-4 md:p-8 max-w-7xl mx-auto text-offblack bg-[#EAE8E0] flex flex-col overflow-x-hidden">
      
      {/* --- FONDO ABSTRACTO --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-lime-300/60 to-green-300/60 rounded-full mix-blend-multiply filter blur-[64px] opacity-70"></div>
          <div className="absolute top-0 -right-20 w-96 h-96 bg-gradient-to-r from-purple-300/60 to-pink-300/60 rounded-full mix-blend-multiply filter blur-[80px] opacity-60"></div>
          <div className="absolute top-[30%] -left-20 w-72 h-72 bg-gradient-to-r from-orange-300/50 to-amber-300/50 rounded-full mix-blend-multiply filter blur-[64px] opacity-60"></div>
          <div className="absolute top-[50%] -right-20 w-80 h-80 bg-gradient-to-r from-cyan-300/50 to-blue-300/50 rounded-full mix-blend-multiply filter blur-[70px] opacity-60"></div>
          <div className="absolute -bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-indigo-300/50 to-violet-300/50 rounded-full mix-blend-multiply filter blur-[90px] opacity-50"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-r from-yellow-200/60 to-lime-200/60 rounded-full mix-blend-multiply filter blur-[64px] opacity-60"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* BOTÓN BACK */}
        <div className="mb-6">
            <Link href="/" className="inline-block text-sm md:text-base font-bold uppercase tracking-widest hover:text-lime transition-colors">
            ← Back
            </Link>
        </div>

        {/* GRID CONTENEDOR */}
        <div className="grid grid-cols-1 gap-4 flex-1 content-start">

            {/* BLOQUE TÍTULO */}
            <div className="rounded-3xl border border-white/40 p-5 pt-4 flex flex-col justify-center h-auto bg-transparent backdrop-blur-md shadow-sm ring-1 ring-white/30">
                <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none">
                    Projects
                </h1>
            </div>

            {/* CARD COINFLIIP */}
            <a 
            href="https://www.coinfliip.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full max-w-3xl mx-auto h-[250px] rounded-3xl text-offblack flex flex-col items-center justify-center group hover:bg-lime/60 hover:scale-[1.02] transition-all duration-500 relative overflow-hidden
            bg-lime/40 backdrop-blur-md border border-white/20 shadow-lg ring-1 ring-white/20"
            >
            <div className="text-center z-10 p-4">
                <h2 className="text-4xl md:text-6xl font-bold mb-2">COINFLIIP</h2>
                <p className="uppercase tracking-widest text-xs md:text-sm border-b border-current inline-block pb-1 opacity-70 group-hover:opacity-100">
                Visit Website ↗
                </p>
            </div>
            
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>

        </div>

        {/* FOOTER */}
        <footer className="mt-8 md:mt-12 flex flex-col md:flex-row justify-between text-[10px] md:text-xs text-softgray font-bold uppercase tracking-widest border-t border-softgray/20 pt-6 gap-4">
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