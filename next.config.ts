import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        hostname: 'dummyimage.com',
        protocol: 'https',
        port: "",
      },
      {
        hostname: 'i.pinimg.com',
        protocol: 'https',
        port: "",
      },
      {
        hostname: 'lh3.googleusercontent.com',
        protocol: 'https',
        port: "",
      },
      {
        hostname: '*.public.blob.vercel-storage.com',
        protocol: 'https',
        port: "",
      }

    ]
  }
};

export default nextConfig;
