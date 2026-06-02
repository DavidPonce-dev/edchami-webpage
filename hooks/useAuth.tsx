"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { logout as logoutAction } from "@/lib/auth";
import { logger } from "@/lib/logger";

type User = { id: number; email: string; username: string; role: string; profilePicture?: string };

interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
      return;
    }

    const controller = new AbortController();

    fetch("/api/auth/me", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch((err) => {
        if ((err as Error).name !== "AbortError") {
          logger.error("Failed to fetch session", err);
        }
      });

    return () => controller.abort();
  }, [initialUser, pathname]);

  const logout = useCallback(async () => {
    await logoutAction();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
