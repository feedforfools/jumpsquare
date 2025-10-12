import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Add security headers
  async headers() {
    return [
      // Rule for the new extension API endpoint
      {
        source: "/api/extension/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            // TODO: For development '*' is fine.
            // For production restrict this to Chrome extension's ID, e.g.,
            // value: "chrome-extension://[YOUR_EXTENSION_ID_HERE]",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, X-Extension-Instance-Id, X-Real-IP",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Robots-Tag",
            value: "index, follow, noarchive, noimageindex, nocache",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
              img-src 'self' data: https: blob:;
              connect-src 'self' https://*.supabase.co https://vercel.live https://va.vercel-scripts.com;
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
