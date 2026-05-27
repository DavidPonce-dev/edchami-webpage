"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDB } from "@/lib/db";
import { Project } from "@/entities/Project";
import { ProjectFormSchema, type ProjectFormState } from "@/validations/project";
import { getUser } from "@/lib/auth";
import { sanitizeString, validateUrl, sanitizeTags } from "@/lib/security";

function sanitizeProjectInput(fields: {
  title: string;
  description: string;
  url: string | null;
  imageUrl: string | null;
  tags: string[];
  status: "pending" | "onDevelopment" | "finished";
}) {
  return {
    title: sanitizeString(fields.title).slice(0, 255),
    description: sanitizeString(fields.description).slice(0, 2000),
    url: validateUrl(fields.url),
    imageUrl: validateUrl(fields.imageUrl),
    tags: sanitizeTags(fields.tags),
    status: fields.status,
  };
}

export async function getProjects(): Promise<Project[]> {
  try {
    const db = await getDB();
    return db.getRepository(Project).find({ order: { createdAt: "DESC" } });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export async function getProjectById(id: number): Promise<Project | null> {
  if (!Number.isInteger(id) || id <= 0) return null;
  try {
    const db = await getDB();
    return db.getRepository(Project).findOneBy({ id });
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null;
  }
}

export async function createProject(
  prevState: ProjectFormState | null,
  formData: FormData,
): Promise<ProjectFormState | null> {
  const user = await getUser();
  if (user?.role !== "admin") {
    return { success: false, message: "Unauthorized: Admin access required" };
  }

  const rawTags = formData?.get("tags") as string;
  const fields = {
    title: formData?.get("title") as string,
    description: formData?.get("description") as string,
    url: (formData?.get("url") as string) || null,
    imageUrl: (formData?.get("imageUrl") as string) || null,
    tags: rawTags ? rawTags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
    status: (formData?.get("status") as "pending" | "onDevelopment" | "finished") || "pending",
  };

  const validatedFields = ProjectFormSchema.safeParse(fields);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation error",
      zodErrors: z.flattenError(validatedFields.error).fieldErrors,
      data: fields,
    };
  }

  const sanitized = sanitizeProjectInput(validatedFields.data);

  try {
    const db = await getDB();
    const project = db.getRepository(Project).create({
      title: sanitized.title,
      description: sanitized.description,
      url: sanitized.url || undefined,
      imageUrl: sanitized.imageUrl || undefined,
      tags: sanitized.tags,
      status: sanitized.status,
    });
    await db.getRepository(Project).save(project);
    revalidatePath("/projects");
    revalidatePath("/admin");
    return { success: true, message: "Project created successfully" };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, message: "Failed to create project" };
  }
}

export async function updateProject(
  id: number,
  prevState: ProjectFormState | null,
  formData: FormData,
): Promise<ProjectFormState | null> {
  if (!Number.isInteger(id) || id <= 0) {
    return { success: false, message: "Invalid project ID" };
  }

  const user = await getUser();
  if (user?.role !== "admin") {
    return { success: false, message: "Unauthorized: Admin access required" };
  }

  const rawTags = formData?.get("tags") as string;
  const fields = {
    title: formData?.get("title") as string,
    description: formData?.get("description") as string,
    url: (formData?.get("url") as string) || null,
    imageUrl: (formData?.get("imageUrl") as string) || null,
    tags: rawTags ? rawTags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
    status: (formData?.get("status") as "pending" | "onDevelopment" | "finished") || "pending",
  };

  const validatedFields = ProjectFormSchema.safeParse(fields);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation error",
      zodErrors: z.flattenError(validatedFields.error).fieldErrors,
      data: fields,
    };
  }

  const sanitized = sanitizeProjectInput(validatedFields.data);

  try {
    const db = await getDB();
    const project = await db.getRepository(Project).findOneBy({ id });
    if (!project) {
      return { success: false, message: "Project not found" };
    }

    db.getRepository(Project).merge(project, {
      title: sanitized.title,
      description: sanitized.description,
      url: sanitized.url || undefined,
      imageUrl: sanitized.imageUrl || undefined,
      tags: sanitized.tags,
      status: sanitized.status,
    });
    await db.getRepository(Project).save(project);
    revalidatePath("/projects");
    revalidatePath("/admin");
    return { success: true, message: "Project updated successfully" };
  } catch (error) {
    console.error("Failed to update project:", error);
    return { success: false, message: "Failed to update project" };
  }
}

export async function deleteProject(id: number): Promise<{ success: boolean; message: string }> {
  if (!Number.isInteger(id) || id <= 0) {
    return { success: false, message: "Invalid project ID" };
  }

  const user = await getUser();
  if (user?.role !== "admin") {
    return { success: false, message: "Unauthorized: Admin access required" };
  }

  try {
    const db = await getDB();
    const project = await db.getRepository(Project).findOneBy({ id });
    if (!project) {
      return { success: false, message: "Project not found" };
    }

    await db.getRepository(Project).remove(project);
    revalidatePath("/projects");
    revalidatePath("/admin");
    return { success: true, message: "Project deleted successfully" };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, message: "Failed to delete project" };
  }
}
