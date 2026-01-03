const nextConfig = {
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  images: {
    domains: ['localhost', '127.0.0.1'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
    unoptimized: true 
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  swcMinify: true,
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'https://elektromos-backand.vercel.app/api/:path*',
        }
      ],
      afterFiles: []
    };
  }
};

module.exports = nextConfig;