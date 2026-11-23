/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow remote artwork if you point products to external URLs (add your CDN host here).
  images: { remotePatterns: [] },
};
export default nextConfig;
