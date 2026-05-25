"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/types/user";
import { logout as logoutAction } from "@/lib/auth";

interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
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
  const refreshingRef = useRef(false);

  const refreshSession = useCallback(async () => {
    if (refreshingRef.current || !user) return;
    refreshingRef.current = true;

    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      if (res.status === 401) {
        setUser(null);
        router.push("/login");
      }
    } catch (err) {
      console.error("Failed to refresh session", err);
    } finally {
      refreshingRef.current = false;
    }
  }, [user, router]);

  useEffect(() => {
    if (!user || refreshingRef.current) return;

    refreshingRef.current = true;

    fetch("/api/auth/refresh", { method: "POST" })
      .then((res) => {
        if (res.status === 401) {
          setUser(null);
          router.push("/login");
        }
      })
      .catch((err) => console.error("Failed to refresh session", err))
      .finally(() => {
        refreshingRef.current = false;
      });
  }, [pathname, user, router]);

  const logout = useCallback(async () => {
    await logoutAction();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}
