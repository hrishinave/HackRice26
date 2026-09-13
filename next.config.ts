import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ffmpeg-static locates its binary via __dirname at require time; bundling it
  // rewrites that path and breaks resolution, so it must run via native require.
  serverExternalPackages: ["ffmpeg-static"],
};

export default nextConfig;
