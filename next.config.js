/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();

const nextConfig = withNextIntl({
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.techspecs.io/**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'i-techspecs-io.s3.us-west-1.amazonaws.com/**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com/**',
        port: '',
      },
    ],
  },
});

module.exports = nextConfig;
