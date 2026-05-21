import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {

const store = await cookies()

store.delete("token")

store.delete("session")

store.delete("auth")

return NextResponse.redirect(

new URL(

"/login",

process.env.NEXT_PUBLIC_APP_URL ||

"https://koniqtech.com/"

)

)

}