import { notFound } from "next/navigation";
import { DemoExperience } from "@/components/redesign/ar/demo-experience";
import { arPageMeta } from "@/lib/redesign/seo";
import { demoPagePath, demoProducts, getDemoProduct, site } from "@/lib/redesign/site";

export function generateStaticParams() {
  return demoProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getDemoProduct(slug);
  if (!product) return {};
  const path = demoPagePath(product.slug);
  return {
    ...arPageMeta({
      title: `${product.name} | Interactive Demo | B Socio AR`,
      description: `${product.label}. DEMO PRICE ${product.price}. ${product.description}`,
      path,
    }),
    openGraph: {
      title: `${product.name} | B Socio AR`,
      description: `${product.label}. DEMO PRICE ${product.price}.`,
      url: `${site.production.arOrigin}${path}`,
      images: [`${site.production.arOrigin}${product.imageUrl}`],
      type: "website" as const,
      siteName: "B Socio AR",
    },
  };
}

export default async function DemoSkuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getDemoProduct(slug);
  if (!product) notFound();
  return <DemoExperience product={product} />;
}
