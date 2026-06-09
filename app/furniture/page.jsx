import { IndustryLandingPage } from "@/components/public/IndustryLandingPage";
import { canonical, industryPages } from "@/lib/marketing";

const page = industryPages.find((item) => item.slug === "furniture");

export const metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: canonical("/furniture") },
  openGraph: {
    title: page.title,
    description: page.description,
    url: canonical("/furniture"),
    images: ["https://ar.bsocio.in/og-image.jpg"],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: page.title,
    description: page.description,
    images: ["https://ar.bsocio.in/og-image.jpg"]
  }
};

export default function FurniturePage() {
  return <IndustryLandingPage page={page} />;
}
