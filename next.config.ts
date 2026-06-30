import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.70.6'],
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
