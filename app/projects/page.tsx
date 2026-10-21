import BackLink from "@/components/BackLink";
import Footer from "@/components/Footer";
import { Barcode, DataBars, Diamonds, PixelGlyph, Slashes } from "@/components/Hud";
import ProjectCard from "@/components/ProjectCard";
import SectionHeader from "@/components/SectionHeader";
import { PROJECTS } from "@/lib/projects";

const count = String(PROJECTS.length).padStart(2, "0");

/** Columna de datos de la cabecera: textura, no información. */
function HeaderData() {
  return (
    <div aria-hidden className="hidden text-ink md:block">
      <div className="flex items-center justify-between">
        <Slashes className="text-sm">Index</Slashes>
        <div className="flex items-center gap-3">
          <Diamonds />
          <PixelGlyph mask={0b110011101} />
        </div>
      </div>
      <DataBars seed="projects" className="mt-5" />
      <Barcode seed="antonio-projects" className="mt-5 h-14 w-full" />
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen-safe w-full bg-paper font-sans text-ink">
      <div className="mx-auto flex min-h-screen-safe w-full max-w-6xl flex-col px-4 py-5 md:px-8 md:py-8">
        <BackLink />

        <SectionHeader
          className="reveal mt-6 md:mt-8"
          eyebrow="Selected work"
          title="Games"
          code="File 02 // Browser games"
          meta={`${count} games`}
          intro={
            <>
              Small games, built end to end and shipped.
              <br />
              Each one runs in the browser, no install needed.
            </>
          }
          aside={<HeaderData />}
        />

        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-14 md:mt-14 md:grid-cols-2 md:gap-y-20">
          {PROJECTS.map((project, index) => (
            <div key={project.name} className="reveal" style={{ animationDelay: `${80 + index * 70}ms` }}>
              <ProjectCard project={project} index={index} />
            </div>
          ))}
        </div>

        <Footer className="mt-16 md:mt-24" />
      </div>
    </div>
  );
}
