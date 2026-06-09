import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({ children }: LayoutProps) {
  const user = await getSession();
  if (!user || user.role !== "admin") redirect("/dashboard");
  return children;
}
