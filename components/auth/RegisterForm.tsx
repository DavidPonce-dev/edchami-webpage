'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { registerAction } from '@/actions/auth';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { FormField} from '@/components/ui/FormField';
import { MailIcon } from '@/components/Icons';
import { PasswordStrengthMeter } from '@/components/ui/PasswordStrengthMeter';

interface FieldErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const registerSchema = z.object({
  email: z.email('Correo electrónico no válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string().min(1, 'Por favor confirme su contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2 px-4 bg-accent text-accent-foreground font-semibold rounded-md hover:opacity-90 transition text-xs"
    >
      {pending ? 'Creando cuenta...' : 'Registrarse'}
    </button>
  );
}

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  
  const [state, formAction] = useActionState(registerAction, null);

  useEffect(() => {
    if (state?.success === false) {
      toast.error(state.message ?? 'Ha ocurrido un error');
    }
  }, [state]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    };

    const result = registerSchema.safeParse(data);
    if (!result.success) {
      e.preventDefault();
      const errors: FieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FieldErrors;
        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      });
      setFieldErrors(errors);
    } else {
      setFieldErrors({});
    }
  }

  function handleFieldChange(field: keyof FieldErrors) {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-md w-full dark:bg-card p-8 rounded-lg shadow-md bg-card border border-border">
        <h2 className="text-2xl font-semibold text-center mb-6 text-foreground">
          Crear cuenta
        </h2>
        
        <form action={formAction} onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="ejemplo@correo.com"
            required
            autoComplete="email"
            icon={<MailIcon className="w-5 h-5" />}
            value={email}
            onChange={(e) => { setEmail(e.target.value); handleFieldChange('email'); }}
            error={fieldErrors.email}
          />
          
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Contraseña <span className="text-destructive">*</span>
            </label>
            <PasswordInput
              id="password"
              name="password"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(e) => { setPassword(e.target.value); handleFieldChange('password'); }}
              error={fieldErrors.password}
            />
            <p className="text-xs text-muted-foreground">Mínimo 8 caracteres</p>
            <PasswordStrengthMeter password={password} />
          </div>

          <div className="space-y-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
              Confirmar Contraseña <span className="text-destructive">*</span>
            </label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); handleFieldChange('confirmPassword'); }}
              error={fieldErrors.confirmPassword}
            />
          </div>

          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          ¿Ya tiene una cuenta?{' '}
          <Link href="/login" className="text-accent hover:underline font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
