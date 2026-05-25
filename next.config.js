/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  turbopack: {
    root: __dirname
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: "/api?path=:path*"
        }
      ]
    };
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }
    ]
  }
};

module.exports = nextConfig;
