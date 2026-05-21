import Link from "next/link";

const currentYear = new Date().getFullYear();

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/edchami",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 2.95.524.86-.24 1.782-.361 2.703-.361.921 0 1.843.121 2.703.361 1.942-.846 2.95-.524 2.95-.524.652 1.652.24 2.873.117 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/edchami",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Email",
    href: "mailto:eduardo.chami@example.com",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="bg-green-700 dark:bg-gray-900 border-t border-green-600/30 dark:border-gray-800">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-6">
          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map(({ name, href, icon }) => (
              <Link
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-100/70 hover:text-white dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                aria-label={name}
              >
                {icon}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="w-16 h-px bg-green-600/50 dark:bg-gray-700" />

          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-green-100/80 dark:text-gray-400">
              &copy; {currentYear} Eduardo Chami. Todos los derechos reservados.
            </p>
            <p className="text-xs text-green-100/50 dark:text-gray-500 mt-1">
              Desarrollado con Next.js y Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
