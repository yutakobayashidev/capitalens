/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    typedRoutes: true,
  },
  images: {
    disableStaticImages: true,
  },
};

module.exports = nextConfig;
