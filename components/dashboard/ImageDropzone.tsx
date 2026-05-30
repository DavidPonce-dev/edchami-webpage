'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';

interface ImageDropzoneProps {
  value?: string;
  onChange: (url: string) => void;
  error?: string;
}

const ALLOWED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function ImageDropzone({ value, onChange, error }: ImageDropzoneProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setUploading(true);
      setUploadError(null);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Error al subir la imagen');
        }

        const data = await response.json();
        onChange(data.url);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Error al subir la imagen');
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ALLOWED_TYPES,
    maxSize: MAX_SIZE,
    multiple: false,
  });

  const handleRemove = () => {
    onChange('');
    setUploadError(null);
  };

  const hasPreview = value && !value.startsWith('http');

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        Imagen del proyecto
      </label>

      {value ? (
        <div className="relative rounded-md overflow-hidden border border-border">
          <img
            src={value}
            alt="Preview"
            className="w-full h-40 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Remove image"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
            isDragReject
              ? 'border-destructive bg-destructive/5'
              : isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input {...getInputProps()} />

          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
            </div>
          ) : isDragActive ? (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="w-8 h-8 text-primary" />
              <p className="text-sm text-primary font-medium">Soltá la imagen acá</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Arrastrá una imagen o{' '}
                <span className="text-primary font-medium">hacé clic para seleccionar</span>
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG o WebP (máx. 5MB)
              </p>
            </div>
          )}
        </div>
      )}

      {(error || uploadError) && (
        <p className="text-sm text-destructive">{error || uploadError}</p>
      )}
    </div>
  );
}
