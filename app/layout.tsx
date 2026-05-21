import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OnUrlChange } from "@/hooks/useAuth";
import { getUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "EdChami",
  description:
    "Personal portfolio of Eduardo Chami — developer, builder, and problem solver.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const user = await getUser();
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value;
  const isDark = theme === "dark";

  return (
    <html lang="en" className={`h-full antialiased${isDark ? " dark" : ""}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <OnUrlChange user={user} />
        <Navbar user={user} />
        <div className="mb-auto">
          <div className="xl:w-4/5 mx-auto mt-3 p-5 bg-slate-200 dark:bg-gray-900 shadow-md shadow-slate-500 dark:shadow-black">
            {children}
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
