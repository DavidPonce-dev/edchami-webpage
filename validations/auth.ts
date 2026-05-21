import { z } from "zod";

export const SigninFormSchema = z.object({
  email: z.email("Please enter a valid email address"),
  remember: z.boolean(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters"),
});

export const SignupFormSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters"),
});

export type SigninFormValues = z.infer<typeof SigninFormSchema>;
export type SignupFormValues = z.infer<typeof SignupFormSchema>;

export type FormState = {
  success?: boolean;
  message?: string;
  data?: {
    email?: string;
    password?: string;
  };
  zodErrors?: {
    email?: string[];
    password?: string[];
  } | null;
};