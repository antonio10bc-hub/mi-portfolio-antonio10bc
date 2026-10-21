import PageBackground from "@/components/PageBackground";
import BackLink from "@/components/BackLink";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import SectionHeader from "@/components/SectionHeader";
import { PROJECTS } from "@/lib/projects";

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen-safe w-full bg-sand font-sans text-offblack">
      <PageBackground />

      <div className="relative z-10 mx-auto flex min-h-screen-safe w-full max-w-6xl flex-col px-4 py-6 md:px-8 md:py-10">
        <BackLink className="mb-6 md:mb-8" />

        <SectionHeader
          className="reveal"
          eyebrow="Selected work"
          title="Projects"
          meta={`${String(PROJECTS.length).padStart(2, "0")} games`}
          intro={
            <>
              Small games, built end to end and shipped.
              <br />
              Each one runs in the browser, no install needed.
            </>
          }
        />

        <div className="mt-6 grid grid-cols-1 gap-4 md:mt-10 md:grid-cols-2 md:gap-6">
          {PROJECTS.map((project, index) => (
            <div
              key={project.name}
              className="reveal"
              style={{ animationDelay: `${80 + index * 70}ms` }}
            >
              <ProjectCard project={project} index={index} />
            </div>
          ))}
        </div>

        <Footer className="mt-14 md:mt-20" />
      </div>
    </div>
  );
}
