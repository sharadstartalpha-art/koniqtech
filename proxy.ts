import { NextRequest, NextResponse } from "next/server"

export function middleware(
req: NextRequest
){

const auth =
req.cookies.get(
"auth"
)

const path=
req.nextUrl.pathname

const publicRoutes=[

"/login",
"/register",

"/api/auth/login",

"/api/auth/register",

"/api/auth/send-otp",

"/api/auth/verify-otp"

]

if(
!auth &&
!publicRoutes.some(
r=>path.startsWith(r)
)
){

return NextResponse.redirect(
new URL(
"/login",
req.url
)
)

}

return NextResponse.next()

}

export const config={

matcher:[

"/dashboard/:path*",

"/leads/:path*",

"/customers/:path*",

"/jobs/:path*",

"/pipeline/:path*",

"/settings/:path*"

]

}