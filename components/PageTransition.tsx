"use client";

import { usePathname } from "next/navigation";

/**
 * Fundido entre rutas hecho con una animación CSS y no con JS: el HTML que
 * llega del servidor ya es visible. Con Framer Motion el contenido salía con
 * `opacity: 0` en línea y la página quedaba en blanco hasta la hidratación.
 * La clave por ruta reinicia la animación en cada navegación.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="flex w-full flex-1 flex-col animate-fade-in">
      {children}
    </div>
  );
}
