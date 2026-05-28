'use client';

import { useState } from 'react';
import type { Project } from '@/lib/db/schema';
import { StatusBadge } from './StatusBadge';
import { ProjectFormModal } from './ProjectFormModal';
import { ProjectDeleteDialog } from './ProjectDeleteDialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface ProjectTableProps {
  projects: Project[];
}

export function ProjectTable({ projects }: ProjectTableProps) {
  const [projectList, setProjectList] = useState<Project[]>(projects);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const refreshProjects = async () => {
    const { getProjects } = await import('@/actions/projects');
    const updated = await getProjects();
    setProjectList(updated);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    refreshProjects();
  };

  const handleEditSuccess = () => {
    setEditingProject(null);
    refreshProjects();
  };

  const handleDeleteSuccess = () => {
    setDeletingProject(null);
    refreshProjects();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Proyectos ({projectList.length})
        </h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-secondary transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Nuevo Proyecto
        </button>
      </div>

      {projectList.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            No hay proyectos todavía. Creá el primero.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Título</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Estado</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground hidden lg:table-cell">Tags</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground hidden md:table-cell">Creado</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projectList.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{project.title}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {project.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(project.tags) && project.tags.map((tag: string, i: number) => (
                          <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                      {formatDate(project.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingProject(project)}
                          className="p-1.5 rounded hover:bg-muted transition-colors"
                          aria-label="Editar proyecto"
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </button>
                        <button
                          onClick={() => setDeletingProject(project)}
                          className="p-1.5 rounded hover:bg-destructive/10 transition-colors"
                          aria-label="Eliminar proyecto"
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCreateModal && (
        <ProjectFormModal
          mode="create"
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {editingProject && (
        <ProjectFormModal
          project={editingProject}
          mode="edit"
          onClose={() => setEditingProject(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {deletingProject && (
        <ProjectDeleteDialog
          project={deletingProject}
          onClose={() => setDeletingProject(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
