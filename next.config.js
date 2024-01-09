/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();

const nextConfig = withNextIntl({
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.techspecs.io',
        port: '',
        pathname: '',
      },
    ],
  },
});

module.exports = nextConfig;
