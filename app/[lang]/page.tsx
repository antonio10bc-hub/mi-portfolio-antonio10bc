import Link from "next/link";
import Footer from "@/components/Footer";
import TreeSpecimen from "@/components/TreeSpecimen";
import { Arrow, Barcode, Brackets, CornerMark, DataBars, Diamonds, Dots, Leader, XStack } from "@/components/Hud";
import { PHOTOS } from "@/lib/photos";
import { PROJECTS } from "@/lib/projects";
import { dictFor } from "@/lib/i18n";

/*
 * La home es el índice del archivo: el árbol tramado ("Solitude") como
 * espécimen central y, montados encima, el nombre con su línea de referencia
 * y los dos expedientes. En escritorio es una rejilla de 12 columnas y 3 filas
 * (auto, flexible, auto: con filas iguales, la más alta fijaba el alto de las
 * tres y la home dejaba de caber) donde todo se superpone al árbol; en móvil, una columna donde el árbol es el
 * de tamaño acotado: el espacio sobrante queda bajo los paneles y el pie se
 * queda abajo, encuadrado, sin scroll.
 */

function SectionPanel({
  href,
  section,
  number,
  meta,
  title,
  description,
  tone,
  className,
}: {
  href: string;
  /** Nombre fijo para las analíticas (no cambia con el idioma) */
  section: string;
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
      data-track="section_clicked"
      data-track-section={section}
      className={`group relative z-10 block shrink-0 px-7 py-4 transition-colors duration-500 ease-smooth md:p-8
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

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const t = dictFor((await params).lang);
  return (
    // La home entra entera en pantalla, footer incluido, pero sin recortar:
    // si en algun dispositivo no cupiese, hace scroll en lugar de cortarse.
    <div className="min-h-screen-safe w-full bg-paper font-sans text-ink">
      <main className="mx-auto flex min-h-screen-safe h-screen-safe-mobile w-full max-w-6xl flex-col gap-3 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:gap-4 md:px-8 md:py-5">

        <div
          className="relative flex min-h-0 flex-1 flex-col gap-3
                     md:grid md:grid-cols-12 md:grid-rows-[auto_minmax(0,1fr)_auto] md:gap-x-6 md:gap-y-4"
        >
          {/* Espécimen. En móvil parte de su alto natural (ancho x 812/1148) y
              reparte el espacio sobrante a medias con el separador de debajo de las
              tarjetas: el árbol, centrado, gana el mismo aire arriba que abajo y las
              tarjetas bajan, pero sin llegar al fondo. Si falta sitio, se encoge. */}
          <div
            className="reveal relative h-[calc((100vw-2rem)*0.707)] min-h-0 grow shrink
                       md:col-start-3 md:col-end-12 md:row-start-1 md:row-end-4 md:h-auto"
          >
            {/* Antes de pintar nada: si en esta sesión toca la impresión del árbol,
                se marca para que tree.png no asome antes de que el canvas tome el relevo. */}
            <script
              dangerouslySetInnerHTML={{
                __html:
                  "try{if(sessionStorage.getItem('treeIntro')!=='1'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.treeIntro='1'}catch(e){}",
              }}
            />
            <TreeSpecimen alt={t.treeAlt} />
          </div>

          {/* Nombre */}
          <div className="reveal relative z-10 order-first shrink-0 md:order-none md:col-start-1 md:col-end-8 md:row-start-1">
            <div className="flex items-center gap-3">
              <Dots />
              <span className="code text-[11px] md:text-xs">{t.homeCode}</span>
            </div>
            <h1 className="display mt-2 text-[clamp(3.5rem,min(13vw,15vh),10rem)] md:mt-3">antonio.</h1>
            <div className="mt-2 flex items-start gap-4 md:mt-3">
              <p className="font-mono text-xs md:text-sm">{t.homeTagline}</p>
              <Leader length={170} drop={44} className="mt-2 hidden shrink-0 lg:block" />
            </div>
          </div>

          <CornerMark corner="tr" className="absolute right-0 top-0 hidden md:block" />
          <XStack className="hidden md:col-start-1 md:row-start-2 md:flex md:self-center" />
          <Diamonds className="hidden md:col-start-7 md:row-start-2 md:block md:self-start md:justify-self-end" />

          <SectionPanel
            href="/photography"
            section="photography"
            number="01"
            meta={t.frames(PHOTOS.length)}
            title={t.photoPanelTitle}
            description={t.photoPanelText}
            tone="light"
            className="reveal md:col-start-8 md:col-end-13 md:row-start-2 md:self-center"
          />

          <SectionPanel
            href="/projects"
            section="games"
            number="02"
            meta={t.games(PROJECTS.length)}
            title={t.gamesPanelTitle}
            description={t.gamesPanelText}
            tone="dark"
            className="reveal md:col-start-1 md:col-end-6 md:row-start-3 md:self-end"
          />

          {/* Separador móvil: se lleva la otra mitad del espacio sobrante. */}
          <div aria-hidden className="grow md:hidden" />

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
