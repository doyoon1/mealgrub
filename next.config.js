/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ["next-meal-planner.s3.amazonaws.com"],
  },
}

module.exports = nextConfig
