/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: [process.env.NEXT_PUBLIC_IMAGE_DOMAIN],
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
  }
  
  module.exports = nextConfig