import type { NextConfig } from 'next';

const nextConfig: NextConfig =
  process.env.NETLIFY === 'true' ? { output: 'export' } : {};

export default nextConfig;
