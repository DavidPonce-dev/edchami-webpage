import { getProjects } from "@/actions/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { Metadata } from "next";
import type { Project } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proyectos — Portafolio de Eduardo Chami",
  description:
    "Proyectos de desarrollo web, IoT y hardware de Eduardo Chami. Desarrollador Full Stack en Chile.",
  keywords: [
    "proyectos desarrollo web Chile",
    "portafolio desarrollador Chile",
    "proyectos IoT Chile",
    "Eduardo Chami proyectos",
  ],
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="px-4">
      <div className="text-center text-xl underline bold font-bold p-5 text-black dark:text-slate-300">
        <h1 className="text-3xl md:text-3xl my-3 font-bold glitch">
          Proyectos
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-gray-400">
        {projects.slice(0, 3).map((project: Project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
