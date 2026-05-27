import Script from "next/script";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

export function PersonSchema() {
  const baseUrl = getBaseUrl();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Eduardo Chami",
    alternateName: "EdChami",
    url: baseUrl,
    jobTitle: "Desarrollador Full Stack & IoT",
    description:
      "Desarrollador Full Stack con experiencia en aplicaciones web escalables y soluciones IoT. Especializado en hardware, robótica y tecnologías modernas. Basado en Chile.",
    knowsAbout: [
      "Desarrollo Full Stack",
      "Desarrollo Web",
      "Desarrollo de Software",
      "Programación",
      "IoT",
      "Internet de las Cosas",
      "Hardware",
      "Robótica",
      "Frontend",
      "Backend",
      "Arquitectura de Software",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "CL",
      addressRegion: "Chile",
    },
    nationality: {
      "@type": "Country",
      name: "Chile",
    },
    sameAs: [],
  };

  return (
    <Script
      id="person-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
