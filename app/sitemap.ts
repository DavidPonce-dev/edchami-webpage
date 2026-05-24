import { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/getBaseUrl";

const routes = [
  { path: "/", priority: 1.0 },
  { path: "/projects", priority: 0.8 },
  { path: "/contact", priority: 0.7 },
  { path: "/login", priority: 0.3 },
  { path: "/register", priority: 0.3 },
  { path: "/dashboard", priority: 0.2 },
  { path: "/admin", priority: 0.1 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.path === "/" ? "weekly" : "monthly",
    priority: route.priority,
  }));
}
