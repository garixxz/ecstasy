/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      // Add your Supabase project domain
      'https://uloapkdedinhxzorxznx.supabase.co',
      // Add any other domains you need
      'http://localhost:3000'
    ],
    // This allows SVG placeholders to work
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default nextConfig

