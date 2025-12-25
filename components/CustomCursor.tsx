"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Función para actualizar la posición
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Detectar hover en enlaces y botones
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // Variantes de animación para el cursor
  const variants = {
    default: {
      x: mousePosition.x - 8, // Centrar el punto (mitad de w-4)
      y: mousePosition.y - 8,
      scale: 1,
      backgroundColor: "#111111", // offblack
    },
    hover: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      scale: 2.5, // Se hace grande
      backgroundColor: "#D4FF00", // lima
      mixBlendMode: "difference" as any, // Efecto chulo de inversión de color
    },
  };

  // Solo mostrar en escritorio (hidden en móvil, block en md)
  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999] hidden md:block"
      variants={variants}
      animate={isHovering ? "hover" : "default"}
      transition={{ type: "spring", stiffness: 500, damping: 28 }} // Movimiento fluido tipo muelle
    />
  );
}