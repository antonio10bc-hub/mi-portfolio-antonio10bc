import Link from "next/link";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto text-offblack bg-bone flex flex-col">
      
      {/* BOTÓN BACK (Fuera del bloque, más grande) */}
      <div className="mb-6">
        <Link href="/" className="inline-block text-sm md:text-base font-bold uppercase tracking-widest hover:text-lime transition-colors">
          ← Back
        </Link>
      </div>

      {/* GRID CONTENEDOR */}
      <div className="grid grid-cols-1 gap-4 flex-1 content-start">

        {/* BLOQUE TÍTULO (Blanco, solo texto) */}
        <div className="bg-white rounded-3xl border border-softgray/30 p-6 md:p-10 flex flex-col justify-center h-auto min-h-[150px]">
            <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">
                Projects
            </h1>
        </div>

        {/* BLOQUE ENLACE A COINFLIIP */}
        <a 
          href="https://www.coinfliip.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full aspect-video md:aspect-[21/9] bg-offblack rounded-3xl text-bone flex flex-col items-center justify-center group hover:bg-lime hover:text-offblack transition-all duration-500 relative overflow-hidden"
        >
          <div className="text-center z-10 p-4">
            <h2 className="text-4xl md:text-7xl font-bold mb-4">COINFLIIP</h2>
            <p className="uppercase tracking-widest text-xs md:text-sm border-b border-current inline-block pb-1">
              Visit Website ↗
            </p>
          </div>
          
          {/* Fondo decorativo hover */}
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </a>

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