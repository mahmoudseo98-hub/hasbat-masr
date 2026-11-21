import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: no Cache Components, so unknown slugs get a real 404 via dynamicParams=false.
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
