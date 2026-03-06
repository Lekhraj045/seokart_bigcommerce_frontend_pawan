

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '',
  reactStrictMode:false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagsapi.com'
      },
      {
        protocol: 'https',
        hostname: 'shopify.favseo.com'
      },  
      {
        protocol: 'https',
        hostname: '**.mybigcommerce.com'
      },
      {
        protocol: 'https',
        hostname: 'cdn11.bigcommerce.com'
      },
      {
        protocol: 'https',
        hostname: 'app.seokart.com'
      }
    ],
  }
}

module.exports = nextConfig;
