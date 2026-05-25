import "./globals.css";
import { PWARegister } from "@/components/public/PWARegister";

export const metadata = {
  title: "AR Design Studio",
  description: "Scan. View. Experience. Order.",
  manifest: "/manifest.json",
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
