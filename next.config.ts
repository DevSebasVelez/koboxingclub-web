import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-ea986fd84e9d4e7aa3484307ea5f02b1.r2.dev",
      },
    ],
  },
};

export default nextConfig;
