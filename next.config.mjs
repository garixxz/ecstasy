import { withNetlify } from '@netlify/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    domains: [
      // Supabase domain (without https://)
      'uloapkdedinhxzorxznx.supabase.co',
      'localhost',
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default withNetlify(nextConfig);
