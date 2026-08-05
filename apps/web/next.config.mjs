/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@floodwatch/ui",
    "@floodwatch/api-client",
    "@floodwatch/utils",
    "@floodwatch/types",
  ],
};

export default nextConfig;
