import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

function normalizeProxyUrl(url: string) {
  return url.startsWith('http') ? url : `http://${url}`;
}

const apiProxyTarget = normalizeProxyUrl(process.env.API_PROXY_URL ?? 'http://localhost:3001');

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? '/api',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiProxyTarget}/api/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
