export const site = {
  name: "B Socio",
  arName: "B Socio AR",
  tagline: "Creative technology for businesses that want to be experienced, not just seen.",
  email: "connect@bsocio.in",
  location: "Punjab, India",
  phoneDisplay: "+91 70094 64475",
  whatsapp: {
    main: "917009464475",
    ar: "917009464475",
  },
  production: {
    origin: "https://bsocio.in",
    arOrigin: "https://ar.bsocio.in",
    clientLogin: "https://ar.bsocio.in/business/login",
    studioLogin: "https://ar.bsocio.in/team/login",
  },
} as const;

export function waLink(number: string, text: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export const copy = {
  main: {
    heroTitle: ["YOUR MENU SHOULD", "DO MORE THAN LIST FOOD."],
    heroSupport:
      "Turn your food menu into an interactive digital experience customers can scan, explore and order from.",
    heroSecondary:
      "QR access, premium dish presentation, 3D where you have assets, AR on supported phones, and WhatsApp enquiry — in the browser.",
    capabilitiesTitle: ["Ideas that move", "beyond the screen."],
    arIntroKicker: "B Socio AR",
    arIntroTitle: "B SOCIO AR",
    arIntroSupport: "Interactive menus, 3D dishes, and AR for food businesses.",
    ctaTitle: ["Have something", "worth experiencing?"],
  },
  ar: {
    heroEyebrow: "B SOCIO AR",
    heroTitle: ["YOUR MENU SHOULD", "DO MORE THAN LIST FOOD."],
    heroTitleAlt: ["LET THEM", "EXPERIENCE IT."],
    heroSupport:
      "Turn your food menu into an interactive digital experience customers can scan, explore and order from.",
    heroSecondary:
      "QR access, premium dish presentation, 3D where you have assets, AR on supported phones, and WhatsApp enquiry — in the browser.",
    trust: "Browser-based • No customer app required",
    jewelleryTitle: ["YOUR MENU SHOULD", "DO MORE THAN LIST FOOD."],
    jewellerySupport:
      "Turn your food menu into an interactive digital experience customers can scan, explore and order from.",
    jewelleryCta: ["Start with a food pilot", "not a full rebuild."],
    foodTitle: ["LET CUSTOMERS", "EAT WITH THEIR EYES FIRST."],
    foodSupport:
      "Hero dishes, desserts and drinks in 3D — not a 100-item menu dump. Customers see the plate, then enquire or order.",
  },
} as const;

export const capabilities = [
  {
    id: "creative",
    title: "Creative",
    body: "Campaigns, visual identities and content.",
  },
  {
    id: "digital",
    title: "Digital",
    body: "Web experiences built around attention and action.",
  },
  {
    id: "three",
    title: "3D",
    body: "Products transformed into interactive digital objects.",
  },
  {
    id: "ar",
    title: "AR Commerce",
    body: "Products experienced through the customer's camera.",
  },
] as const;

export const processSteps = [
  { n: "01", title: "SEND" },
  { n: "02", title: "BUILD" },
  { n: "03", title: "DIGITISE" },
  { n: "04", title: "PLACE" },
  { n: "05", title: "GO LIVE" },
  { n: "06", title: "MEASURE" },
] as const;

export const conceptWork = [
  {
    slug: "dessert-menu",
    title: "Interactive AR Menu",
    label: "Concept / Demo",
    vertical: "Food",
    href: "/ar/food",
  },
  {
    slug: "ar-commerce-engine",
    title: "AR Commerce Engine",
    label: "Concept / Platform",
    vertical: "Platform",
    href: "/ar/how-it-works",
  },
] as const;

export type DemoVertical = "jewellery" | "food";

export type DemoCategory = "pendant" | "ring" | "necklace" | "earring" | "food";

export type DemoProduct = {
  slug: string;
  id: string;
  name: string;
  sku: string;
  price: string;
  vertical: DemoVertical;
  label: string;
  description: string;
  image: string;
  imageUrl: string;
  glb: string;
  usdz: string;
  veg?: boolean;
  category?: DemoCategory;
  tryOnEnabled?: boolean;
  plateDiameterCm?: number;
  widthCm?: number;
  depthCm?: number;
  heightCm?: number;
};

export const jewelleryDemo = [
  {
    slug: "pendant",
    id: "pendant",
    name: "Radiant Pear Halo Pendant",
    sku: "JW-PND-01",
    price: "₹2,38,000",
    vertical: "jewellery",
    label: "Concept / Interactive Demo",
    description:
      "A pear-cut diamond in a halo of round brilliants, held by a yellow-gold ribbon — one polished strand, one pavé-set. Concept / Interactive Demo.",
    image: "/redesign/demo/radiant-pear-halo-pendant.png",
    imageUrl: "/redesign/demo/radiant-pear-halo-pendant.png",
    glb: "/redesign/demo/radiant-pear-halo-pendant.glb",
    usdz: "/redesign/demo/radiant-pear-halo-pendant.usdz",
    category: "pendant",
    tryOnEnabled: true,
    widthCm: 16,
    heightCm: 16,
  },
  {
    slug: "ring",
    id: "ring",
    name: "Infinity Twist Pavé Ring",
    sku: "JW-RNG-01",
    price: "₹3,75,000",
    vertical: "jewellery",
    label: "Concept / Interactive Demo",
    description:
      "A round brilliant in a four-prong yellow-gold setting, with an infinity-twist shank of polished gold and pavé diamonds. Concept / Interactive Demo.",
    image: "/redesign/demo/infinity-twist-pave-ring.png",
    imageUrl: "/redesign/demo/infinity-twist-pave-ring.png",
    glb: "/redesign/demo/infinity-twist-pave-ring.glb",
    usdz: "/redesign/demo/infinity-twist-pave-ring.usdz",
    category: "ring",
    tryOnEnabled: true,
    widthCm: 12,
    heightCm: 12,
  },
  {
    slug: "necklace",
    id: "necklace",
    name: "Eternal Bloom Floral Necklace",
    sku: "JW-NCK-01",
    price: "₹12,50,000",
    vertical: "jewellery",
    label: "Concept / Interactive Demo",
    description:
      "A yellow-gold floral centre of marquise and pear-cut diamonds, finishing in a pear drop. Leaf motifs continue along the necklace. Concept / Interactive Demo.",
    image: "/redesign/demo/eternal-bloom-floral-necklace.png",
    imageUrl: "/redesign/demo/eternal-bloom-floral-necklace.png",
    glb: "/redesign/demo/eternal-bloom-floral-necklace.glb",
    usdz: "/redesign/demo/eternal-bloom-floral-necklace.usdz",
    category: "necklace",
    tryOnEnabled: true,
    widthCm: 20,
    heightCm: 20,
  },
] as const satisfies readonly DemoProduct[];

export const foodDemo = [
  {
    slug: "lava-cake",
    id: "lava-cake",
    name: "Chocolate Lava",
    sku: "FD-LAVA-01",
    price: "₹450",
    vertical: "food",
    label: "DEMO · Hero dish",
    description:
      "Warm chocolate fondant with a molten centre. One of three hero dishes with a real photograph and 3D/AR where supported.",
    image: "/redesign/demo/signature-molten-lava-cake.png",
    imageUrl: "/redesign/demo/signature-molten-lava-cake.png",
    glb: "/redesign/demo/signature-molten-lava-cake.glb",
    usdz: "/redesign/demo/signature-molten-lava-cake.usdz",
    veg: true,
    plateDiameterCm: 18,
    widthCm: 18,
    depthCm: 18,
    heightCm: 8,
  },
  {
    slug: "sparkler",
    id: "sparkler",
    name: "Berry Mocktail",
    sku: "FD-SPK-01",
    price: "₹320",
    vertical: "food",
    label: "DEMO · Hero drink",
    description:
      "A berry mocktail over crushed ice. One of three hero items with a real photograph and 3D/AR where supported.",
    image: "/redesign/demo/cherry-mint-sparkler.png",
    imageUrl: "/redesign/demo/cherry-mint-sparkler.png",
    glb: "/redesign/demo/cherry-mint-sparkler.glb",
    usdz: "/redesign/demo/cherry-mint-sparkler.usdz",
    veg: true,
    widthCm: 9,
    depthCm: 9,
    heightCm: 16,
  },
  {
    slug: "burger",
    id: "burger",
    name: "Signature Burger",
    sku: "FD-BRG-01",
    price: "₹480",
    vertical: "food",
    label: "DEMO · Hero dish",
    description:
      "Toasted brioche, seared patty, melted cheese, and house sauce. One of three hero dishes with a real photograph and 3D/AR where supported.",
    image: "/redesign/demo/signature-bacon-cheeseburger.png",
    imageUrl: "/redesign/demo/signature-bacon-cheeseburger.png",
    glb: "/redesign/demo/signature-bacon-cheeseburger.glb",
    usdz: "/redesign/demo/signature-bacon-cheeseburger.usdz",
    veg: false,
    plateDiameterCm: 26,
    widthCm: 26,
    depthCm: 26,
    heightCm: 10,
  },
] as const satisfies readonly DemoProduct[];

export const demoProducts = [...foodDemo] as const;

export type MenuCategory = "STARTERS" | "MAIN COURSE" | "DESSERTS" | "DRINKS";

export type DemoMenuItem = {
  slug: string;
  name: string;
  price: string;
  category: MenuCategory;
  description: string;
  veg: boolean;
  hero?: boolean;
  image?: string;
  glb?: string;
  usdz?: string;
};

export const demoRestaurant = {
  name: "B SOCIO DEMO RESTAURANT",
  badge: "DEMO",
  note: "This is a labelled product demonstration, not a customer restaurant.",
  whatsappPrefill: "Hi — I tried the B Socio DEMO restaurant menu.",
} as const;

export const demoMenu: readonly DemoMenuItem[] = [
  {
    slug: "chilli-garlic-potatoes",
    name: "Chilli Garlic Potatoes",
    price: "₹249",
    category: "STARTERS",
    description: "Crisp potatoes tossed in chilli-garlic. Text-and-price demo item.",
    veg: true,
  },
  {
    slug: "crispy-corn",
    name: "Crispy Corn",
    price: "₹229",
    category: "STARTERS",
    description: "Sweet corn, pepper, and a light toss. Text-and-price demo item.",
    veg: true,
  },
  {
    slug: "burger",
    name: "Signature Burger",
    price: "₹480",
    category: "MAIN COURSE",
    description: "Toasted brioche, seared patty, melted cheese, house sauce.",
    veg: false,
    hero: true,
    image: "/redesign/demo/signature-bacon-cheeseburger.png",
    glb: "/redesign/demo/signature-bacon-cheeseburger.glb",
    usdz: "/redesign/demo/signature-bacon-cheeseburger.usdz",
  },
  {
    slug: "butter-chicken-bowl",
    name: "Butter Chicken Bowl",
    price: "₹399",
    category: "MAIN COURSE",
    description: "A familiar bowl for the demo menu. Text-and-price only.",
    veg: false,
  },
  {
    slug: "paneer-tikka-wrap",
    name: "Paneer Tikka Wrap",
    price: "₹329",
    category: "MAIN COURSE",
    description: "Wrapped paneer tikka. Text-and-price demo item.",
    veg: true,
  },
  {
    slug: "lava-cake",
    name: "Chocolate Lava",
    price: "₹450",
    category: "DESSERTS",
    description: "Warm chocolate fondant with a molten centre.",
    veg: true,
    hero: true,
    image: "/redesign/demo/signature-molten-lava-cake.png",
    glb: "/redesign/demo/signature-molten-lava-cake.glb",
    usdz: "/redesign/demo/signature-molten-lava-cake.usdz",
  },
  {
    slug: "gulab-jamun",
    name: "Gulab Jamun",
    price: "₹159",
    category: "DESSERTS",
    description: "Classic sweet. Text-and-price demo item — no generated photo.",
    veg: true,
  },
  {
    slug: "sparkler",
    name: "Berry Mocktail",
    price: "₹320",
    category: "DRINKS",
    description: "Berry mocktail over crushed ice.",
    veg: true,
    hero: true,
    image: "/redesign/demo/cherry-mint-sparkler.png",
    glb: "/redesign/demo/cherry-mint-sparkler.glb",
    usdz: "/redesign/demo/cherry-mint-sparkler.usdz",
  },
  {
    slug: "masala-lemonade",
    name: "Masala Lemonade",
    price: "₹149",
    category: "DRINKS",
    description: "Lemon, spice, ice. Text-and-price demo item.",
    veg: true,
  },
  {
    slug: "filter-coffee",
    name: "Filter Coffee",
    price: "₹129",
    category: "DRINKS",
    description: "South-Indian style filter coffee. Text-and-price demo item.",
    veg: true,
  },
];

export const foodVerticals = [
  {
    id: "restaurant",
    title: "Restaurant",
    body: "Table QR, hero dishes, and WhatsApp orders with table number when you use table tents.",
  },
  {
    id: "cafe",
    title: "Café",
    body: "Signatures, drinks, and a phone menu that still works if AR is unavailable.",
  },
  {
    id: "bakery",
    title: "Bakery",
    body: "Cakes and counters that need a photograph first — 3D only when you commission it.",
  },
  {
    id: "sweet",
    title: "Sweet shop",
    body: "Festival boxes and mithai lines as a scannable catalogue, not a 100-item 3D dump.",
  },
  {
    id: "hotel",
    title: "Hotel",
    body: "In-room or restaurant menus guests open in the browser. No guest app.",
  },
  {
    id: "catering",
    title: "Catering",
    body: "A shareable menu for events. Enquiry on WhatsApp with the selected dishes.",
  },
  {
    id: "cloud",
    title: "Cloud kitchen",
    body: "A link on packaging or ads. 3D only for the few SKUs worth modelling.",
  },
  {
    id: "dessert",
    title: "Dessert",
    body: "Lava cakes, plated sweets, and drinks — the usual hero-product set.",
  },
] as const;

export function getDemoProduct(slug: string) {
  return demoProducts.find((item) => item.slug === slug);
}

export function isEarringTryOn(product: Pick<DemoProduct, "category" | "tryOnEnabled" | "slug">) {
  return product.category === "earring";
}

export function demoTryOnPath(product: Pick<DemoProduct, "slug" | "category">) {
  if (product.category === "ring" || product.category === "necklace" || product.category === "pendant") {
    return `/ar/try-on/${product.slug}`;
  }
  return "/ar/try-on";
}

export function demoPagePath(slug: string) {
  return `/ar/demo/${slug}`;
}

export function demoPageUrl(slug: string) {
  return `${site.production.arOrigin}${demoPagePath(slug)}`;
}

export function demoEnquireText(product: Pick<DemoProduct, "name" | "sku" | "vertical">) {
  return `Food demo enquiry: ${product.name} (${product.sku})`;
}

export function demoWhatsApp(product: Pick<DemoProduct, "name" | "sku" | "vertical">) {
  return waLink(site.whatsapp.ar, demoEnquireText(product));
}

export function foodActualSizeLabel(product: Pick<DemoProduct, "plateDiameterCm" | "widthCm" | "heightCm">) {
  if (product.plateDiameterCm) return `✓ Actual Size · ~${product.plateDiameterCm} cm plate`;
  if (product.widthCm && product.heightCm) return `✓ Actual Size · ~${product.widthCm}×${product.heightCm} cm`;
  return "✓ Actual Size";
}

export const pricing = [
  {
    id: "food",
    kicker: "FOOD AR PILOT",
    name: "Food AR Pilot",
    from: "₹14,999",
    recommended: true,
    include: [
      "3 hero products",
      "QR menu / table links",
      "3D product pages",
      "AR placement where the device supports it",
      "WhatsApp enquiry",
      "Basic scan and enquiry analytics",
      "30-day hosted pilot",
    ],
    exclude: [
      "Unlimited 3D modelling",
      "A full 100-item modelled menu",
      "Custom photography or kitchen shoot days",
      "Paid ads or influencer work",
    ],
    modelling: "Limited / quoted per extra dish — this pilot does not include unlimited modelling",
    setup: "Typically 7–14 days after reference photos",
    hosting: "30-day pilot included; extend by quote",
    after: "After the pilot, hosting and extra modelled dishes are quoted. We do not sell unlimited modelling at this price.",
  },
] as const;

export const costLayers = [
  {
    title: "Platform",
    body: "QR pages, catalogue, WhatsApp enquiry, and reporting for the pilot window.",
  },
  {
    title: "3D creation",
    body: "Modelling, optimisation, and materials for each hero product. Extra SKUs are quoted separately.",
  },
  {
    title: "Custom AR",
    body: "See on My Table object-placement AR where Android / iPhone support it — hero dishes at actual size.",
  },
] as const;

export const compatibility = [
  {
    name: "3D PRODUCT VIEWER",
    support: "Desktop / Android / iPhone",
    status: "yes" as const,
    note: "Rotate, zoom, and inspect in the browser.",
  },
  {
    name: "AR OBJECT PLACEMENT",
    support: "Android / iPhone",
    status: "yes" as const,
    note: "Place a published GLB / USDZ model in the room. Needs a real product model.",
  },
  {
    name: "SEE ON MY TABLE",
    support: "Android / iPhone · Food AR",
    status: "yes" as const,
    note: "Places a hero dish on a detected table at actual size. Interactive Demo — not a photogrammetry mesh.",
  },
] as const;
