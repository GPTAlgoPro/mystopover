import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.70.6'],
  devIndicators: false,
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
