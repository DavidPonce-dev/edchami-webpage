import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { count } from "drizzle-orm";

export default async function Register() {
  try {
    const result = await db.select({ cnt: count() }).from(user);
    if (result[0].cnt > 0) {
      redirect("/login");
    }
  } catch {
    // DB not ready, show register form
  }

  return <RegisterForm />;
}
