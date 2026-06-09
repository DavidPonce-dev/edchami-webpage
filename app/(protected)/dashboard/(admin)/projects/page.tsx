import { getProjects } from '@/actions/projects';
import { ProjectTable } from '@/components/dashboard/ProjectTable';

export default async function DashboardProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Proyectos
      </h1>
      <ProjectTable projects={projects} />
    </div>
  );
}
