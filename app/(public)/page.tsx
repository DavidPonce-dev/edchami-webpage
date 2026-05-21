import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-12 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-foreground mb-4">
        Auth System
      </h1>
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        Secure authentication template built with Next.js 16. Ready to use as a
        foundation for your next project.
      </p>
      <div className="flex gap-4">
        <Link
          href="/register"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="px-6 py-3 bg-background border border-border text-foreground rounded-md font-medium hover:bg-muted transition-colors"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}
