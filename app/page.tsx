export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto text-offblack bg-bone">
      
      {/* HEADER */}
      <header className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-2">
            Tu Nombre
          </h1>
          <p className="text-softgray text-lg md:text-xl font-medium">
            Fotógrafo & Creative Developer
          </p>
        </div>
        <button className="w-fit bg-offblack text-bone px-6 py-2 rounded-full hover:bg-lime hover:text-offblack transition-colors duration-300 text-sm font-bold uppercase">
          Contactar
        </button>
      </header>

      {/* BENTO GRID */}
      {/* En móvil es columna, en PC (md) es grid de 3 columnas con altura fija de 600px */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-auto md:h-[600px]">
        
        {/* BLOQUE 1: FOTOGRAFÍA */}
        {/* CORRECCIÓN: Añadido h-[500px] para que tenga altura en móvil */}
        <div className="md:col-span-2 relative h-[500px] md:h-full group overflow-hidden rounded-3xl border border-softgray/30 bg-white hover:shadow-xl transition-all duration-500">
          {/* Capa de hover */}
          <div className="absolute inset-0 bg-softgray/10 group-hover:bg-softgray/5 transition-colors z-10"></div>
          
          {/* Contenido (Texto) */}
          <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20 bg-gradient-to-t from-white via-white/80 to-transparent w-full">
            <div className="bg-lime w-fit px-3 py-1 rounded-full text-xs font-bold mb-3 uppercase tracking-wide text-offblack">
              Principal
            </div>
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-2 tracking-tight">
              Fotografía
            </h2>
            <p className="text-gray-600 font-medium group-hover:text-offblack transition-colors">
              Explora mi visión del mundo a través de la lente.
            </p>
          </div>
          
          {/* Flecha decorativa */}
          <div className="absolute top-6 right-6 z-20 bg-offblack text-lime p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </div>
        </div>

        {/* BLOQUE 2: PROYECTOS */}
        {/* CORRECCIÓN: Añadido h-[300px] para móvil */}
        <div className="md:col-span-1 relative h-[300px] md:h-full group overflow-hidden rounded-3xl border border-softgray/30 bg-offblack text-bone hover:bg-lime hover:text-offblack transition-all duration-500 cursor-pointer">
          <div className="h-full flex flex-col justify-between p-6 md:p-8">
            <div className="self-end">
              <div className="w-10 h-10 border border-current rounded-full flex items-center justify-center font-mono">
                 <span>02</span>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold uppercase mb-2 tracking-tight">
                Proyectos
              </h2>
              <p className="text-sm opacity-80 font-medium">
                Desarrollo web, experimentos y código.
              </p>
            </div>
          </div>
        </div>

      </div>
      
      {/* FOOTER */}
      <footer className="mt-12 md:mt-20 flex justify-between text-xs text-softgray font-bold uppercase tracking-widest border-t border-softgray/20 pt-6">
        <span>© 2025 Tu Nombre</span>
        <span>Madrid, ES</span>
      </footer>

    </main>
  );
}