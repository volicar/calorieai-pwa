/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 1 ano
        }
      }
    },
    {
      urlPattern: /^https:\/\/api\.openai\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'openai-api',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60 // 1 dia
        }
      }
    }
  ]
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
};

module.exports = withPWA(nextConfig);