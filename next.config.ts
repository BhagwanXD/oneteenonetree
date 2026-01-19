import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ['*'] },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  },
  async redirects() {
    return [
      {
        source: '/form',
        destination: 'https://forms.gle/YYSXR9oWTqPYatzY6',
        permanent: false,
      },
    ]
  }
}
export default nextConfig
