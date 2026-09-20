import { NextResponse } from "next/server"
import { auth } from "@/auth"

export default auth((req) => {
  const path = req.nextUrl.pathname

  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/verify-email",
    "/forgot-password",
  ]

  const publicApiRoutes = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/send-otp",
    "/api/auth/verify-otp",
    "/api/auth/logout",
  ]

  const isPublicPage =
    publicRoutes.includes(path)

  const isPublicApi =
    publicApiRoutes.some((route) =>
      path.startsWith(route)
    )

  /*
   * Public routes are always allowed.
   */
  if (isPublicPage || isPublicApi) {
    return NextResponse.next()
  }

  /*
   * No authenticated user.
   */
  if (!req.auth?.user) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    )
  }

  /*
   * Inactive users cannot access
   * authenticated application routes.
   */
  if (req.auth.user.status !== "active") {
    return NextResponse.redirect(
      new URL("/login?error=inactive", req.url)
    )
  }

  const response =
    NextResponse.next()

  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  )

  response.headers.set(
    "Pragma",
    "no-cache"
  )

  response.headers.set(
    "Expires",
    "0"
  )

  return response
})

export const config = {
  matcher: [
    "/dashboard/:path*",

    "/admin/:path*",

    "/leads/:path*",

    "/customers/:path*",

    "/jobs/:path*",

    "/pipeline/:path*",

    "/calendar/:path*",

    "/billing/:path*",

    "/messages/:path*",

    "/settings/:path*",

    "/dispatch/:path*",

    "/notifications/:path*",

    "/analytics/:path*",

    "/monitoring/:path*",

    "/ai/:path*",

    "/quotes/:path*",

    "/subscriptions/:path*",
  ],
}