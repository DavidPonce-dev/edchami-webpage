"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { project as projectTable } from "@/lib/db/schema";
import { ProjectFormSchema, type ProjectFormState } from "@/validations/project";
import { getUser } from "@/lib/auth";
import { sanitizeTags, validateUrl } from "@/lib/security";
import { logger } from "@/lib/logger";

function sanitizeProjectInput(fields: {
  title: string;
  description: string;
  url: string | null;
  imageUrl: string | null;
  tags: string[];
  status: "pending" | "onDevelopment" | "finished";
}) {
  return {
    title: fields.title.trim().slice(0, 255),
    description: fields.description.trim().slice(0, 2000),
    url: validateUrl(fields.url),
    imageUrl: validateUrl(fields.imageUrl),
    tags: sanitizeTags(fields.tags),
    status: fields.status,
  };
}

export async function getProjects() {
  try {
    return db.query.project.findMany({ orderBy: desc(projectTable.createdAt) });
  } catch (error) {
    logger.error("Failed to fetch projects:", error);
    return [];
  }
}

export async function getProjectById(id: number) {
  if (!Number.isInteger(id) || id <= 0) return null;
  try {
    return db.query.project.findFirst({ where: eq(projectTable.id, id) });
  } catch (error) {
    logger.error("Failed to fetch project:", error);
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

  const rawTags = formData.get("tags") as string;
  const fields = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    url: (formData.get("url") as string) || null,
    imageUrl: (formData.get("imageUrl") as string) || null,
    tags: rawTags ? rawTags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
    status: (formData.get("status") as "pending" | "onDevelopment" | "finished") || "pending",
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
    await db.insert(projectTable).values({
      title: sanitized.title,
      description: sanitized.description,
      url: sanitized.url || undefined,
      imageUrl: sanitized.imageUrl || undefined,
      tags: sanitized.tags,
      status: sanitized.status,
    });
    revalidatePath("/projects");
    revalidatePath("/admin");
    return { success: true, message: "Project created successfully" };
  } catch (error) {
    logger.error("Failed to create project:", error);
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

  const rawTags = formData.get("tags") as string;
  const fields = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    url: (formData.get("url") as string) || null,
    imageUrl: (formData.get("imageUrl") as string) || null,
    tags: rawTags ? rawTags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
    status: (formData.get("status") as "pending" | "onDevelopment" | "finished") || "pending",
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
    const existing = await db.query.project.findFirst({ where: eq(projectTable.id, id) });
    if (!existing) {
      return { success: false, message: "Project not found" };
    }

    await db.update(projectTable).set({
      title: sanitized.title,
      description: sanitized.description,
      url: sanitized.url || undefined,
      imageUrl: sanitized.imageUrl || undefined,
      tags: sanitized.tags,
      status: sanitized.status,
    }).where(eq(projectTable.id, id));

    revalidatePath("/projects");
    revalidatePath("/admin");
    return { success: true, message: "Project updated successfully" };
  } catch (error) {
    logger.error("Failed to update project:", error);
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
    const existing = await db.query.project.findFirst({ where: eq(projectTable.id, id) });
    if (!existing) {
      return { success: false, message: "Project not found" };
    }

    await db.delete(projectTable).where(eq(projectTable.id, id));
    revalidatePath("/projects");
    revalidatePath("/admin");
    return { success: true, message: "Project deleted successfully" };
  } catch (error) {
    logger.error("Failed to delete project:", error);
    return { success: false, message: "Failed to delete project" };
  }
}
