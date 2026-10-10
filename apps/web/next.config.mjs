/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@vybot/core', '@vybot/crypto', '@vybot/db', '@vybot/discovery'],
};

export default nextConfig;
