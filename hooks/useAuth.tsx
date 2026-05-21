"use client";

import { User } from "@/types/user";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function OnUrlChange({ user }: { user: User | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!user || loading) return;

    setLoading(true);

    fetch("/api/auth/refresh", { method: "POST" })
      .then((res) => {
        if (res.status === 401) router.push("/login");
      })
      .catch((err) => console.error("Failed to refresh user", err))
      .finally(() => setLoading(false));
  }, [pathname, searchParams.toString(), user, router]);

  return <></>;
}
