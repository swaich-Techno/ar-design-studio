import { mb } from "@/lib/plans";
import { clip, isHttpUrl, stripTags } from "@/lib/textSafe";

export const PRODUCT_TYPES = ["STANDARD", "FABRIC", "GARMENT", "FURNITURE", "JEWELLERY", "FOOD", "REAL_ESTATE", "AUTOMOBILE"];
export const STOCK_STATUSES = ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK", "MADE_TO_ORDER"];
export const DIETARY = ["", "VEG", "NON_VEG", "EGG", "VEGAN"];

function toList(value, maxItems = 24, maxLen = 80) {
  const items = Array.isArray(value) ? value : String(value || "").split(",");
  return items.map((item) => clip(item, maxLen)).filter(Boolean).slice(0, maxItems);
}

function money(value) {
  const n = Number(value || 0);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, 10000000);
}

function namedPriceList(value, maxItems = 20) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => ({
      name: clip(item?.name, 60),
      price: money(item?.price ?? item?.priceDelta ?? 0),
      priceDelta: money(item?.priceDelta ?? item?.price ?? 0)
    }))
    .filter((item) => item.name)
    .slice(0, maxItems);
}

function safeUrl(value) {
  const text = stripTags(value).slice(0, 500);
  if (!text) return "";
  return isHttpUrl(text) ? text : "";
}

export function sanitizeProductInput(body = {}) {
  const hasARModel = Boolean(body.modelGlbUrl || body.modelUsdzUrl || body.hasARModel);
  const dietary = DIETARY.includes(body.dietary) ? body.dietary : "";
  const stockStatus = STOCK_STATUSES.includes(body.stockStatus) ? body.stockStatus : "IN_STOCK";
  const soldOut = body.isSoldOut === true || stockStatus === "OUT_OF_STOCK";
  return {
    name: clip(body.name, 120),
    category: clip(body.category || "General", 80) || "General",
    price: money(body.price),
    discountPrice: money(body.discountPrice),
    description: clip(body.description, 4000),
    shortDescription: clip(body.shortDescription, 400),
    imageUrl: safeUrl(body.imageUrl),
    galleryImages: toList(body.galleryImages, 12, 500).filter(isHttpUrl),
    fileSizeMB: mb(body.fileSizeMB || 0),
    productType: PRODUCT_TYPES.includes(body.productType) ? body.productType : "STANDARD",
    fabricImageUrl: safeUrl(body.fabricImageUrl),
    stitchedPreviewImageUrl: safeUrl(body.stitchedPreviewImageUrl),
    stitchedPreviewNotes: clip(body.stitchedPreviewNotes, 500),
    supportsRotation: Boolean(body.supportsRotation || hasARModel),
    modelGlbUrl: safeUrl(body.modelGlbUrl),
    modelUsdzUrl: safeUrl(body.modelUsdzUrl),
    modelFileSizeMB: mb(body.modelFileSizeMB || 0),
    hasARModel,
    offerText: clip(body.offerText, 120),
    tags: toList(body.tags, 16, 40),
    isAvailable: body.isAvailable !== false,
    isHidden: Boolean(body.isHidden),
    isSoldOut: soldOut,
    stockStatus: soldOut ? "OUT_OF_STOCK" : stockStatus,
    stockQuantity: Math.max(0, Math.min(Number(body.stockQuantity || 0) || 0, 100000)),
    showStockToCustomers: body.showStockToCustomers !== false,
    isFeatured: Boolean(body.isFeatured),
    isBestSeller: Boolean(body.isBestSeller),
    isNewItem: Boolean(body.isNewItem || body.isNew),
    isTodaysSpecial: Boolean(body.isTodaysSpecial),
    sortOrder: Math.max(0, Math.min(Number(body.sortOrder || 0) || 0, 9999)),
    dietary,
    variants: namedPriceList(body.variants),
    addons: namedPriceList(body.addons),
    calories: body.calories === 0 || body.calories ? Math.max(0, Math.min(Number(body.calories) || 0, 20000)) : undefined,
    allergens: toList(body.allergens, 20, 40)
  };
}

export const PRODUCT_PUBLIC_SELECT =
  "name slug category price discountPrice description shortDescription imageUrl galleryImages fabricImageUrl stitchedPreviewImageUrl stitchedPreviewNotes modelGlbUrl modelUsdzUrl offerText tags isAvailable hasARModel supportsRotation stockStatus stockQuantity showStockToCustomers productType dietary isSoldOut isFeatured isBestSeller isNewItem isTodaysSpecial sortOrder variants addons calories allergens";
