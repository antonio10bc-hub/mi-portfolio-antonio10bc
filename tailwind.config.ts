import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bone: '#F6F4EE',      // Blanco hueso
        sand: '#EBE8E0',      // Fondo de página
        offblack: '#111111',  // Negro casi puro
        softblack: '#5A5A55', // Gris apagado para texto secundario
        lime: '#D4FF00',      // Lima (acento único)
        softgray: '#B0B0B0',  // Gris
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-roboto-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      letterSpacing: {
        label: '0.18em',
      },
      boxShadow: {
        // Elevación suave, nunca un drop-shadow duro.
        soft: '0 10px 30px -14px rgba(17,17,17,0.18)',
        lift: '0 26px 60px -28px rgba(17,17,17,0.35)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        blob: 'blob 26s ease-in-out infinite',
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.6s ease-out both',
      },
      keyframes: {
        // Deriva lenta y orgánica: nada de saltos de escala bruscos.
        blob: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '25%': { transform: 'translate3d(5%, -8%, 0) scale(1.12)' },
          '50%': { transform: 'translate3d(-6%, 6%, 0) scale(0.92)' },
          '75%': { transform: 'translate3d(7%, 4%, 0) scale(1.06)' },
        },
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
