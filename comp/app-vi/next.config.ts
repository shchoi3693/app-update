import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lastfm.freetls.fastly.net', // Last.fm 이미지 호스트
      },
    ],
  },
};

export default nextConfig;
