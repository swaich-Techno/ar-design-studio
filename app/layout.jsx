import "./globals.css";
import { PWARegister } from "@/components/public/PWARegister";

export const metadata = {
  metadataBase: new URL("https://ar.bsocio.in"),
  title: {
    default: "AR Design Studio | QR Catalogue & AR Product Viewer",
    template: "%s"
  },
  description: "Create QR product catalogues, AR product previews, WhatsApp enquiry pages, digital menus, campaign QR pages, analytics, and product landing pages for local businesses.",
  manifest: "/manifest.json",
  applicationName: "AR Design Studio",
  authors: [{ name: "B Socio", url: "https://www.bsocio.in" }],
  creator: "B Socio",
  publisher: "B Socio",
  keywords: [
    "QR catalogue for shops",
    "AR product viewer India",
    "QR menu for restaurants",
    "digital catalogue for sweet shop",
    "AR catalogue for furniture",
    "QR product catalogue with WhatsApp order",
    "3D product viewer for website",
    "AR marketing for local business",
    "QR catalogue with WhatsApp enquiry",
    "digital product catalogue for local business"
  ],
  appleWebApp: {
    capable: true,
    title: "AR Design Studio",
    statusBarStyle: "black-translucent"
  },
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  }
};

export const viewport = {
  themeColor: "#0f766e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
