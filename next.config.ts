import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@sparticuz/chromium",
  ],

  outputFileTracingIncludes: {
    "/api/invoices/pdf/[id]": [
      "./node_modules/@sparticuz/chromium/**",
    ],
  },
};

export default nextConfig;