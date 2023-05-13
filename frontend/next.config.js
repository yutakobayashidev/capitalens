const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    disableStaticImages: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    disableStaticImages: true,
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withContentlayer(nextConfig);
