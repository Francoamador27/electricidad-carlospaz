import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ["@voltis/shared"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
