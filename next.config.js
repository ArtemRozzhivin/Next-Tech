/** @type {import('next').NextConfig} */

const nextConfig = {
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
      {
        protocol: 'https',
        hostname: 'www.google.com/**',
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;
