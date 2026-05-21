import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getUser();
  if (!user || !user?.isAdmin) redirect("/login");

  return children;
}
