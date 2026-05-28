import type { Project } from "@/lib/db/schema";

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: "PENDIENTE",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  onDevelopment: {
    label: "EN DESARROLLO",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  finished: {
    label: "FINALIZADO",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
};

export function StatusBadge({ status }: { status: Project["status"] }) {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
