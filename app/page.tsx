import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Arrow, Barcode, Brackets, CornerMark, DataBars, Diamonds, Dots, Leader, XStack } from "@/components/Hud";
import TopBar from "@/components/TopBar";
import { PHOTOS } from "@/lib/photos";
import { PROJECTS } from "@/lib/projects";

/*
 * La home es el índice del archivo: el árbol tramado ("Solitude") como
 * espécimen central y, montados encima, el nombre con su línea de referencia
 * y los dos expedientes. En escritorio es una rejilla de 12 columnas y 3 filas
 * (auto, flexible, auto: con filas iguales, la más alta fijaba el alto de las
 * tres y la home dejaba de caber) donde todo se superpone al árbol; en móvil, una columna donde el árbol es el
 * único elemento flexible y se encoge para que la página quepa sin scroll.
 */

function SectionPanel({
  href,
  number,
  meta,
  title,
  description,
  tone,
  className,
}: {
  href: string;
  number: string;
  meta: string;
  title: string;
  description: string;
  tone: "light" | "dark";
  className: string;
}) {
  const dark = tone === "dark";
  return (
    <Link
      href={href}
      className={`group relative z-10 block shrink-0 px-7 py-5 transition-colors duration-500 ease-smooth md:p-8
                  ${dark ? "bg-graphite text-paper hover:bg-ink" : "bg-panel/85 text-ink hover:bg-panel"} ${className}`}
    >
      {!dark && <Brackets size={18} weight={2} inset={8} />}
      <div className="flex items-center justify-between gap-3">
        <span className="code text-[11px] md:text-xs">
          {number} <span aria-hidden>{"//"}</span> {meta}
        </span>
        {dark ? <Dots /> : <Arrow direction="right" className="transition-transform duration-500 ease-smooth group-hover:translate-x-1" />}
      </div>
      <h2 className="display mt-2 text-[clamp(2rem,min(5vw,7vh),4.25rem)] md:mt-4">{title}</h2>
      <div className="mt-1.5 flex items-end justify-between gap-3 md:mt-2">
        <p className="font-mono text-[11px] leading-snug md:text-xs">{description}</p>
        {dark && <Arrow direction="right" className="shrink-0 transition-transform duration-500 ease-smooth group-hover:translate-x-1" />}
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    // La home entra entera en pantalla, footer incluido, pero sin recortar:
    // si en algun dispositivo no cupiese, hace scroll en lugar de cortarse.
    <div className="min-h-screen-safe w-full bg-paper font-sans text-ink">
      <main className="mx-auto flex min-h-screen-safe w-full max-w-6xl flex-col gap-3 px-4 py-4 md:gap-4 md:px-8 md:py-5">
        <TopBar left={{ label: "photography." }} center={{ label: "portfolio." }} right={{ label: "game design." }} />

        <div
          className="relative flex min-h-0 flex-1 flex-col gap-3
                     md:grid md:grid-cols-12 md:grid-rows-[auto_minmax(0,1fr)_auto] md:gap-x-6 md:gap-y-4"
        >
          {/* Espécimen */}
          <div className="reveal relative min-h-0 flex-1 md:col-start-3 md:col-end-12 md:row-start-1 md:row-end-4">
            <Image
              src="/images/dither/tree.png"
              alt="Solitude, a lone tree, printed as a halftone"
              fill
              priority
              unoptimized
              className="object-contain"
            />
          </div>

          {/* Nombre */}
          <div className="reveal relative z-10 order-first shrink-0 md:order-none md:col-start-1 md:col-end-8 md:row-start-1">
            <div className="flex items-center gap-3">
              <Dots />
              <span className="code text-[11px] md:text-xs">File 00 // Index</span>
            </div>
            <h1 className="display mt-2 text-[clamp(3.5rem,min(13vw,15vh),10rem)] md:mt-3">antonio.</h1>
            <div className="mt-2 flex items-start gap-4 md:mt-3">
              <p className="font-mono text-xs md:text-sm">Photography &amp; Creative Game Design.</p>
              <Leader length={170} drop={44} className="mt-2 hidden shrink-0 lg:block" />
            </div>
          </div>

          <CornerMark corner="tr" className="absolute right-0 top-0 hidden md:block" />
          <XStack className="hidden md:col-start-1 md:row-start-2 md:flex md:self-center" />
          <Diamonds className="hidden md:col-start-7 md:row-start-2 md:block md:self-start md:justify-self-end" />

          <SectionPanel
            href="/photography"
            number="01"
            meta={`${PHOTOS.length} frames`}
            title="photography."
            description="Places where I found beauty."
            tone="light"
            className="reveal md:col-start-8 md:col-end-13 md:row-start-2 md:self-center"
          />

          <SectionPanel
            href="/projects"
            number="02"
            meta={`${PROJECTS.length} games`}
            title="projects."
            description="Experiments & code, shipped."
            tone="dark"
            className="reveal md:col-start-1 md:col-end-6 md:row-start-3 md:self-end"
          />

          <div aria-hidden className="hidden md:col-start-10 md:col-end-13 md:row-start-3 md:block md:self-end">
            <DataBars seed="index" rows={8} />
            <Barcode seed="antonio-index" className="mt-3 h-10 w-full" />
          </div>
        </div>

        <Footer className="mt-1" />
      </main>
    </div>
  );
}
