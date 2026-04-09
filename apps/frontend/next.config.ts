import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Expose only safe env vars to the browser
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  images: {
    // Allow OAuth provider avatars (Google, GitHub)
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
