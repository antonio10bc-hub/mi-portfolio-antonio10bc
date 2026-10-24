"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import { Arrow, Brackets, Dots, XStack } from "@/components/Hud";
import { dictFor } from "@/lib/i18n";

/*
 * 404 propia: el espécimen perdido. El árbol de la home, más claro y con franjas
 * desplazadas o que faltan (tree-lost.png, tramado igual que tree.png), dentro de su
 * marco de visor. Es de cliente solo para leer el idioma de la ruta: not-found.tsx no
 * recibe `params`.
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
      <main className="mx-auto flex min-h-screen-safe w-full max-w-6xl flex-col px-4 py-5 md:px-8 md:py-8">
        <header className="border-b-2 border-ink pb-8 md:pb-10">
          <div className="flex items-center gap-3">
            <Dots />
            <span className="code text-[11px] md:text-xs">{t.notFoundCode}</span>
          </div>
          <h1 className="display mt-4 text-[clamp(3.25rem,16vw,12rem)]">{t.notFoundTitle}.</h1>

          <div className="mt-6 grid grid-cols-1 gap-8 md:mt-8 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-5">
              <p className="datatext max-w-md">{t.notFoundText}</p>
              <Link
                href="/"
                className="group code mt-6 inline-flex items-center gap-2 border-2 border-ink px-3 py-1.5 text-[11px]
                           transition-colors duration-300 hover:bg-ink hover:text-paper"
              >
                <Arrow direction="left" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                {t.notFoundBack}
              </Link>
            </div>

            <div className="relative flex items-center gap-4 md:col-span-6 md:col-start-7">
              <XStack className="hidden md:flex" />
              <div className="relative flex-1 bg-panel/50 p-3">
                <Brackets size={20} weight={2} />
                <Image
                  src="/images/dither/tree-lost.png"
                  alt=""
                  width={1148}
                  height={812}
                  unoptimized
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
        </header>

        <Footer lang={lang} className="mt-auto pt-16" />
      </main>
    </div>
  );
}
