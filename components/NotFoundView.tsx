"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import { InkArrow, Wizard } from "@/components/Ink";
import { Scribble } from "@/components/InkBox";
import { dictFor } from "@/lib/i18n";

/*
 * 404 propia: el mago ha hecho desaparecer la página. Se dibuja igual que en la
 * home, sin chispas y con interrogaciones a mano sobre el sombrero. Es de cliente
 * solo para leer el idioma de la ruta: not-found.tsx no recibe `params`.
 */
export default function NotFoundView() {
  const params = useParams<{ lang?: string }>();
  const lang = params?.lang === "es" ? "es" : "en";
  const t = dictFor(lang);

  // El HTML llega con "404 | Antonio Asis", pero al hidratar Next aplica el título del
  // layout (el de la home); se restablece aquí.
  useEffect(() => {
    document.title = `404 | ${t.notFoundMetaTitle} | Antonio Asis`;
  }, [t.notFoundMetaTitle]);

  return (
    <div className="min-h-screen-safe w-full bg-paper font-sans text-ink">
      <main className="page flex min-h-screen-safe flex-col py-5 md:py-8">
        <div className="grid flex-1 grid-cols-1 items-center gap-10 py-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-6">
            <span className="note -rotate-2 text-ink">{t.notFoundNote}</span>
            <h1 className="hand-display wiggle mt-2 w-fit text-[clamp(4rem,14vw,10rem)]">{t.notFoundTitle}</h1>
            <Scribble seed="not-found" draw delay={0.3} className="mt-1 h-4 w-[min(70%,26rem)] md:h-5" />
            <p className="hand mt-6 max-w-md text-mute md:text-lg">{t.notFoundText}</p>
            <Link href="/" className="group mt-8 inline-flex items-center gap-3">
              <InkArrow seed="not-found-back" direction="left" className="h-5 w-12 transition-transform duration-500 ease-spring group-hover:-translate-x-2" />
              <span className="hand-display text-[1.75rem]">{t.notFoundBack}</span>
            </Link>
          </div>

          <div className="relative mx-auto aspect-[240/290] w-[min(70vw,24rem)] md:col-span-5 md:col-start-8">
            <Wizard id="lost" title={t.wizardAlt} sparkles={false} className="origin-bottom animate-bob" />
            {/* Interrogaciones sobre el sombrero. */}
            {[
              { className: "left-[62%] -top-[4%] text-5xl -rotate-12", delay: "2s" },
              { className: "left-[78%] top-[4%] text-3xl rotate-12", delay: "2.3s" },
              { className: "left-[48%] top-[1%] text-2xl -rotate-6", delay: "2.6s" },
            ].map((mark, i) => (
              <span
                key={i}
                aria-hidden
                className={`hand-display absolute animate-pop ${mark.className}`}
                style={{ animationDelay: mark.delay }}
              >
                ?
              </span>
            ))}
          </div>
        </div>

        <Footer lang={lang} />
      </main>
    </div>
  );
}
