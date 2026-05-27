import Link from "next/link";

interface LogoProps {
  className?: string;
  "aria-label"?: string;
}

export function Logo({ className = "", "aria-label": ariaLabel }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`} aria-label={ariaLabel}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Background */}
        <rect width="36" height="36" rx="8" className="fill-green-700 dark:fill-gray-800" />

        {/* Pixel-art style EC initials */}
        {/* E */}
        <rect x="6" y="8" width="4" height="4" className="fill-white dark:fill-green-400" />
        <rect x="6" y="12" width="4" height="4" className="fill-white dark:fill-green-400" />
        <rect x="6" y="16" width="8" height="4" className="fill-white dark:fill-green-400" />
        <rect x="6" y="20" width="4" height="4" className="fill-white dark:fill-green-400" />
        <rect x="6" y="24" width="4" height="4" className="fill-white dark:fill-green-400" />

        {/* C */}
        <rect x="20" y="8" width="4" height="4" className="fill-white dark:fill-green-400" />
        <rect x="24" y="8" width="4" height="4" className="fill-white dark:fill-green-400" />
        <rect x="20" y="12" width="4" height="4" className="fill-white dark:fill-green-400" />
        <rect x="20" y="16" width="4" height="4" className="fill-white dark:fill-green-400" />
        <rect x="20" y="20" width="4" height="4" className="fill-white dark:fill-green-400" />
        <rect x="20" y="24" width="4" height="4" className="fill-white dark:fill-green-400" />
        <rect x="24" y="24" width="4" height="4" className="fill-white dark:fill-green-400" />
      </svg>

      <span className="font-retro text-sm text-nav-text-active dark:text-nav-text-active hidden sm:inline">
        EdChami
      </span>
    </Link>
  );
}
