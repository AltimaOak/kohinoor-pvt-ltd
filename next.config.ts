import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfkit"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "*.firebasestorage.app",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.app",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self' https: data: blob:;",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https: http:;",
              "style-src 'self' 'unsafe-inline' https:;",
              "img-src 'self' blob: data: https: http:;",
              "font-src 'self' data: https:;",
              "connect-src 'self' https: wss: http:;",
              "frame-src 'self' https: http:;",
              "object-src 'none';",
            ].join(" "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
