'use client';

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import type { Project } from '@/lib/db/schema';
import type { ProjectFormState, ProjectFormValues } from '@/validations/project';
import { createProject, updateProject } from '@/actions/projects';
import { X } from 'lucide-react';

const inputStyles = "w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const textareaStyles = "w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-[80px]";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
    >
      {pending ? 'Guardando...' : 'Guardar'}
    </button>
  );
}

interface ProjectFormModalProps {
  project?: Project | null;
  mode: 'create' | 'edit';
  onClose: () => void;
  onSuccess: () => void;
}

export function ProjectFormModal({ project, mode, onClose, onSuccess }: ProjectFormModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const isEdit = mode === 'edit';

  const initialState: ProjectFormState = {
    success: false,
    message: '',
    data: isEdit && project ? {
      title: project.title,
      description: project.description,
      url: project.url || '',
      imageUrl: project.imageUrl || '',
      tags: Array.isArray(project.tags) ? project.tags : [],
      status: project.status as ProjectFormValues['status'],
    } : undefined,
  };

  const action = isEdit && project
    ? updateProject.bind(null, project.id)
    : createProject;

  const [state, formAction] = useFormState(action, initialState);

  useEffect(() => {
    if (state?.success) {
      onSuccess();
    }
  }, [state?.success, onSuccess]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const tagsValue = isEdit && project
    ? (Array.isArray(project.tags) ? project.tags.join(', ') : '')
    : (state?.data?.tags ? state.data.tags.join(', ') : '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className="relative bg-card border border-border rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {isEdit ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-muted transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form action={formAction} className="p-4 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="title" className="block text-sm font-medium text-foreground">
              Título <span className="text-destructive">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={state?.data?.title || (isEdit && project ? project.title : '')}
              className={`${inputStyles} ${state?.zodErrors?.title ? 'border-destructive focus:ring-destructive' : ''}`}
              placeholder="Mi proyecto"
            />
            {state?.zodErrors?.title && (
              <p className="text-sm text-destructive">{state.zodErrors.title[0]}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-sm font-medium text-foreground">
              Descripción <span className="text-destructive">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              defaultValue={state?.data?.description || (isEdit && project ? project.description : '')}
              className={`${textareaStyles} ${state?.zodErrors?.description ? 'border-destructive focus:ring-destructive' : ''}`}
              placeholder="Descripción del proyecto..."
            />
            {state?.zodErrors?.description && (
              <p className="text-sm text-destructive">{state.zodErrors.description[0]}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="url" className="block text-sm font-medium text-foreground">
              URL
            </label>
            <input
              id="url"
              name="url"
              type="url"
              defaultValue={state?.data?.url || (isEdit && project ? project.url || '' : '')}
              className={`${inputStyles} ${state?.zodErrors?.url ? 'border-destructive focus:ring-destructive' : ''}`}
              placeholder="https://mi-proyecto.com"
            />
            {state?.zodErrors?.url && (
              <p className="text-sm text-destructive">{state.zodErrors.url[0]}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-foreground">
              URL de imagen
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              defaultValue={state?.data?.imageUrl || (isEdit && project ? project.imageUrl || '' : '')}
              className={`${inputStyles} ${state?.zodErrors?.imageUrl ? 'border-destructive focus:ring-destructive' : ''}`}
              placeholder="https://mi-proyecto.com/imagen.jpg"
            />
            {state?.zodErrors?.imageUrl && (
              <p className="text-sm text-destructive">{state.zodErrors.imageUrl[0]}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tags" className="block text-sm font-medium text-foreground">
              Tags
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              defaultValue={tagsValue}
              className={inputStyles}
              placeholder="react, typescript, nextjs"
            />
            {state?.zodErrors?.tags && (
              <p className="text-sm text-destructive">{state.zodErrors.tags[0]}</p>
            )}
            <p className="text-xs text-muted-foreground">Separados por comas</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="status" className="block text-sm font-medium text-foreground">
              Estado
            </label>
            <select
              id="status"
              name="status"
              defaultValue={state?.data?.status || (isEdit && project ? project.status : 'pending')}
              className={inputStyles}
            >
              <option value="pending">Pendiente</option>
              <option value="onDevelopment">En desarrollo</option>
              <option value="finished">Finalizado</option>
            </select>
            {state?.zodErrors?.status && (
              <p className="text-sm text-destructive">{state.zodErrors.status[0]}</p>
            )}
          </div>

          {state?.message && !state.success && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
