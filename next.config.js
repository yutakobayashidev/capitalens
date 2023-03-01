/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    disableStaticImages: true,
  },
};

module.exports = nextConfig;
