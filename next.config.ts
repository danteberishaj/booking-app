import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Portfolio app: hosts can paste image URLs from anywhere, so we allow any
    // HTTPS image host. (For a production app you'd restrict this to a known
    // allowlist instead.)
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
