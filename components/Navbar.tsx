"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/types/user";
import { logout } from "@/lib/auth";
import { Logo } from "./Logo";

interface NavbarProps {
  user: User | null;
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

const navLinks = [
  { name: "Inicio", href: "/" },
  { name: "Proyectos", href: "/projects" },
  { name: "Contacto", href: "/contact" },
];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const darkMode = useSyncExternalStore(subscribe, getSnapshot, () => false);

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    document.cookie = `theme=${isDark ? "dark" : "light"}; path=/; max-age=31536000`;
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    window.location.href = "/login";
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <div className="w-full h-13" />
      <nav className="fixed h-13 top-0 left-0 z-50 w-full bg-green-700 dark:bg-gray-900 shadow-lg shadow-slate-600/50 dark:shadow-black/50">
        <div className="max-w-screen-xl px-4 py-2 flex flex-col md:flex-row items-center justify-between mx-auto">
          <div className="flex justify-between w-full">
            {/* Logo */}
            <Logo className="me-auto" />
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-8 h-8 me-3 flex items-center justify-center rounded-full bg-purple-900/80 dark:bg-blue-300/80 hover:opacity-80 text-white dark:text-gray-900 transition-opacity"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                  <line x1="2" y1="12" x2="6" y2="12" />
                  <line x1="18" y1="12" x2="22" y2="12" />
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* User section
            
                        {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-white/90 hover:bg-green-800/50 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-1 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-50">
                    <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.email.split("@")[0]}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                      Dashboard
                    </Link>
                    {user.isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm text-white/90 hover:bg-green-800/50 rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 text-sm bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors font-medium"
                >
                  Register
                </Link>
              </div>
            )}
            
            */}

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex p-2 w-10 h-10 justify-center text-sm text-slate-100 rounded-lg md:hidden hover:bg-green-800/50 focus:outline-none focus:ring-2 focus:ring-green-300"
              aria-controls="navbar"
              aria-expanded={isOpen}
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>

          {/* Nav links - Desktop */}
          <div
            className={`w-full md:block md:w-auto ${isOpen ? "block" : "hidden"}`}
            id="navbar"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-green-600/30 rounded-lg md:space-x-6 rtl:space-x-reverse md:flex-row md:mt-1 md:border-0 bg-green-800/50 md:bg-transparent dark:bg-gray-800/50 md:dark:bg-transparent dark:border-gray-700/50">
              {navLinks.map(({ name, href }) => (
                <li key={name}>
                  <Link
                    onClick={() => setIsOpen(false)}
                    href={href}
                    className={`block py-2 px-3 text-center rounded md:no-underline font-retro text-xs transition-colors ${
                      isActive(href)
                        ? "text-white bg-green-800 md:bg-transparent md:text-green-100 dark:md:text-green-400"
                        : "text-green-100 hover:bg-green-600/50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    {name}
                  </Link>
                </li>
              ))}

              {/* Mobile-only auth links */}
              {!user && (
                <li className="sm:hidden border-t border-green-600/30 dark:border-gray-700/50 pt-2 mt-2">
                  <Link
                    onClick={() => setIsOpen(false)}
                    href="/login"
                    className="block py-2 px-3 text-center text-green-100 hover:bg-green-600/50 rounded font-retro text-xs"
                  >
                    Login
                  </Link>
                </li>
              )}
              {!user && (
                <li className="sm:hidden">
                  <Link
                    onClick={() => setIsOpen(false)}
                    href="/register"
                    className="block py-2 px-3 text-center bg-white/20 text-white rounded font-retro text-xs"
                  >
                    Register
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
