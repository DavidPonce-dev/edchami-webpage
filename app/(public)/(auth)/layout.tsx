import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({ children }: LayoutProps) {
  const user = await getSession();
  if (user) redirect("/");

  return children;
}
