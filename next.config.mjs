import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': resolve(__dirname, 'src'),
    };
    return config;
  },
  images: {
    domains: [
      'maroon-vital-bass-312.mypinata.cloud',
      'm.media-amazon.com',
      'images-na.ssl-images-amazon.com',
      'images.unsplash.com',
      'media.amazon.com'
    ],
  },
};

export default nextConfig;