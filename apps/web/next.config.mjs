/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  transpilePackages: ['@vybot/core', '@vybot/crypto', '@vybot/db', '@vybot/discovery'],
};

export default nextConfig;
