/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  images: {
    // domains deprecated, но пока работает. remotePatterns надежнее.
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
    unoptimized: true // Оптимизация отключена (хорошо для Docker)
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  swcMinify: true,
  reactStrictMode: false, // Выключаем StrictMode, чтобы не было двойных запросов при разработке
  
  // НАСТРОЙКА ПРОКСИ (РЕШЕНИЕ CORS)
  async rewrites() {
    return [
      {
        // 1. Когда фронт стучится на /backend-api/...
        source: '/backend-api/:path*',
        // 2. Next.js пересылает это на Vercel (тут была опечатка backand -> backend)
        destination: 'https://elektromos-backand.vercel.app/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;