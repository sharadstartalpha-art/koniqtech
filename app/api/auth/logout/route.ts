import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(){

const store=await cookies()

store.delete("token")
store.delete("session")
store.delete("auth")

const response=NextResponse.json({

success:true

})

response.headers.set(

"Cache-Control",

"no-store, no-cache, must-revalidate"

)

return response

}