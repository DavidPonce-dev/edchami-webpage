"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { logout as logoutAction } from "@/lib/auth";

interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return { user: null, setUser: () => {}, logout: async () => {}, isLoading: false };
  }
  return ctx;
}

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(!initialUser);
  const router = useRouter();

  useEffect(() => {
    if (initialUser) return;

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
          console.error("Failed to fetch session", err);
        }
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [initialUser]);

  const logout = useCallback(async () => {
    await logoutAction();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
