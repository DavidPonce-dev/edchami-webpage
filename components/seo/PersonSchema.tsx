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
    image: `${baseUrl}/img/portrait.jpg`,
    jobTitle: "Desarrollador Full Stack & IoT",
    description:
      "Eduardo Chami es desarrollador Full Stack especializado en aplicaciones web modernas, backend escalable, IoT, hardware y robótica. Experiencia con React, Next.js, TypeScript, Node.js y PostgreSQL.",
    knowsAbout: [
      "Full Stack Development",
      "Web Development",
      "Software Engineering",
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "REST APIs",
      "IoT",
      "Embedded Systems",
      "ESP32",
      "Robotics",
      "Docker",
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
    sameAs: [
      "https://github.com/edchami",
      "https://linkedin.com/in/edchami",
    ],
  };

  return (
    <Script
      id="person-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}