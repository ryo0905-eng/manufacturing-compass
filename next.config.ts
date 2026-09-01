import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www\\.mfg-compass\\.com",
          },
        ],
        destination: "https://mfg-compass.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: ".*\\.vercel\\.app",
          },
        ],
        destination: "https://mfg-compass.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
