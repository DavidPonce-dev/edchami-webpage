import { z } from "zod";

export const ProjectFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be less than 2000 characters"),
  url: z
    .string()
    .max(255, "URL must be less than 255 characters")
    .url("Please enter a valid URL")
    .or(z.literal(""))
    .nullable(),
  imageUrl: z
    .string()
    .max(255, "Image URL must be less than 255 characters")
    .url("Please enter a valid image URL")
    .or(z.literal(""))
    .nullable(),
  tags: z
    .array(z.string())
    .default([]),
  status: z
    .enum(["pending", "onDevelopment", "finished"])
    .default("pending"),
});

export type ProjectFormValues = z.infer<typeof ProjectFormSchema>;

export type ProjectFormState = {
  success?: boolean;
  message?: string;
  data?: Partial<ProjectFormValues>;
  zodErrors?: {
    title?: string[];
    description?: string[];
    url?: string[];
    imageUrl?: string[];
    tags?: string[];
    status?: string[];
  } | null;
};
