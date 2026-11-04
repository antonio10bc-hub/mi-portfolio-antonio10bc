import { Cross } from "@/components/Ink";
import FloatingWork, { type Work } from "@/components/FloatingWork";
import { SpellMarks, SpellPills } from "@/components/HomeControls";
import JsonLd from "@/components/JsonLd";
import { SpellCaption, SpellProvider } from "@/components/SpellProvider";
import TopBar from "@/components/TopBar";
import WizardButton from "@/components/WizardButton";
import { PHOTOS } from "@/lib/photos";
import { PROJECTS } from "@/lib/projects";
import { dictFor, isLang } from "@/lib/i18n";
import { PERSON, SITE_URL } from "@/lib/site";

/*
 * La home es una escena, con la composición de una página de juego infantil: una
 * barra mínima arriba, en el centro una frase escrita a mano sobre una sola obra
 * que flota (va pasando por fotos y juegos) sostenida por la varita del mago con
 * sus dos gatos, y abajo las píldoras de navegación y las siete marcas de
 * hechizo. Pulsar el mago (o "lanza un hechizo") abre el minijuego en la propia
 * home. **Cabe en una pantalla sin scroll**: la escena es lo único flexible.
 */

/** Fotos que pasan por la escena, intercaladas con los juegos. */
const FEATURED_PHOTOS = [0, 2, 4, 5, 8, 12];

/** Cruces sueltas alrededor, como estrellas a boli. Solo en escritorio. */
const STARS = [
  { className: "left-[8%] top-[30%] h-3 w-3", delay: "0s" },
  { className: "left-[62%] top-[6%] h-4 w-4", delay: "1.2s" },
  { className: "right-[3%] top-[18%] h-3.5 w-3.5", delay: "0.6s" },
  { className: "left-[4%] bottom-[12%] h-3 w-3", delay: "2s" },
  { className: "right-[30%] bottom-[6%] h-2.5 w-2.5", delay: "2.8s" },
];

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = dictFor(lang);
  const safeLang = isLang(lang) ? lang : "en";
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

  // Una foto, un juego, una foto... Los juegos llevan a su entrada en /projects.
  const photos: Work[] = FEATURED_PHOTOS.map((i) => ({ kind: "photo", src: PHOTOS[i].src, title: PHOTOS[i].title, href: "/photography" }));
  const games: Work[] = PROJECTS.map((p, i) => ({ kind: "game", src: p.screenshot, title: p.name, href: `/projects#game-${i + 1}`, unoptimized: true }));
  const works = photos.flatMap((photo, i) => (games[i] ? [photo, games[i]] : [photo]));

  return (
    // La home entra entera en pantalla, sin recortar: si en algún dispositivo no
    // cupiese, hace scroll en lugar de cortarse.
    <div className="min-h-screen-safe w-full bg-paper font-sans text-ink">
      <main className="page flex min-h-screen-safe h-screen-safe-mobile flex-col gap-3 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:gap-4 md:py-5">
        <JsonLd data={jsonLd} />
        <TopBar lang={lang} />

        <SpellProvider lang={safeLang}>
          {/* La escena: la frase y, debajo, la obra que flota y el mago que la sostiene. */}
          <section className="relative flex min-h-0 flex-1 flex-col">
            {STARS.map((star, i) => (
              <Cross key={i} className={`absolute hidden animate-twinkle text-ink md:block ${star.className}`} style={{ animationDelay: star.delay }} />
            ))}

            {/* En el minijuego, la frase deja su sitio al marcador y a los mensajes. */}
            <SpellCaption className="relative z-10 shrink-0 text-[clamp(1.05rem,min(3vw,4.2vh),2.5rem)] md:ml-[14%] md:mt-[clamp(0rem,3vh,2rem)]" />

            {/* Aire entre la frase y la obra: el marco sobresale y la obra sube al flotar. */}
            <div className="relative mt-6 min-h-0 flex-1 md:mt-12">
              <div className="absolute left-0 top-0 h-[64%] w-[82%] md:left-[14%] md:h-full md:w-[40%]">
                <FloatingWork works={works} labels={{ photo: t.photoKind, game: t.gameKind }} sizes="(max-width: 768px) 82vw, 40vw" />
              </div>
              <div className="absolute bottom-0 right-0 z-10 aspect-[240/290] h-[40%] md:right-[6%] md:h-[82%]">
                <WizardButton />
              </div>
            </div>
          </section>

          {/* Abajo: las píldoras en el centro y los hechizos a la derecha. La columna
              izquierda queda vacía para que las píldoras sigan centradas. */}
          <div className="grid shrink-0 gap-3 md:grid-cols-[1fr_auto_1fr] md:items-end md:gap-6">
            <div aria-hidden className="hidden md:block" />
            <div className="order-1 md:order-none">
              <SpellPills instagram={PERSON.instagram} />
            </div>
            <div className="order-2 flex justify-center md:order-none md:justify-end">
              <SpellMarks />
            </div>
          </div>
        </SpellProvider>
      </main>
    </div>
  );
}
