import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@blackpolar/ui", "@blackpolar/api-client"],
  output: "standalone", // genera un build mínimo, ideal para PM2 en la VPS
};

export default nextConfig;
