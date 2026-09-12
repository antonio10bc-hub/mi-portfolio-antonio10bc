import AnimatedBackground from "@/components/AnimatedBackground";
import BackLink from "@/components/BackLink";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import SectionHeader from "@/components/SectionHeader";
import { CATEGORY_GROUPS, PROJECTS } from "@/lib/projects";

/** Separador editorial entre grupos: etiqueta, filete y recuento. */
function GroupHeading({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex shrink-0 items-center gap-2">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-lime" />
        <span className="label">{title}</span>
      </span>
      <span aria-hidden className="h-px flex-1 bg-offblack/10" />
      <span className="label shrink-0">{String(count).padStart(2, "0")}</span>
    </div>
  );
}

export default function ProjectsPage() {
  // La numeración es continua a lo largo de la página, no se reinicia por grupo.
  let position = 0;
  const groups = CATEGORY_GROUPS.map(({ category, title }) => ({
    category,
    title,
    items: PROJECTS.filter((project) => project.category === category).map((project) => ({
      project,
      index: position++,
    })),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="relative min-h-screen-safe w-full bg-sand font-sans text-offblack">
      <AnimatedBackground />

      <div className="relative z-10 mx-auto flex min-h-screen-safe w-full max-w-6xl flex-col px-4 py-6 md:px-8 md:py-10">
        <BackLink className="mb-6 md:mb-8" />

        <SectionHeader
          className="reveal"
          eyebrow="Selected work"
          title="Projects"
          meta={`${String(PROJECTS.length).padStart(2, "0")} projects`}
          intro={
            <>
              Side projects and small experiments, built end to end and shipped.
              <br />
              Each one lives on its own domain.
            </>
          }
        />

        {groups.map((group) => (
          <section key={group.category} className="mt-10 md:mt-14">
            <GroupHeading title={group.title} count={group.items.length} />

            <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:grid-cols-2 md:gap-6">
              {group.items.map(({ project, index }) => (
                <div
                  key={project.name}
                  className="reveal"
                  style={{ animationDelay: `${80 + index * 70}ms` }}
                >
                  <ProjectCard project={project} index={index} />
                </div>
              ))}
            </div>
          </section>
        ))}

        <Footer className="mt-14 md:mt-20" />
      </div>
    </div>
  );
}
