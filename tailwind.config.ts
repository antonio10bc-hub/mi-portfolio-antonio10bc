import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // CORRECCIÓN IMPORTANTE:
    // Hemos quitado "src/" de las rutas porque tu carpeta 'app' está en la raíz del proyecto.
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tu paleta de colores personalizada
        bone: '#F2F0E9',      // Blanco hueso (Fondo)
        offblack: '#111111',  // Negro casi puro (Texto/Bloques)
        lime: '#D4FF00',      // Lima (Highlight/Hover)
        softgray: '#B0B0B0',  // Gris (Detalles)
      },
    },
  },
  plugins: [],
};
export default config;