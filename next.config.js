/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  transpilePackages: ["@mediapipe/tasks-vision"],
  turbopack: {
    root: __dirname
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
  async redirects() {
    return [
      { source: "/jewellery", destination: "/ar/food", permanent: true },
      { source: "/ar/jewellery", destination: "/ar/food", permanent: true },
      { source: "/ar/try-on", destination: "/ar/food", permanent: true },
      { source: "/ar/try-on/:path*", destination: "/ar/food", permanent: true },
      { source: "/ring", destination: "/ar/food", permanent: true },
      { source: "/necklace", destination: "/ar/food", permanent: true },
      { source: "/ar/demo/pendant", destination: "/ar/demo", permanent: true },
      { source: "/ar/demo/ring", destination: "/ar/demo", permanent: true },
      { source: "/ar/demo/necklace", destination: "/ar/demo", permanent: true },
      { source: "/restaurants", destination: "/ar/food", permanent: true },
      { source: "/sweet-shops", destination: "/ar/food", permanent: true },
      { source: "/furniture", destination: "/", permanent: true },
      { source: "/real-estate", destination: "/", permanent: true },
      { source: "/automobile", destination: "/", permanent: true },
      { source: "/boutiques", destination: "/", permanent: true },
      { source: "/electronics", destination: "/", permanent: true },
      { source: "/pricing", destination: "/ar/pricing", permanent: true },
      { source: "/food", destination: "/ar/food", permanent: true },
      { source: "/demo", destination: "/ar/demo", permanent: true },
      { source: "/how-it-works", destination: "/ar/how-it-works", permanent: true },
      { source: "/food-businesses", destination: "/ar/food-businesses", permanent: true },
      { source: "/business", destination: "/business/login", permanent: false }
    ];
  },
  async rewrites() {
    return {
      afterFiles: [
        {
          source: "/api/:path*",
          destination: "/api?path=:path*"
        }
      ]
    };
  },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      },
      {
        source: "/icons/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      },
      {
        source: "/brand/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      },
      {
        source: "/redesign/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Access-Control-Allow-Origin", value: "*" }
        ]
      },
      {
        source: "/models/try-on/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      },
      {
        source: "/mediapipe/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" }
        ]
      },
      {
        source: "/favicon.ico",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      },
      {
        source: "/og-image.jpg",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; base-uri 'self'; form-action 'self' https://wa.me https://api.whatsapp.com; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com https://www.facebook.com https://www.googletagmanager.com; font-src 'self' data:; connect-src 'self' blob: https://huggingface.co https://microsoft-trellis-2.hf.space wss://microsoft-trellis-2.hf.space https://res.cloudinary.com https://*.cloudinary.com https://api.cloudinary.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://wa.me; media-src 'self' blob: https://res.cloudinary.com https://*.cloudinary.com; worker-src 'self' blob:; child-src 'self' blob:; frame-src 'self' blob: https://arvr.google.com https://www.youtube.com; manifest-src 'self'"
          }
        ]
      }
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "ar.bsocio.in" },
      { protocol: "https", hostname: "*.cloudinary.com" }
    ]
  }
};

module.exports = nextConfig;
