import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  // fe has its own yarn.lock. Pin the root so Next.js does not pick a
  // lockfile in a parent folder (the repo root yarn.lock) as the root.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
