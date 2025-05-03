/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['agrimarket-1.onrender.com', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'agrimarket-1.onrender.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    turbo: {
      rules: {
        // Configure Turbopack rules here
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/i,
      type: 'asset/resource',
    });
    return config;
  },
}

module.exports = nextConfig 