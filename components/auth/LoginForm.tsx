"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { FormField } from "@/components/ui/FormField";
import { MailIcon, GoogleIcon, GitHubIcon } from "@/components/Icons";

import { loginAction } from "@/actions/auth";
import { useActionState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
    >
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

export function LoginForm() {
  
  const [, formAction] = useActionState(loginAction, null);

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-card-foreground">
          Welcome Back
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in to your account
        </p>
      </div>

      {/* Formulario de login con email y contraseña. */}
      <form action={formAction} className="space-y-4">
        <FormField
          label="Email"
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
          icon={<MailIcon className="w-5 h-5" />}
        />

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground"
          >
            Password <span className="text-destructive">*</span>
          </label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>

        {/* Opción "recordarme" para sesión extendida y dispositivo de confianza. */}
        <div className="flex items-center">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-ring"
          />
          <label htmlFor="remember" className="ml-2 text-sm text-foreground">
            Remember this device (30 days)
          </label>
        </div>

        <SubmitButton />
      </form>

      {/* Enlace a recuperación de contraseña. */}
      <p className="mt-4 text-center text-sm">
        <Link
          href="/forgot-password"
          className="text-muted-foreground hover:text-foreground hover:underline"
        >
          Forgot password?
        </Link>
      </p>

      {/* Separador para métodos de autenticación alternativos. */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Botones de OAuth (Google y GitHub). */}
      <div className="grid grid-cols-2 gap-3">
        <a
          href={`${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
          }/api/auth/oauth/google`}
          className="flex items-center justify-center gap-2 py-2.5 px-4 border border-border rounded-md bg-background text-foreground hover:bg-muted/50 transition-colors"
        >
          <GoogleIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Google</span>
        </a>
        <a
          href={`${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
          }/api/auth/oauth/github`}
          className="flex items-center justify-center gap-2 py-2.5 px-4 border border-border rounded-md bg-background text-foreground hover:bg-muted/50 transition-colors"
        >
          <GitHubIcon className="w-5 h-5" />
          <span className="text-sm font-medium">GitHub</span>
        </a>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary font-medium hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
