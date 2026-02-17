import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [80, 100],
    remotePatterns: [
      new URL(
        "https://yiekmttlsbbkcixzzohc.supabase.co/storage/v1/object/public/cabin-images/**",
      ),
    ],
  },
};

export default nextConfig;
