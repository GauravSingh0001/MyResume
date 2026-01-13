import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  // Increase serverless function payload size for PDF generation
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
  // Ensure PDF libraries are not bundled incorrectly
  serverExternalPackages: ['@react-pdf/renderer'],
};

export default nextConfig;
