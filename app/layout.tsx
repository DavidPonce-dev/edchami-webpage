import type { Metadata } from "next";

import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { OnUrlChange } from "@/hooks/useAuth";
import { getUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Eduardo Chami's Web",
  description:
    "Personal portfolio of Eduardo Chami — developer, builder, and problem solver.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {

  const user = await getUser();

  return (
    <html lang="en" className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <OnUrlChange user={user} />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
