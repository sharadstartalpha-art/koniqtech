import { cookies } from "next/headers"

import { NextResponse } from "next/server"

async function clearAuth(){

const store=

await cookies()

store.delete("token")

store.delete("session")

store.delete("auth")

return NextResponse.redirect(

new URL(

"/login",

process.env.NEXT_PUBLIC_BASE_URL

||

"https://koniqtech.com/"

)

)

}

export async function GET(){

return clearAuth()

}

export async function POST(){

return clearAuth()

}