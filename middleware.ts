import { NextRequest, NextResponse } from "next/server"

export function middleware(
  req:NextRequest
){

  const token=

    req.cookies.get(
      "token"
    )?.value

  const path=

    req.nextUrl.pathname

  const publicRoutes=[

    "/login",

    "/register",

    "/verify-email",

    "/forgot-password",

    "/api/auth/login",

    "/api/auth/register",

    "/api/auth/send-otp",

    "/api/auth/verify-otp",

    "/api/auth/logout"

  ]

  const isPublic=

    publicRoutes.some(

      route=>

      path.startsWith(
        route
      )

    )

  /*
  NOT LOGGED IN
  */

  if(

    !token &&

    !isPublic

  ){

    return NextResponse.redirect(

      new URL(

        "/login",

        req.url

      )

    )

  }

  /*
  ALREADY LOGGED IN
  */

  if(

    token &&

    (

      path==="/login" ||

      path==="/register"

    )

  ){

    return NextResponse.redirect(

      new URL(

        "/dashboard",

        req.url

      )

    )

  }

  return NextResponse.next()

}

export const config={

  matcher:[

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

    "/ai/:path*"

  ]

}