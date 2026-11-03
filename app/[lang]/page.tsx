import Link from "next/link";
import Footer from "@/components/Footer";
import { Cross, InkArrow, Wizard } from "@/components/Ink";
import { Scribble, ScribbleCircle } from "@/components/InkBox";
import { PHOTOS } from "@/lib/photos";
import { PROJECTS } from "@/lib/projects";
import { dictFor } from "@/lib/i18n";
import JsonLd from "@/components/JsonLd";
import { PERSON, SITE_URL } from "@/lib/site";

/*
 * La home es la primera página del cuaderno: el nombre rotulado a mano, subrayado
 * de un trazo, y el mago, que se dibuja solo al llegar y lanza chispas con la
 * varita hacia los dos "hechizos" (Fotografía y Juegos). En escritorio, dos
 * columnas: texto a la izquierda, mago a la derecha apuntando a los enlaces. En
 * móvil, una columna de alto exacto en la que el mago se encoge primero.
 */

function Spell({
  href,
  section,
  title,
  note,
  seed,
  delay,
}: {
  href: string;
  /** Nombre fijo para las analíticas (no cambia con el idioma) */
  section: string;
  title: string;
  note: string;
  seed: string;
  delay: number;
}) {
  return (
    <Link
      href={href}
      data-track="section_clicked"
      data-track-section={section}
      className="spell group reveal flex w-fit items-center gap-3 md:gap-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="relative">
        <ScribbleCircle seed={seed} hover />
        <span className="hand-display block text-[clamp(2rem,min(7vw,9vh),5.25rem)]">{title}</span>
      </span>
      <span className="flex flex-col items-start gap-1">
        {/* En un móvil estrecho la nota puede partirse en dos líneas. */}
        <span className="note md:whitespace-nowrap">({note})</span>
        <InkArrow
          seed={`${seed}-arrow`}
          className="h-4 w-12 text-ink transition-transform duration-500 ease-spring group-hover:translate-x-2 md:h-5 md:w-16"
        />
      </span>
    </Link>
  );
}

/** Cruces sueltas alrededor, como estrellas a boli. Solo en escritorio. */
const STARS = [
  { className: "left-[46%] top-[6%] h-4 w-4", delay: "0s" },
  { className: "left-[58%] top-[30%] h-3 w-3", delay: "1.2s" },
  { className: "left-[30%] top-[14%] h-3.5 w-3.5", delay: "0.6s" },
  { className: "right-[2%] top-[12%] h-5 w-5", delay: "2s" },
  { className: "right-[30%] bottom-[8%] h-3 w-3", delay: "2.8s" },
];

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = dictFor(lang);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: PERSON.name,
        alternateName: PERSON.shortName,
        url: SITE_URL,
        image: `${SITE_URL}/icons/icon-512.png`,
        jobTitle: t.homeTagline.replace(/\.$/, ""),
        address: { "@type": "PostalAddress", addressLocality: PERSON.city, addressCountry: PERSON.country },
        sameAs: [PERSON.instagram, PERSON.github],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Antonio Asis",
        description: t.homeDescription,
        inLanguage: ["en", "es"],
        publisher: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };

  return (
    // La home entra entera en pantalla, footer incluido, pero sin recortar:
    // si en algun dispositivo no cupiese, hace scroll en lugar de cortarse.
    <div className="min-h-screen-safe w-full bg-paper font-sans text-ink">
      <main className="page flex min-h-screen-safe h-screen-safe-mobile flex-col gap-2 pt-5 pb-[max(1rem,env(safe-area-inset-bottom))] md:gap-4 md:py-6">
        <JsonLd data={jsonLd} />

        <div className="relative flex min-h-0 flex-1 flex-col gap-3 md:grid md:grid-cols-12 md:gap-x-8">
          {STARS.map((star, i) => (
            <Cross
              key={i}
              className={`absolute hidden animate-twinkle text-ink md:block ${star.className}`}
              style={{ animationDelay: star.delay }}
            />
          ))}

          {/* Nombre y hechizos */}
          <div className="relative z-10 flex shrink-0 flex-col justify-center md:col-span-7 md:min-h-0">
            <div className="reveal flex items-end gap-2">
              <span className="note -rotate-3 text-[15px] text-ink md:text-lg">{t.homeHello}</span>
              <InkArrow seed="hello" direction="down" curl className="mb-1 h-5 w-10 md:h-6 md:w-12" draw delay={0.3} />
            </div>

            <h1 className="hand-display wiggle mt-1 text-[clamp(4rem,min(17vw,21vh),12.5rem)]">antonio</h1>
            <Scribble seed="name" draw delay={0.5} className="mt-1 h-3 w-[min(70vw,38rem)] md:mt-2 md:h-5" />

            <p className="hand reveal mt-3 max-w-md text-mute md:mt-5 md:text-lg" style={{ animationDelay: "250ms" }}>
              {t.homeTagline}
            </p>

            <nav aria-label={t.sections} className="mt-4 hidden flex-col gap-3 md:mt-[clamp(1rem,5vh,3.5rem)] md:flex md:gap-[clamp(0.5rem,2.5vh,1.5rem)]">
              <Spell href="/photography" section="photography" title={t.photoPanelTitle} note={t.frames(PHOTOS.length)} seed="spell-photo" delay={350} />
              <Spell href="/projects" section="games" title={t.gamesPanelTitle} note={t.games(PROJECTS.length)} seed="spell-games" delay={450} />
            </nav>
          </div>

          {/* El mago: en móvil se encoge primero; en escritorio llena su columna. */}
          <div className="relative min-h-[7rem] flex-1 md:col-span-5 md:col-start-8 md:min-h-0">
            <div className="absolute inset-0">
              <Wizard title={t.wizardAlt} hint={t.homeHint} className="origin-bottom animate-bob" />
            </div>
          </div>

          {/* En móvil los hechizos van bajo el mago. */}
          <nav aria-label={t.sections} className="mb-2 flex shrink-0 flex-col gap-1 md:hidden">
            <Spell href="/photography" section="photography" title={t.photoPanelTitle} note={t.frames(PHOTOS.length)} seed="spell-photo" delay={0} />
            <Spell href="/projects" section="games" title={t.gamesPanelTitle} note={t.games(PROJECTS.length)} seed="spell-games" delay={0} />
          </nav>
        </div>

        <Footer lang={lang} />
      </main>
    </div>
  );
}
