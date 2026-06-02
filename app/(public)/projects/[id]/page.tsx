import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProjectById } from "@/actions/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(parseInt(id));

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const baseUrl = getBaseUrl();
  const imageUrl = project.imageUrl?.startsWith("/")
    ? `${baseUrl}${project.imageUrl}`
    : project.imageUrl;

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} | EdChami`,
      description: project.description,
      type: "article",
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: project.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | EdChami`,
      description: project.description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(parseInt(id));

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <ProjectCard project={project} />
    </div>
  );
}
