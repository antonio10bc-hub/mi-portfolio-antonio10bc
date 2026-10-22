"use client";

import { useEffect } from "react";
import { initAnalytics, track, type Props } from "@/lib/analytics";

/**
 * Arranca PostHog y convierte en evento cualquier clic sobre un elemento con
 * `data-track="nombre"`; sus `data-track-*` van como propiedades
 * (`data-track-project="Tank-less"` → `project: "Tank-less"`). Así las fichas y
 * los enlaces siguen siendo componentes de servidor. No pinta nada.
 */
export default function AnalyticsTracker() {
  useEffect(() => {
    initAnalytics();
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      const props: Props = { path: window.location.pathname };
      for (const [key, value] of Object.entries(el.dataset)) {
        if (!key.startsWith("track") || key === "track" || value === undefined) continue;
        const name = key.slice(5).replace(/^./, (c) => c.toLowerCase());
        props[name] = /^\d+$/.test(value) ? Number(value) : value;
      }
      track(el.dataset.track!, props);
    };
    // En captura: llega aunque el enlace navegue o abra otra pestaña
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
