'use client';

/**
 * =====================================================
 * Formulario de Registro (RegisterForm)
 * =====================================================
 * Este componente maneja el registro de nuevos usuarios
 * con validación de fortaleza de contraseña en tiempo real.
 */

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
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

/**
 * Botón de envío del formulario con estado de carga.
 */
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
    >
      {pending ? 'Creating account...' : 'Create account'}
    </button>
  );
}

/**
 * Formulario de registro de nuevos usuarios.
 * Incluye campos para nombre, email y contraseña,
 * con validación de fortaleza de contraseña en tiempo real.
 */
export function RegisterForm() {
  // Estados para el indicador de fortaleza de contraseña.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  
  const [state, formAction] = useActionState(registerAction, null);

  // Muestra toast si hay error de registro.
  useEffect(() => {
    if (state?.success === false) {
      toast.error(state.message ?? 'An error occurred');
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
    <div className="bg-card border border-border rounded-lg shadow-lg p-8">
      <div className="text-center mb-6">
      <h1 className="text-2xl font-semibold text-card-foreground">Create Account</h1>
      <p className="text-sm text-muted-foreground mt-1">Sign up for a new account</p>
      </div>
      
      {/* Formulario de registro con Server Actions. */}
      <form action={formAction} onSubmit={handleSubmit} className="space-y-4">

        {/* Campo de email. */}
        <FormField
          label="Email"
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
          icon={<MailIcon className="w-5 h-5" />}
          value={email}
          onChange={(e) => { setEmail(e.target.value); handleFieldChange('email'); }}
          error={fieldErrors.email}
        />
        
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            Password <span className="text-destructive">*</span>
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
          <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
          {/* Indicador de fortaleza de contraseña en tiempo real. */}
          <PasswordStrengthMeter password={password} />
        </div>

        <div className="space-y-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
            Confirm Password <span className="text-destructive">*</span>
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

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
