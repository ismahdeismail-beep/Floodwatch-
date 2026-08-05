import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the monorepo root explicitly so builds are not mis-rooted when a
  // stray lockfile exists in a parent directory (e.g. a home-dir npm install).
  outputFileTracingRoot: path.join(__dirname, "..", ".."),
  transpilePackages: [
    "@floodwatch/ui",
    "@floodwatch/api-client",
    "@floodwatch/utils",
    "@floodwatch/types",
  ],
};

export default nextConfig;
