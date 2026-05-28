'use client';

import { useState, useTransition } from 'react';
import { deleteProject } from '@/actions/projects';
import { AlertTriangle, X } from 'lucide-react';
import type { Project } from '@/lib/db/schema';

interface ProjectDeleteDialogProps {
  project: Project;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProjectDeleteDialog({ project, onClose, onSuccess }: ProjectDeleteDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProject(project.id);
      if (result.success) {
        onSuccess();
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h2 className="text-lg font-semibold text-foreground">
              Eliminar Proyecto
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-muted transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <p className="text-foreground mb-2">
          ¿Estás seguro que querés eliminar <strong>{project.title}</strong>?
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Esta acción no se puede deshacer.
        </p>

        {error && (
          <p className="text-sm text-destructive mb-4">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isPending ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
