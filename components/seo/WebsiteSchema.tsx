import Script from "next/script";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

export function WebsiteSchema() {
  const baseUrl = getBaseUrl();

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EdChami",
    url: baseUrl,
    description: "Portafolio de Eduardo Chami — Desarrollador Full Stack especializado en aplicaciones web escalables, IoT, hardware y robótica.",
    image: `${baseUrl}/img/portrait.jpg`,
    author: {
      "@type": "Person",
      name: "Eduardo Chami",
      url: baseUrl,
    },
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Eduardo Chami — Desarrollador Full Stack & IoT",
    description: "Portafolio de Eduardo Chami — Desarrollador Full Stack especializado en aplicaciones web escalables, IoT, hardware y robótica.",
    url: baseUrl,
    image: `${baseUrl}/img/portrait.jpg`,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${baseUrl}/img/portrait.jpg`,
      width: "1200",
      height: "630",
    },
  };

  return (
    <>
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
    </>
  );
}
