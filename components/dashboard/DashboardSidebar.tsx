"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  FolderOpen,
  User,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Proyectos", href: "/dashboard/projects", icon: FolderOpen },
  { name: "Perfil", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const adminItems = [
  { name: "Admin Panel", href: "/dashboard/admin", icon: Shield },
];

function SidebarContent({ user, isActive, onNavigate }: {
  user: { username?: string; email?: string; role?: string } | null;
  isActive: (href: string) => boolean;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="p-4 border-b border-border">
        <p className="text-sm font-medium text-foreground truncate">{user?.username || "User"}</p>
        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ name, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
              isActive(href)
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {name}
          </Link>
        ))}

        {user?.role === "admin" && (
          <>
            <div className="my-2 border-t border-border" />
            <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Admin</p>
            {adminItems.map(({ name, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive(href)
                    ? "bg-destructive/10 text-destructive font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {name}
              </Link>
            ))}
          </>
        )}
      </nav>
    </>
  );
}

export function DashboardSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 min-h-[calc(100vh-3.25rem)] bg-card border-r border-border">
        <SidebarContent user={user} isActive={isActive} />
        <div className="p-3 border-t border-border">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-14 left-4 z-40 p-2 rounded-md bg-card border border-border shadow-sm"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div className="w-64 h-full bg-card shadow-xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <p className="text-sm font-medium text-foreground">Menu</p>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded-md hover:bg-muted" aria-label="Close menu">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent user={user} isActive={isActive} onNavigate={() => setMobileOpen(false)} />
            <div className="p-3 border-t border-border">
              <button
                onClick={() => { setMobileOpen(false); logout(); }}
                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
