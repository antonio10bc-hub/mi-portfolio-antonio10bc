import type { Config } from "tailwindcss";

const config: Config = {
  // En tactil, `hover:` se quedaba activo despues de tocar una tarjeta.
  future: { hoverOnlyWhenSupported: true },
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Dirección de arte "Specimen File": interfaz estrictamente monocroma.
      // El color solo entra con el contenido (fotos y capturas). Ver docs/art-direction.
      colors: {
        paper: '#FFFFFF',     // Fondo de página, siempre plano
        panel: '#DEDEDC',     // Paneles grises y marco de las capturas
        ink: '#201E20',       // Texto, líneas, bordes y puntos
        graphite: '#48444A',  // Panel de acción oscuro
        mute: '#6B676E',      // Texto secundario: 5.5:1 sobre papel, solo sobre papel
      },
      fontFamily: {
        sans: ['var(--font-archivo)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        label: '0.14em',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.6s ease-out both',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translate3d(0, 18px, 0)' },
          to: { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
