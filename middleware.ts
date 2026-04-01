import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req) {
  const token = await getToken({ req })

  const isAuthPage = req.nextUrl.pathname.startsWith("/login")
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard")

  if (!token && isDashboard) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}