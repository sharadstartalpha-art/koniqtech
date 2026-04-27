import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const user = req.cookies.get("user")?.value;
  const role = req.cookies.get("role")?.value;

  const path = req.nextUrl.pathname;

  // USER routes
  if (path.startsWith("/products") && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ADMIN routes
  if (path.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}