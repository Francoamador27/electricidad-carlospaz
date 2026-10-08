import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `next dev` usa su propia carpeta para no pisarse con `next build` si corren a la vez.
  // (El build se queda en .next: con output "export", cambiar distDir mueve también la salida.)
  distDir: process.env.npm_lifecycle_event === "dev" ? ".next-dev" : ".next",
  output: "export",
  transpilePackages: ["@voltis/shared", "@voltis/db"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
