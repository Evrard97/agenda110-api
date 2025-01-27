import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Supprime `swcMinify` si elle est présente
  reactStrictMode: true,
  output: "standalone", // Conserve cette option pour Docker
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
