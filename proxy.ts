import {

NextRequest,

NextResponse

}

from
"next/server"

import {

jwtVerify

}

from
"jose"

const secret=

new TextEncoder()

.encode(

process.env.JWT_SECRET

)

export async function proxy(

request:NextRequest

){

const token=

request.cookies.get(

"koniq_session"

)?.value

const path=

request.nextUrl.pathname

const publicRoutes=[

"/login",

"/register"

]

if(

publicRoutes.includes(

path

)

){

return NextResponse.next()

}

if(!token){

return NextResponse.redirect(

new URL(

"/login",

request.url

)

)

}

try{

await jwtVerify(

token,

secret

)

return NextResponse.next()

}catch{

return NextResponse.redirect(

new URL(

"/login",

request.url

)

)

}

}

export const config={

matcher:[

"/dashboard/:path*",

"/admin/:path*",

"/leads/:path*",

"/customers/:path*",

"/quotes/:path*",

"/jobs/:path*",

"/calendar/:path*",

"/settings/:path*",

"/billing/:path*",

"/reports/:path*",

"/messages/:path*",

"/pipeline/:path*"

]

}