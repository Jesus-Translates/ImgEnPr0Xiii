// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable Vercel's Serverless Functions for python backend via `/api` routes.
  // No special config needed; just ensure the `output: 'standalone'` for deployment.
  output: 'standalone',
};
module.exports = nextConfig;
