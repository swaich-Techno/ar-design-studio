import "./globals.css";
import { PWARegister } from "@/components/public/PWARegister";
import { MarketingPixels } from "@/components/public/MarketingPixels";
import { ConversionTracker } from "@/components/public/ConversionTracker";

export const metadata = {
  metadataBase: new URL("https://ar.bsocio.in"),
  title: {
    default: "B Socio AR | Interactive QR, 3D & AR Menus for Food Businesses",
    template: "%s"
  },
  description: "Turn restaurant, café, bakery and food menus into interactive digital experiences with QR access, premium product presentation, 3D dishes, AR and direct enquiry.",
  manifest: "/manifest.json",
  applicationName: "B Socio AR",
  authors: [{ name: "B Socio", url: "https://www.bsocio.in" }],
  creator: "B Socio",
  publisher: "B Socio",
  appleWebApp: {
    capable: true,
    title: "B Socio AR",
    statusBarStyle: "black-translucent"
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: [{ url: "/favicon.ico" }]
  }
};

export const viewport = {
  themeColor: "#07111f",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <MarketingPixels />
        <ConversionTracker />
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
