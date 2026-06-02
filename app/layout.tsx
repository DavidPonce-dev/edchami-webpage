import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PersonSchema } from "@/components/seo/PersonSchema";
import { WebsiteSchema } from "@/components/seo/WebsiteSchema";
import { AuthProvider } from "@/hooks/useAuth";

import { getUser } from "@/lib/auth";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

export const metadata: Metadata = {
  title: {
    default: "Eduardo Chami — Desarrollador Full Stack & IoT | EdChami",
    template: "%s | EdChami",
  },
  description:
    "Portafolio de Eduardo Chami — Desarrollador Full Stack especializado en aplicaciones web escalables, IoT, hardware y robótica.",
  keywords: [
    "Eduardo Chami",
    "EdChami",
    "Desarrollador Full Stack",
    "Desarrollador Full Stack Chile",
    "Desarrollador Chile",
    "Programador Chile",
    "Desarrollador Web Chile",
    "Desarrollador Santiago",
    "Desarrollador IoT",
    "Desarrollo Web",
    "Desarrollo de Software Chile",
    "Ingeniero de Software Chile",
    "Programador Full Stack",
    "Desarrollador Frontend Chile",
    "Desarrollador Backend Chile",
    "Hardware",
    "Robótica",
    "Portfolio",
    "Portafolio",
    "Freelancer Chile",
    "Desarrollador Web Freelance",
  ],
  authors: [{ name: "Eduardo Chami", url: getBaseUrl() }],
  creator: "Eduardo Chami",
  publisher: "Eduardo Chami",
  metadataBase: new URL(getBaseUrl()),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "EdChami",
    title: "Eduardo Chami — Desarrollador Full Stack & IoT",
    description:
      "Portafolio de Eduardo Chami — Desarrollador Full Stack especializado en aplicaciones web escalables, IoT, hardware y robótica.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "EdChami - Eduardo Chami, Desarrollador Full Stack & IoT",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eduardo Chami — Desarrollador Full Stack & IoT",
    description:
      "Portafolio de Eduardo Chami — Desarrollador Full Stack especializado en aplicaciones web escalables, IoT, hardware y robótica.",
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const user = await getUser();

  return (
    <html lang="es" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link
          rel="preload"
          as="image"
          href="https://i.ytimg.com/vi/q5tjvJz87rw/maxresdefault.jpg"
        />
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
          <AuthProvider initialUser={user}>
            <PersonSchema />
            <WebsiteSchema />
          <Navbar />
          <div className="mb-auto">
            <div className="xl:w-4/5 mx-auto mt-3 p-5 bg-slate-200 dark:bg-gray-900 shadow-md shadow-slate-500 dark:shadow-black">
              <main role="main">
                {children}
              </main>
            </div>
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
