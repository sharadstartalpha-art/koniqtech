import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

export async function middleware(req: any) {
  const token = await getToken({ req });

  const url = req.nextUrl.pathname;

  // 🔐 PROTECT DASHBOARD
  if (url.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 🔐 PROTECT ADMIN
  if (url.startsWith("/admin")) {
    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

