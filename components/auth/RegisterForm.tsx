'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { registerAction } from '@/actions/auth';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { FormField} from '@/components/ui/FormField';
import { Mail } from 'lucide-react';
import { PasswordStrengthMeter } from '@/components/ui/PasswordStrengthMeter';

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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [state, formAction] = useActionState(registerAction, null);

  useEffect(() => {
    if (state?.success === false) {
      toast.error(state.message ?? 'Ha ocurrido un error');
    }
  }, [state]);

  const serverErrors = state?.zodErrors;

  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-md w-full dark:bg-card p-8 rounded-lg shadow-md bg-card border border-border">
        <h2 className="text-2xl font-semibold text-center mb-6 text-foreground">
          Crear cuenta
        </h2>
        
        <form action={formAction} className="space-y-6">
          <FormField
            label="Usuario"
            id="username"
            name="username"
            type="text"
            placeholder="tu_usuario"
            required
            autoComplete="username"
            icon={<Mail className="w-5 h-5" />}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={serverErrors?.username?.[0]}
          />
          
          <FormField
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="ejemplo@correo.com"
            required
            autoComplete="email"
            icon={<Mail className="w-5 h-5" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={serverErrors?.email?.[0]}
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
              onChange={(e) => setPassword(e.target.value)}
              error={serverErrors?.password?.[0]}
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
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={serverErrors?.confirmPassword?.[0]}
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
