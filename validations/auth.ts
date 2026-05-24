import { z } from "zod";

export const SigninFormSchema = z.object({
  email: z.email("Please enter a valid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .optional(),
  remember: z.boolean(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters"),
});

export const SignupFormSchema = z.object({
  email: z.email("Please enter a valid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters"),
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
    username?: string;
    password?: string;
  };
  zodErrors?: {
    email?: string[];
    username?: string[];
    password?: string[];
  } | null;
};