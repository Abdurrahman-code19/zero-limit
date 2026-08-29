import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lnjsubncmwhdjnralofb.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.paystack.co https://accounts.google.com https://apis.google.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://paystack.com",
            "img-src 'self' data: blob: https://lnjsubncmwhdjnralofb.supabase.co https://paystack.com https://checkout.paystack.com",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self' https://lnjsubncmwhdjnralofb.supabase.co https://api.paystack.co https://checkout.paystack.com",
            "frame-src 'self' https://js.paystack.co https://accounts.google.com https://checkout.paystack.com",
            "object-src 'none'",
          ].join("; "),
        },
      ],
    },
  ],
}

export default nextConfig
