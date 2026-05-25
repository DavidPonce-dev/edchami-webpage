"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  HomeIcon,
  FolderIcon,
  UserIcon,
  SettingsIcon,
  ShieldIcon,
  LogOutIcon,
} from "@/components/Icons";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: HomeIcon },
  { name: "Proyectos", href: "/dashboard/projects", icon: FolderIcon },
  { name: "Perfil", href: "/dashboard/profile", icon: UserIcon },
  { name: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
];

const adminItems = [
  { name: "Admin Panel", href: "/dashboard/admin", icon: ShieldIcon },
];

export function DashboardSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 min-h-[calc(100vh-3.25rem)] bg-card border-r border-border">
        <div className="p-4 border-b border-border">
          <p className="text-sm font-medium text-foreground truncate">
            {user?.username || "User"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email}
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ name, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                isActive(href)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              {name}
            </Link>
          ))}

          {user?.role === "admin" && (
            <>
              <div className="my-2 border-t border-border" />
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Admin
              </p>
              {adminItems.map(({ name, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive(href)
                      ? "bg-destructive/10 text-destructive font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {name}
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors"
          >
            <LogOutIcon className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <MobileSidebar />
    </>
  );
}

function MobileSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-14 left-4 z-40 p-2 rounded-md bg-card border border-border shadow-sm"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-64 h-full bg-card shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-muted"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
              {navItems.map(({ name, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive(href)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {name}
                </Link>
              ))}

              {user?.role === "admin" && (
                <>
                  <div className="my-2 border-t border-border" />
                  <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Admin
                  </p>
                  {adminItems.map(({ name, href, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                        isActive(href)
                          ? "bg-destructive/10 text-destructive font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {name}
                    </Link>
                  ))}
                </>
              )}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border bg-card">
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors"
              >
                <LogOutIcon className="w-5 h-5" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
