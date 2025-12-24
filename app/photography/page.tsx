import Link from "next/link";

export default function PhotographyPage() {
  // Simulamos 5 fotos vacías
  const photos = [1, 2, 3, 4, 5];

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto text-offblack bg-bone">
      
      {/* HEADER SIMPLE CON BOTÓN VOLVER */}
      <header className="mb-12 flex justify-between items-center">
        <Link href="/" className="uppercase font-bold text-sm tracking-widest hover:text-lime transition-colors">
          ← Back
        </Link>
        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">
          Photography
        </h1>
      </header>

      {/* GRID DE FOTOS */}
      {/* Diseño masonry simple: 1 col móvil, 2 col tablet, 3 col PC */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {photos.map((item, index) => (
          <div 
            key={index}
            // Hacemos que la primera foto sea más ancha (span-2) para romper la monotonía
            className={`bg-white rounded-2xl overflow-hidden border border-softgray/20 aspect-[4/5] hover:shadow-xl transition-all duration-300 group relative ${index === 0 ? 'md:col-span-2 aspect-[16/9]' : ''}`}
          >
            {/* Placeholder gris (aquí irán las imágenes reales luego) */}
            <div className="w-full h-full bg-softgray/10 flex items-center justify-center text-softgray group-hover:bg-lime/20 transition-colors">
              <span className="font-mono text-xs uppercase">Photo {item}</span>
            </div>
          </div>
        ))}

      </div>
    </main>
  );
}