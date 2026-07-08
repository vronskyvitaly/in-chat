import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  enablePrerenderSourceMaps: true,
  webpack: config => {
    config.cache = false
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**'
      },
      {
        protocol: 'https',
        hostname: 'vitaly-next-start.s3.eu-north-1.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'storage.yandexcloud.net'
      }
    ]
  }
}

export default nextConfig
