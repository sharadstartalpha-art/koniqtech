import { NextRequest, NextResponse } from "next/server"

export function proxy(req: NextRequest){

const tenant = req.cookies.get("tenant")

if(!tenant){

return NextResponse.redirect(
new URL("/login",req.url)
)

}

return NextResponse.next()

}