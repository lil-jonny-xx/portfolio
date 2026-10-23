import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: classic rendering model so unknown /work/* slugs get a real 404 status.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
