import createNextIntlPlugin from 'next-intl/plugin';
import withBundleAnalyzer from '@next/bundle-analyzer';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https' as const,
        hostname: 'uploadthing.com',
      },
    ],
    formats: ['image/avif' as const, 'image/webp' as const],
    // Allow Next.js image optimization to work properly
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 176, 256],
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-slot',
      'framer-motion',
      'date-fns',
      'recharts',
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:lang(en|ps|fa)/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/:path*.(js|css|woff2|woff|ttf|otf|ico|svg|png|jpg|jpeg|webp|avif)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Cache Next.js image optimization results
      {
        source: '/_next/image',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000, s-maxage=2592000, immutable' },
        ],
      },
    ];
  },
  // Enable compression
  compress: true,
  webpack: (config: any, { webpack }: { webpack: any }) => {
    // Fix Windows case-sensitivity issues for locale JSON files
    // This prevents "multiple modules with names that only differ in casing" warnings
    if (process.platform === 'win32') {
      // Only normalize paths for locale JSON files to avoid breaking Next.js internals
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /src[\\/]locales[\\/].*\.json$/i,
          (resource: any) => {
            if (resource.request && typeof resource.request === 'string') {
              // Normalize drive letter to lowercase
              resource.request = resource.request.replace(/^[A-Z]:/, (match: string) => match.toLowerCase());
            }
          }
        )
      );
    }
    return config;
  },
};

export default withAnalyzer(withNextIntl(nextConfig));
