import { cookies } from "next/headers"

const COOKIE_NAME =
"koniq_session"

export async function setSession(
token:string
){

const cookieStore=
await cookies()

cookieStore.set(

COOKIE_NAME,

token,

{

httpOnly:true,

secure:
process.env.NODE_ENV
==="production",

sameSite:"lax",

path:"/",

maxAge:
60*60*24*7

}

)

}

export async function getSession(){

const cookieStore=
await cookies()

return cookieStore.get(
COOKIE_NAME
)?.value

}

export async function clearSession(){

const cookieStore=
await cookies()

cookieStore.delete(
COOKIE_NAME
)

}