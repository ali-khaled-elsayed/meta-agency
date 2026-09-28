import type { NextConfig } from "next";

const apiUrl = new URL(process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8010/api/v1");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 90],
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: "/storage/**",
      },
    ],
    // Local development serves media from 127.0.0.1, which Next blocks by default.
    dangerouslyAllowLocalIP: process.env.NEXT_IMAGE_ALLOW_LOCAL_IP === "true",
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // Legacy WordPress archives and template parts that have no equivalent on the new site.
    return [
      { source: "/category/:path*", destination: "/en/blog", permanent: true },
      { source: "/tag/:path*", destination: "/en/blog", permanent: true },
      { source: "/author/:path*", destination: "/en/blog", permanent: true },
      { source: "/feed", destination: "/en/blog", permanent: true },
      { source: "/tf-header/:path*", destination: "/en", permanent: true },
      { source: "/tf-footer/:path*", destination: "/en", permanent: true },
      { source: "/home", destination: "/en", permanent: true },
    ];
  },
};

export default nextConfig;
