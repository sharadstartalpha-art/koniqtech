import { NextResponse } from "next/server";

export function middleware(req: any) {
  const user = req.cookies.get("user");

  if (
    req.nextUrl.pathname.startsWith("/products") &&
    !user
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (
    req.nextUrl.pathname.startsWith("/admin") &&
    user !== "admin"
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}