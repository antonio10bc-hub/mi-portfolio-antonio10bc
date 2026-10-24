"use client";

import { LANGS, type Lang } from "@/lib/i18n";

/** Guarda la elección un año y recarga para que proxy.ts sirva la otra versión. */
function switchTo(lang: Lang) {
  document.cookie = `lang=${lang}; path=/; max-age=31536000; samesite=lax`;
  window.location.reload();
}

/**
 * Selector de idioma discreto, para el pie. Guarda la elección en la cookie `lang`
 * (un año), que proxy.ts antepone a la detección automática, y recarga: la URL no
 * cambia, solo la versión que se sirve.
 */
export default function LangSwitch({ lang, label }: { lang: Lang; label: string }) {
  const choose = (next: Lang) => {
    if (next !== lang) switchTo(next);
  };

  return (
    <span role="group" aria-label={label} className="label flex items-center gap-1.5">
      {LANGS.map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden>/</span>}
          <button
            type="button"
            lang={l}
            aria-pressed={l === lang}
            onClick={() => choose(l)}
            data-track="language_changed"
            data-track-to={l}
            className={`uppercase transition-colors duration-300 ${
              l === lang ? "text-ink underline decoration-1 underline-offset-4" : "hover:text-ink"
            }`}
          >
            {l}
          </button>
        </span>
      ))}
    </span>
  );
}
