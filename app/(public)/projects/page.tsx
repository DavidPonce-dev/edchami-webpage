import { useProjects } from "@/data/projects";
import ProjectCard from "@/components/projects/ProjectCard";

export default function ProjectsPage() {
  const { projects } = useProjects();

  return (
    <div className="px-4">
      <div className="text-center text-xl underline bold font-bold p-5 text-black dark:text-slate-300">
        <h1 className="text-3xl md:text-3xl my-3 font-bold glitch">
          Proyectos
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-gray-400">
        {projects.slice(0, 3).map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </div>
  );
}
