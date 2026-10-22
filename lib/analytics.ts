// --- ANALÍTICAS (PostHog, región EU) ---
// Eventos anónimos para ver cómo se recorre el portfolio: páginas, qué juego se abre desde
// "games.", qué fotos se miran en el visor y si se sale a Instagram. Es el mismo proyecto
// de PostHog que los juegos (todo lleva app=portfolio), así se ve el camino portfolio → juego.
// Solo en la web publicada (nunca en local). Sin datos personales: un identificador anónimo
// por navegador. La librería se carga aparte para no frenar la página; los eventos de antes
// de que esté lista esperan en una cola.
import type { PostHog } from "posthog-js";

/** Clave pública del proyecto (va en la web por diseño) */
const KEY = "phc_xnbbVrZbqhjzk6GfeLxopJHkhtxFFXAxM96symjc2snN";
/** Se envía a través de la propia web (/ingest → PostHog EU, ver next.config.ts) para que
 *  los bloqueadores no se coman los eventos */
const HOST = "/ingest";
const UI_HOST = "https://eu.posthog.com";

export type Props = Record<string, string | number | boolean | null | undefined>;

let ph: PostHog | null = null;
let starting = false;
const queue: [string, Props | undefined][] = [];

const enabled = () =>
  typeof window !== "undefined" &&
  process.env.NODE_ENV === "production" &&
  !["localhost", "127.0.0.1"].includes(window.location.hostname);

/** Arranca PostHog (una vez) */
export const initAnalytics = () => {
  if (!enabled() || ph || starting) return;
  starting = true;
  import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(KEY, {
        api_host: HOST,
        ui_host: UI_HOST,
        // Solo lo que mandamos a mano (data-track y el visor de fotos)
        autocapture: false,
        // App Router: cada cambio de ruta cuenta como una página vista
        capture_pageview: "history_change",
        capture_pageleave: true,
        disable_session_recording: true,
        person_profiles: "identified_only",
      });
      posthog.register({ app: "portfolio" });
      ph = posthog;
      queue.splice(0).forEach(([e, p]) => posthog.capture(e, p));
    })
    .catch(() => {
      starting = false;
    });
};

/** Un evento (si las analíticas no están activas, no hace nada) */
export const track = (event: string, props?: Props) => {
  if (!enabled()) return;
  if (ph) ph.capture(event, props);
  else if (queue.length < 100) queue.push([event, props]);
};
