import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 外部の画像を許可する
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
