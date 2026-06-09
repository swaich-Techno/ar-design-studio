import { IndustryLandingPage } from "@/components/public/IndustryLandingPage";
import { canonical, industryPages } from "@/lib/marketing";

const page = industryPages.find((item) => item.slug === "automobile");

export const metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: canonical("/automobile") },
  openGraph: {
    title: page.title,
    description: page.description,
    url: canonical("/automobile"),
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

export default function AutomobilePage() {
  return <IndustryLandingPage page={page} />;
}
