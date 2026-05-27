import type { Project } from "@/lib/db/schema";

export function ProjectCard({ project }: { project: Project }) {
  const { title, url, imageUrl, description, tags, status } = project;
  const isFinished = status === "finished";

  const statusLabels: Record<string, string> = {
    pending: "PENDIENTE",
    onDevelopment: "EN DESARROLLO",
    finished: "FINALIZADO",
  };

  const statusLabel = statusLabels[status] || status.toUpperCase();

  return (
    <div
      style={{ backgroundImage: `url(${imageUrl || "/img/projects/default.jpg"})` }}
      className="h-52 relative group overflow-hidden bg-cover hover:opacity-90 bg-card dark:bg-card text-center border-solid border-2 border-border dark:border-border bg-center"
    >
      <p className="text-xl text-foreground relative z-10 bg-muted rounded-xl mt-2 w-fit mx-auto px-2 opacity-80">
        {title}
      </p>
      {!isFinished && (
        <div
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
          className="absolute top-0 left-0 w-full h-full"
        >
          <div className="relative w-full h-64 flex justify-center items-center">
            <div
              style={{ width: "120%" }}
              className="absolute h-16 bg-yellow-400 transform rotate-6 flex justify-center items-center border-t-4 border-b-4 border-black"
            >
              <span className="text-black text-lg font-bold">{statusLabel}</span>
            </div>
            <div
              style={{ width: "120%" }}
              className="absolute h-16 bg-yellow-400 transform -rotate-6 flex justify-center items-center border-t-4 border-b-4 border-black"
            >
              <span className="text-black text-lg font-bold">{statusLabel}</span>
            </div>
          </div>
        </div>
      )}
      <div
        className={`mx-auto rounded-md w-11/12 h-48 opacity-65 mt-36 ${
          !isFinished ? "hidden" : "group-hover:mt-0 group-hover:opacity-95"
        } p-2 px-3 text-justify bg-card text-foreground shadow-md`}
      >
        <p className="text-xs mb-3">{description}</p>
        {Array.isArray(tags) && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag: string, index: number) => (
              <span key={index} className="text-xs bg-primary/20 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white bg-primary hover:bg-secondary hover:text-foreground rounded-lg text-xs px-3 py-2 dark:bg-primary dark:hover:text-primary-foreground dark:hover:bg-secondary"
          >
            Ver Proyecto
          </a>
        )}
      </div>
    </div>
  );
}
