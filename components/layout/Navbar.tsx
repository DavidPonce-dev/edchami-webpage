"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "./Logo";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  const onPageHide = () => observer.disconnect();
  const onPageShow = () => {
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  };

  window.addEventListener("pagehide", onPageHide);
  window.addEventListener("pageshow", onPageShow);

  return () => {
    observer.disconnect();
    window.removeEventListener("pagehide", onPageHide);
    window.removeEventListener("pageshow", onPageShow);
  };
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const darkMode = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Proyectos", href: "/projects" },
    { name: "Contacto", href: "/contact" },
  ];

  const userLinks = [
    { name: "Dashboard", href: "/dashboard" },
  ];

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    document.cookie = `theme=${isDark ? "dark" : "light"}; path=/; max-age=31536000`;
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <div className="w-full h-13" />
      <nav className="fixed h-13 top-0 left-0 z-50 w-full bg-nav dark:bg-nav-surface shadow-lg shadow-slate-600/50 dark:shadow-black/50">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-nav-accent-blue via-purple-600 to-nav-accent-burgundy opacity-60 dark:opacity-0" />
        <div className="max-w-screen-xl px-4 py-2 flex flex-col md:flex-row items-center justify-between mx-auto">
          <div className="flex justify-between w-full">
            <Logo className="me-auto" />
            <div className="flex">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="w-8 h-8 me-3 mt-1 flex items-center justify-center rounded-full bg-nav-toggle dark:bg-nav-toggle hover:opacity-80 text-nav-toggle-foreground dark:text-nav-toggle-foreground transition-opacity"
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

              {/* Mobile menu button */}

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex p-2 w-10 h-10 justify-center text-sm text-nav-text rounded-lg md:hidden hover:bg-nav-surface-hover focus:outline-none focus:ring-2 focus:ring-nav-ring"
                aria-controls="navbar"
                aria-expanded={isOpen}
                aria-label="Abrir menú de navegación"
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
          </div>

          <div
            className={`w-full md:block md:w-auto ${isOpen ? "block" : "hidden"}`}
            id="navbar"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-nav-border rounded-lg md:space-x-6 rtl:space-x-reverse md:flex-row md:mt-1 md:border-0 bg-nav-menu-surface dark:bg-nav-menu-surface md:bg-transparent dark:md:bg-transparent dark:border-gray-700/50">
              {navLinks.map(({ name, href }) => (
                <li key={name}>
                  <Link
                    onClick={() => setIsOpen(false)}
                    href={href}
                    className={`block py-2 px-3 text-center rounded md:no-underline font-retro text-xs transition-colors ${
                      isActive(href)
                        ? "text-nav-text-active bg-nav-surface-active md:bg-nav-surface-active md:text-nav-text-active dark:bg-nav-surface-active dark:md:bg-transparent dark:md:text-nav-text-active"
                        : "text-nav-text hover:bg-nav-accent-burgundy-soft hover:text-nav-accent-burgundy dark:text-nav-text dark:hover:bg-nav-surface-hover"
                    }`}
                  >
                    {name}
                  </Link>
                </li>
              ))}

              {user ? (
                userLinks.map(({ name, href }) => (
                  <li key={name}>
                      <Link
                        onClick={() => setIsOpen(false)}
                        href={href}
                        className={`block py-2 px-3 text-center rounded md:no-underline font-retro text-xs transition-colors ${
                          isActive(href)
                            ? "text-nav-text-active bg-nav-surface-active md:bg-nav-surface-active md:text-nav-text-active dark:bg-nav-surface-active dark:md:bg-transparent dark:md:text-nav-text-active"
                            : "text-nav-text hover:bg-nav-accent-burgundy-soft hover:text-nav-accent-burgundy dark:text-nav-text dark:hover:bg-nav-surface-hover"
                        }`}
                      >
                        {name}
                      </Link>
                    
                  </li>
                ))
              ) : (
                <Link
                  onClick={() => setIsOpen(false)}
                  href="/login"
                  className={`block py-2 px-3 text-center rounded md:no-underline font-retro text-xs transition-colors ${
                    isActive("/login")
                      ? "text-nav-text-active bg-nav-surface-active md:bg-nav-surface-active md:text-nav-text-active dark:bg-nav-surface-active dark:md:bg-transparent dark:md:text-nav-text-active"
                      : "text-nav-text hover:bg-nav-accent-burgundy-soft hover:text-nav-accent-burgundy dark:text-nav-text dark:hover:bg-nav-surface-hover"
                  }`}
                >
                  Login
                </Link>
              )}
            </ul>
          </div>

        </div>
      </nav>
    </>
  );
}
