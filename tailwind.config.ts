import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bone: '#F2F0E9',      // Blanco hueso
        offblack: '#111111',  // Negro casi puro
        lime: '#D4FF00',      // Lima
        softgray: '#B0B0B0',  // Gris
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-roboto-mono)'],
      },
      // --- ANIMACIÓN DE ALTA INTENSIDAD ---
      animation: {
        // Cambio 1: De 7s a 4s (Más rápido)
        blob: "blob 4s infinite", 
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            // Cambio 2: Movimiento más amplio (de 30px a 60px/80px) y escala mayor (1.2)
            transform: "translate(60px, -80px) scale(1.2)",
          },
          "66%": {
            // Cambio 3: Movimiento opuesto fuerte y reducción de tamaño (0.8)
            transform: "translate(-40px, 50px) scale(0.8)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;