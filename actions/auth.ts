"use server";
import { z } from "zod";
import { redirect } from "next/navigation";

import { SignupFormSchema, SigninFormSchema, type FormState } from "@/validations/auth";
import { loginService, registerService } from "@/lib/auth";
import { rateLimitAuth } from "@/lib/rate-limit";

export async function registerAction(
  prevState: FormState | null,
  formData: FormData,
): Promise<FormState | null> {
  const email = formData.get("email") as string;
  const rateLimit = rateLimitAuth(email || "unknown");
  if (!rateLimit.allowed) {
    return {
      success: false,
      message: `Demasiados intentos. Intente en ${rateLimit.retryAfter} segundos.`,
      zodErrors: null,
    };
  }

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const fields = {
    password,
    email,
    username: formData.get("username") as string,
  };

  const validatedFields = SignupFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);

    return {
      success: false,
      message: "Validation error",
      zodErrors: flattenedErrors.fieldErrors,
      data: fields,
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      message: "Validation error",
      zodErrors: { confirmPassword: ["Las contraseñas no coinciden"] },
      data: fields,
    };
  }

  const response = await registerService(validatedFields.data);

  if (!response || response.error) {
    return {
      success: false,
      message: "Registration error",
      zodErrors: null,
    };
  }
  redirect("/login");
}

export async function loginAction(prevState: FormState | null, formData: FormData): Promise<FormState | null> {
  const email = formData.get("email") as string;
  const rateLimit = rateLimitAuth(email || "unknown");
  if (!rateLimit.allowed) {
    return {
      success: false,
      message: `Demasiados intentos. Intente en ${rateLimit.retryAfter} segundos.`,
      zodErrors: null,
    };
  }

  const fields = {
    password: formData.get("password") as string,
    email,
    remember: formData.get("remember") === "on",
  };

  const validatedFields = SigninFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    return {
      success: false,
      message: "Validation error",
      zodErrors: flattenedErrors.fieldErrors,
    };
  }

  const response = await loginService(validatedFields.data);
  if (!response || response.error) {
    return {
      success: false,
      message: "Login error",
    };
  }

  redirect("/dashboard");
}
