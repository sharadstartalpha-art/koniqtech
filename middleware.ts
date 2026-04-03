import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const pathname = req.nextUrl.pathname;

      // ✅ Allow auth routes
      if (pathname.startsWith("/api/auth")) {
        return true;
      }

      // 🔒 Protect everything else
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
  ],
};