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
        bone: '#F2F0E9',
        offblack: '#111111',
        lime: '#D4FF00',
        softgray: '#B0B0B0',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-roboto-mono)'],
      },
      // --- NUEVA SECCIÓN DE ANIMACIÓN ---
      animation: {
        blob: "blob 7s infinite", // Define la clase 'animate-blob' (7 segundos, bucle infinito)
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            // Se mueve arriba/derecha y crece un poco
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            // Se mueve abajo/izquierda y se encoge un poco
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            // Vuelve al inicio
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
      // ----------------------------------
    },
  },
  plugins: [],
};
export default config;