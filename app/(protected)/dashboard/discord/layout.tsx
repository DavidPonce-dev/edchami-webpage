import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";

export default async function DiscordLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return children;
}
