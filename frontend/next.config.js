const { withContentlayer } = require("next-contentlayer");

const withPWA = require("@ducanh2912/next-pwa").default({
  disable: process.env.NODE_ENV === "development",
  dest: "public",
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
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
});

module.exports = withContentlayer(nextConfig);
