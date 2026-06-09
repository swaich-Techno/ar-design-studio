export const SITE_URL = "https://ar.bsocio.in";

export const BRAND = {
  name: "AR Design Studio",
  parent: "B Socio",
  website: SITE_URL,
  parentWebsite: "https://www.bsocio.in",
  email: "b.socio.agency@gmail.com",
  phone: "+91 7355008986",
  phoneCompact: "917355008986",
  location: "Punjab, India",
  whatsappText: "Hi B Socio, I want to know more about AR Design Studio QR catalogue and AR product viewer."
};

export const WHATSAPP_URL = `https://wa.me/${BRAND.phoneCompact}?text=${encodeURIComponent(BRAND.whatsappText)}`;

export const mainFeatures = [
  "QR product catalogue",
  "AR/3D product viewer",
  "WhatsApp enquiry button",
  "Product photos, price, weight, and description",
  "Digital menu pages",
  "Campaign QR pages",
  "Analytics dashboard",
  "Mobile-friendly design",
  "No app required for customers",
  "Easy sharing on WhatsApp and social media"
];

export const industryPages = [
  {
    slug: "sweet-shops",
    label: "Sweet Shops",
    title: "QR Catalogue for Sweet Shops | AR Design Studio",
    description: "Create a digital QR catalogue for your sweet shop with product photos, prices, gift packs, festival offers, and WhatsApp enquiry buttons.",
    h1: "QR Catalogue for Sweet Shops",
    intro: "Turn mithai, gift hampers, dry fruit boxes, cakes, bakery items, and festival offers into a clean mobile catalogue customers can open from a QR code.",
    benefits: [
      "Show product photos, prices, weight, packs, and festival offers in one scan.",
      "Collect wedding, party, gifting, and bulk order enquiries directly on WhatsApp.",
      "Update sweets, hampers, and seasonal collections without reprinting menus."
    ],
    useCases: ["Mithai catalogue", "Gift hampers", "Festival offers", "Cakes and bakery items", "Dry fruit boxes", "Wedding and bulk order enquiries", "WhatsApp ordering"],
    features: ["QR catalogue pages", "Offer and combo sections", "WhatsApp enquiry CTA", "Mobile-friendly product cards", "Lead tracking"],
    alt: "Digital QR catalogue for sweet shops"
  },
  {
    slug: "restaurants",
    label: "Restaurants",
    title: "QR Menu for Restaurants & Cafes | AR Design Studio",
    description: "Create a digital QR menu for restaurants, cafes, food courts, and cloud kitchens with item details, prices, offers, and WhatsApp enquiry options.",
    h1: "QR Menu for Restaurants & Cafes",
    intro: "Create table QR menus, takeaway menus, combo pages, and campaign offers that customers can open instantly from their phone.",
    benefits: [
      "Reduce printed menu changes and keep item prices, photos, and offers current.",
      "Let customers browse table menus or takeaway options without downloading an app.",
      "Use WhatsApp enquiry links for catering, party orders, and cloud kitchen leads."
    ],
    useCases: ["Table QR menu", "Takeaway menu", "Offers and combos", "WhatsApp order enquiry", "No printed menu needed", "Easy menu updates"],
    features: ["Table QR pages", "Digital menu categories", "Product photos and prices", "Campaign QR pages", "Mobile ordering enquiry"],
    alt: "QR menu for restaurants and cafes"
  },
  {
    slug: "furniture",
    label: "Furniture",
    title: "AR Catalogue for Furniture Stores | AR Design Studio",
    description: "Create an AR furniture catalogue with product photos, 3D previews, QR product pages, dimensions, prices, and WhatsApp enquiry buttons.",
    h1: "AR Catalogue for Furniture Stores",
    intro: "Help customers explore sofas, beds, wardrobes, chairs, dining tables, and showroom collections through QR product pages with AR/3D previews where available.",
    benefits: [
      "Show product dimensions, materials, prices, and finish options clearly.",
      "Use AR/3D previews for selected products to improve buyer confidence.",
      "Collect showroom visit, custom order, and delivery enquiries on WhatsApp."
    ],
    useCases: ["Sofas", "Beds", "Dining tables", "Chairs", "Wardrobes", "Product dimensions", "AR preview where available"],
    features: ["AR/3D product viewer", "Dimensions and descriptions", "QR product pages", "WhatsApp leads", "Analytics dashboard"],
    alt: "AR furniture catalogue with 3D product viewer"
  },
  {
    slug: "jewellery",
    label: "Jewellery",
    title: "Digital Jewellery Catalogue with QR & WhatsApp Enquiry | AR Design Studio",
    description: "Create a digital jewellery catalogue for rings, necklaces, bangles, bridal sets, and collections with QR pages and WhatsApp enquiry buttons.",
    h1: "Digital Jewellery Catalogue with QR Enquiry",
    intro: "Publish jewellery collections online with scan-ready QR pages for rings, necklaces, bangles, bridal sets, gold, silver, and custom designs.",
    benefits: [
      "Present collection photos, prices, making details, and enquiry options neatly.",
      "Share selected product pages with customers on WhatsApp and social media.",
      "Capture bridal, custom design, and showroom visit enquiries faster."
    ],
    useCases: ["Rings", "Necklaces", "Bangles", "Bridal sets", "Gold and silver collections", "Custom design enquiries"],
    features: ["Digital collection pages", "QR product links", "WhatsApp enquiry CTA", "Campaign pages", "Lead analytics"],
    alt: "Digital jewellery catalogue with WhatsApp enquiry"
  },
  {
    slug: "real-estate",
    label: "Real Estate",
    title: "QR Property Catalogue for Real Estate | AR Design Studio",
    description: "Create QR property pages for real estate projects, plots, flats, villas, brochures, location details, images, videos, and WhatsApp leads.",
    h1: "QR Property Catalogue for Real Estate",
    intro: "Create project and property pages that can be scanned from hoardings, brochures, site boards, newspaper ads, and social media creatives.",
    benefits: [
      "Show project brochures, images, videos, location maps, and property details.",
      "Collect WhatsApp leads from interested buyers without sending bulky PDFs first.",
      "Track campaign QR scans from offline promotions and property visits."
    ],
    useCases: ["Property listing pages", "Project brochures", "Plot details", "Flat and villa details", "Location map", "WhatsApp leads"],
    features: ["QR property pages", "Brochure and media sections", "Location CTA", "WhatsApp lead button", "Campaign tracking"],
    alt: "QR property catalogue for real estate businesses"
  },
  {
    slug: "boutiques",
    label: "Boutiques",
    title: "Digital Catalogue for Boutiques | AR Design Studio",
    description: "Create a digital clothing catalogue for boutiques with product photos, prices, sizes, collections, offers, and WhatsApp enquiry buttons.",
    h1: "Digital Catalogue for Boutiques",
    intro: "Publish suits, sarees, lehengas, dresses, new arrivals, and festival collections in a mobile catalogue customers can open from a QR code.",
    benefits: [
      "Share new arrivals and collections quickly without sending many separate photos.",
      "List sizes, prices, fabric notes, and custom stitching options clearly.",
      "Get WhatsApp enquiries for orders, fittings, availability, and custom designs."
    ],
    useCases: ["Suits", "Sarees", "Lehengas", "Dresses", "New arrivals", "Festival collections", "WhatsApp enquiries"],
    features: ["Digital clothing catalogue", "Product photos and prices", "Collection pages", "WhatsApp enquiry", "Mobile sharing"],
    alt: "Digital catalogue for boutiques"
  },
  {
    slug: "automobile",
    label: "Automobile",
    title: "QR Catalogue for Automobile Dealers | AR Design Studio",
    description: "Create QR vehicle catalogue pages for car dealers, bike dealers, accessories, offers, specifications, images, and WhatsApp enquiries.",
    h1: "QR Catalogue for Automobile Dealers",
    intro: "Create QR vehicle pages for car dealers, bike dealers, used vehicles, accessories, seasonal offers, and showroom campaigns.",
    benefits: [
      "Show vehicle photos, specifications, price range, offers, and enquiry buttons.",
      "Use QR pages in showroom displays, ads, flyers, and social media posts.",
      "Capture test drive, finance, exchange, and availability leads on WhatsApp."
    ],
    useCases: ["Vehicle listings", "Used car catalogue", "Bike catalogue", "Accessories", "Offers", "WhatsApp leads"],
    features: ["QR vehicle pages", "Specifications and images", "Offer campaigns", "WhatsApp enquiry CTA", "Lead analytics"],
    alt: "QR catalogue for automobile dealers"
  },
  {
    slug: "electronics",
    label: "Electronics",
    title: "Digital Catalogue for Electronics Stores | AR Design Studio",
    description: "Create a QR electronics catalogue with product images, specifications, prices, offers, warranty details, and WhatsApp enquiry buttons.",
    h1: "Digital Catalogue for Electronics Stores",
    intro: "Turn mobiles, laptops, home appliances, accessories, specifications, warranty details, and store offers into scan-ready QR catalogue pages.",
    benefits: [
      "Make specifications, warranty, pricing, and offer details easy to compare.",
      "Share product pages on WhatsApp instead of manually typing details again.",
      "Collect enquiries for availability, exchange, finance, installation, and delivery."
    ],
    useCases: ["Mobiles", "Laptops", "Home appliances", "Accessories", "Specifications", "Offers", "WhatsApp enquiries"],
    features: ["QR electronics catalogue", "Specifications and warranty details", "Offer pages", "WhatsApp enquiry", "Mobile-friendly layout"],
    alt: "Digital catalogue for electronics stores"
  }
];

export const faqItems = [
  ["What is a QR catalogue?", "A QR catalogue is a mobile product catalogue that opens when a customer scans a QR code. It can show products, prices, photos, descriptions, offers, and enquiry buttons."],
  ["What is an AR product viewer?", "An AR product viewer lets customers view supported 3D products on a web page and, on compatible phones, preview them in their space using camera AR."],
  ["Do customers need to install an app?", "No. Customers open the catalogue in their mobile browser by scanning a QR code or tapping a shared link."],
  ["Can I use it for my sweet shop?", "Yes. Sweet shops can use it for mithai, gift hampers, cakes, dry fruit boxes, festival offers, and bulk order enquiries."],
  ["Can customers send enquiries on WhatsApp?", "Yes. Product pages and catalogue pages can include WhatsApp enquiry buttons with product details included in the message."],
  ["Can I add product photos and prices?", "Yes. You can add product photos, prices, descriptions, categories, offers, stock status, and model links where needed."],
  ["Is this useful for restaurants and cafes?", "Yes. Restaurants and cafes can use QR menus, table QR pages, takeaway menus, offers, and WhatsApp enquiry flows."],
  ["Can I use this for furniture or jewellery products?", "Yes. Furniture and jewellery businesses can create digital catalogues, QR product pages, and AR/3D previews where model files are available."],
  ["Is it mobile friendly?", "Yes. The public catalogue pages are designed for mobile scanning, fast browsing, and tap-friendly WhatsApp enquiries."],
  ["How much does it cost?", "Starter pricing begins at Rs. 1,999 per month, with Growth and Premium plans available for AR products, analytics, staff, campaigns, and larger catalogues."]
];

export function canonical(path = "/") {
  return `${SITE_URL}${path}`;
}

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AR Design Studio",
    url: `${SITE_URL}/`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: "AR Design Studio helps local businesses create QR product catalogues, AR product viewers, WhatsApp enquiry pages, digital menus, campaign QR pages, and product landing pages.",
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: "1999"
    },
    provider: {
      "@type": "Organization",
      name: "B Socio",
      url: "https://www.bsocio.in/",
      email: BRAND.email,
      telephone: "+91-7355008986",
      address: {
        "@type": "PostalAddress",
        addressRegion: "Punjab",
        addressCountry: "IN"
      }
    }
  };
}

export function faqSchema(items = faqItems) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer
      }
    }))
  };
}
