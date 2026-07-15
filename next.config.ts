import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "snxcuwbtxffkongtrxsb.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Miniaturas dos videos do YouTube (pagina /relatos).
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
};

export default nextConfig;
