/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  transpilePackages: ['@vybot/core', '@vybot/crypto', '@vybot/db', '@vybot/discovery'],
};

export default nextConfig;
