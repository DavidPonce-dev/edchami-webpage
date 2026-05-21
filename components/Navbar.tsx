import Link from "next/link";
import { getUser } from "@/lib/auth";
import { UserMenu } from "./UserMenu";

export async function Navbar() {
  const user = await getUser();
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-background border-b border-border">
      <Link href="/" className="text-xl font-semibold text-foreground">
        EChami
      </Link>
      <UserMenu user={user} />
    </nav>
  );
}
