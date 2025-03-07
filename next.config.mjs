/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Add redirects configuration
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.leo-mathurin.vercel.app' }],
        destination: 'https://leo-mathurin.vercel.app/:path*',
        permanent: true
      }
    ];
  }
};

export default nextConfig;
