/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['images.pexels.com', 'res.cloudinary.com', 'i.ytimg.com'], // Add the domain here
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: [{ loader: '@svgr/webpack', options: { icon: true } }],
      });
      return config;
    },
  }
  
  module.exports = nextConfig;
  