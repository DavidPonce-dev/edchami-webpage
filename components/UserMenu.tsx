"use client";
import { User } from "@/types/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldIcon, ChevronDownIcon, HomeIcon, XIcon } from "./Icons";
import { logout } from "@/lib/auth";

interface UserMenuProps {
  user: User | null;
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    router.push("/login");
  };
  return (
    <div className="flex items-center gap-3">
      {user ? (
        <>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
          >
            Dashboard
          </Link>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
            >
              <span className="hidden sm:inline">{user.email}</span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium text-foreground">
                    {user.email || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center gap-2"
                  >
                    <ShieldIcon className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center gap-2"
                >
                  <HomeIcon className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => handleLogout()}
                  className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center gap-2"
                >
                  <XIcon className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
          >
            Register
          </Link>
        </>
      )}
    </div>
  );
}
