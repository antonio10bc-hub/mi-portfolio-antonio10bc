import Link from "next/link";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto text-offblack bg-bone flex flex-col">
      
      {/* HEADER */}
      <header className="mb-12">
        <Link href="/" className="uppercase font-bold text-sm tracking-widest hover:text-lime transition-colors">
          ← Back
        </Link>
      </header>

      {/* CONTENIDO CENTRADO */}
      <div className="flex-1 flex flex-col items-center justify-center pb-20">
        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-8 text-center">
          Latest Experiment
        </h1>

        {/* BLOQUE ENLACE A COINFLIIP */}
        <a 
          href="https://www.coinfliip.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full max-w-2xl aspect-video bg-offblack rounded-3xl text-bone flex flex-col items-center justify-center group hover:bg-lime hover:text-offblack transition-all duration-500 relative overflow-hidden"
        >
          <div className="text-center z-10">
            <h2 className="text-5xl md:text-7xl font-bold mb-4">COINFLIIP</h2>
            <p className="uppercase tracking-widest text-sm border-b border-current inline-block pb-1">
              Visit Website ↗
            </p>
          </div>
          
          {/* Fondo decorativo hover */}
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </a>
      </div>

    </main>
  );
}