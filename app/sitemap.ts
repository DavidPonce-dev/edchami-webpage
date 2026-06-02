import { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import { db } from "@/lib/db";
import { project as projectTable } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

const routes = [
  { path: "/", priority: 1.0 },
  { path: "/projects", priority: 0.8 },
  { path: "/contact", priority: 0.7 },
  { path: "/login", priority: 0.3 },
  { path: "/register", priority: 0.3 },
  { path: "/dashboard", priority: 0.2 },
  { path: "/dashboard/admin", priority: 0.1 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const staticRoutes = routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.path === "/" ? "weekly" as const : "monthly" as const,
    priority: route.priority,
  }));

  try {
    const projects = await db
      .select({ id: projectTable.id, updatedAt: projectTable.updatedAt })
      .from(projectTable)
      .orderBy(desc(projectTable.createdAt));

    const projectRoutes = projects.map((project) => ({
      url: `${baseUrl}/projects/${project.id}`,
      lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...projectRoutes];
  } catch {
    return staticRoutes;
  }
}
