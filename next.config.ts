import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Active le mode strict de React
  swcMinify: true,       // Active le minificateur SWC pour de meilleures performances
  output: "standalone",  // Indispensable pour les déploiements Docker
};

export default nextConfig;
