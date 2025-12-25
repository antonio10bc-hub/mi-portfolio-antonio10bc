"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname} // La clave es la ruta, para que detecte el cambio
        initial={{ opacity: 0, y: 20 }} // Empieza invisible y un poco abajo
        animate={{ opacity: 1, y: 0 }}  // Se anima a visible y su posición original
        exit={{ opacity: 0, y: -20 }}   // Sale desvaneciéndose hacia arriba
        transition={{ duration: 0.4, ease: "easeInOut" }} // Duración y suavidad
        className="w-full h-full flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}