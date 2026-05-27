import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export const dynamic = "force-dynamic";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({ children }: LayoutProps) {
  const user = await getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-[calc(100vh-3.25rem)]">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
