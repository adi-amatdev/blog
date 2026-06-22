import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NEXT_STANDALONE === 'true' ? 'standalone' : undefined,
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['shiki'],
};

export default nextConfig;
