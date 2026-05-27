"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { FormField } from "@/components/ui/FormField";
import { Mail } from "lucide-react";

import { loginAction } from "@/actions/auth";
import { useActionState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2 px-4 bg-accent text-accent-foreground font-semibold rounded-md hover:opacity-90 transition text-xs"
    >
      {pending ? "Ingresando..." : "Ingresar"}
    </button>
  );
}

export function LoginForm() {
  const [, formAction] = useActionState(loginAction, null);

  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-md w-full dark:bg-card p-8 rounded-lg shadow-md bg-card border border-border">
        <h2 className="text-2xl font-semibold text-center mb-6 text-foreground">
          Iniciar sesión
        </h2>

        <form action={formAction} className="space-y-6">
          <FormField
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="ejemplo@correo.com"
            required
            autoComplete="email"
            icon={<Mail className="w-5 h-5" />}
          />

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              Contraseña <span className="text-destructive">*</span>
            </label>
            <PasswordInput
              id="password"
              name="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-ring"
            />
            <label htmlFor="remember" className="ml-2 text-xs text-foreground">
              Recordar este dispositivo (30 días)
            </label>
          </div>

          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          ¿No tiene una cuenta?{" "}
          <Link
            href="/register"
            className="text-accent hover:underline font-medium"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
