import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({ children }: LayoutProps) {
  const user = await getUser();
  if (user) redirect("/");

  return children;
}
