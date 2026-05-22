import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OnUrlChange } from "@/hooks/useAuth";
import { getUser } from "@/lib/auth";

import { getBaseUrl } from "@/lib/getBaseUrl";

export const metadata: Metadata = {
  title: "EdChami",
  description:
    "Personal portfolio of Eduardo Chami — developer, builder, and problem solver.",
  openGraph: {
    title: "EdChami",
    description:
      "Personal portfolio of Eduardo Chami — developer, builder, and problem solver.",
    type: "website",
    images: [
      {
        url: `${getBaseUrl()}/api/og`,
        width: 1200,
        height: 630,
        alt: "EdChami - Developer, Builder, Problem Solver",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EdChami",
    description:
      "Personal portfolio of Eduardo Chami — developer, builder, and problem solver.",
    images: [`${getBaseUrl()}/api/og`],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const user = await getUser();

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = document.cookie.match(/theme=(dark|light)/);
                  if (theme) {
                    if (theme[1] === 'dark') document.documentElement.classList.add('dark');
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
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
