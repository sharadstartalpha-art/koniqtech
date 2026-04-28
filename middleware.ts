import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  let user: any = null;

  // ✅ verify JWT
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      user = payload;
    } catch (err) {
      console.log("Invalid token");
    }
  }

  // 🔐 PROTECT USER ROUTES
  if (path.startsWith("/products") && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔐 PROTECT ADMIN ROUTES
  if (path.startsWith("/admin") && user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// ✅ IMPORTANT (only run where needed)
export const config = {
  matcher: ["/products/:path*", "/admin/:path*"],
};