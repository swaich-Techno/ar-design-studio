import QRCode from "qrcode";

export function appUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function productPublicUrl(businessSlug, productSlug) {
  return `${appUrl()}/b/${businessSlug}/product/${productSlug}`;
}

export function cataloguePublicUrl(businessSlug) {
  return `${appUrl()}/b/${businessSlug}`;
}

export function tablePublicUrl(businessSlug, tableNumber) {
  return `${appUrl()}/b/${businessSlug}/table/${encodeURIComponent(tableNumber)}`;
}

export function campaignPublicUrl(businessSlug, campaignSlug) {
  return `${appUrl()}/b/${businessSlug}/campaign/${campaignSlug}`;
}

export async function generateQrDataUrl(url) {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 800,
    color: {
      dark: "#0b1020",
      light: "#ffffff"
    }
  });
}
