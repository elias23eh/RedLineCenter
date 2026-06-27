import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000, // 30 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.redlinecenter.com",
        pathname: "/media/cache/**",
      },
    ],
  },
};

export default nextConfig;
