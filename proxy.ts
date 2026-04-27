import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const user = req.cookies.get("user")?.value;

  const url = req.nextUrl.pathname;

  // Protect product routes
  if (url.startsWith("/products") && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Protect admin
  if (url.startsWith("/admin") && user !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}