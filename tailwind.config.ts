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
      // Dirección de arte "Cuaderno de tinta": tinta negra sobre papel blanco, nada más.
      // El color solo entra con el contenido (fotos y capturas). Ver docs/art-direction.
      colors: {
        paper: '#FFFFFF',   // Papel: fondo de todo, siempre plano
        ink: '#141214',     // Tinta: texto, trazos y manchas
        mute: '#5F5A60',    // Lápiz: notas secundarias (6:1 sobre papel)
        smudge: '#F1EFEC',  // Hueco de una imagen mientras carga, nada más
        alert: '#E0322A',   // Rojo: SOLO la X que cierra el minijuego (pedido expreso; la única excepción de color)
      },
      fontFamily: {
        sans: ['var(--font-shantell)', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
        // Rebote corto, como un trazo que se pasa un poco y vuelve.
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.6s ease-out both',
        // Trazo que se dibuja solo (stroke-dashoffset con pathLength=1).
        draw: 'draw 0.7s cubic-bezier(0.65, 0, 0.35, 1) both',
        // Lo que cae en tinta de golpe: manchas, cruces.
        pop: 'pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        // El mago se balancea apoyado en los pies.
        bob: 'bob 5s ease-in-out infinite',
        // Chispas de la varita.
        spark: 'spark 2.4s ease-out infinite',
        // La obra que el mago sostiene en el aire.
        float: 'float 6s ease-in-out infinite',
        // Cruces sueltas que titilan.
        twinkle: 'twinkle 3.6s ease-in-out infinite',
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
        draw: {
          from: { strokeDashoffset: '1' },
          to: { strokeDashoffset: '0' },
        },
        pop: {
          from: { opacity: '0', transform: 'scale(0.2) rotate(-25deg)' },
          to: { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
        bob: {
          '0%, 100%': { transform: 'rotate(-1.6deg)' },
          '50%': { transform: 'rotate(1.6deg)' },
        },
        // Cada chispa sale de la punta en su dirección (--dx, --dy), gira y se apaga.
        spark: {
          '0%': { opacity: '0', transform: 'translate(0, 0) scale(0.2) rotate(0deg)' },
          '15%': { opacity: '1', transform: 'translate(calc(var(--dx) * 0.25), calc(var(--dy) * 0.25)) scale(1) rotate(30deg)' },
          '100%': { opacity: '0', transform: 'translate(var(--dx), var(--dy)) scale(0.5) rotate(140deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-12px) rotate(-0.6deg)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
          '50%': { opacity: '0.25', transform: 'scale(0.6) rotate(45deg)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
