const ORIGIN = "https://ar.bsocio.in";

export function arPageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  const url = path === "/" ? `${ORIGIN}/` : `${ORIGIN}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [`${ORIGIN}/redesign/heroes/food-ar.png`],
      type: "website" as const,
      siteName: "B Socio AR",
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [`${ORIGIN}/redesign/heroes/food-ar.png`],
    },
  };
}

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "B Socio AR",
        url: ORIGIN,
        email: "connect@bsocio.in",
        telephone: "+917009464475",
        parentOrganization: {
          "@type": "Organization",
          name: "B Socio",
          url: "https://bsocio.in",
        },
      },
      {
        "@type": "WebSite",
        name: "B Socio AR",
        url: ORIGIN,
        description:
          "Turn restaurant, café, bakery and food menus into interactive digital experiences with QR access, premium product presentation, 3D dishes, AR and direct enquiry.",
      },
      {
        "@type": "Service",
        name: "Interactive QR, 3D and AR menus for food businesses",
        provider: { "@type": "Organization", name: "B Socio AR" },
        areaServed: "IN",
        serviceType: "Interactive food menus with QR, 3D and AR",
      },
    ],
  };
}
