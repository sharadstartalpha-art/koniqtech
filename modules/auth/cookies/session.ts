"use server"

import { cookies } from "next/headers"

import {
signToken,
verifyToken,
UserToken
}
from "../jwt/jwt"

export async function setSession(
user:UserToken
){

const token=
await signToken(user)

const store=
await cookies()

store.set(
"session",
token,
{
httpOnly:true,
secure:true,
sameSite:"lax",
path:"/",
maxAge:60*60*24*7
}
)

}

export async function getSession(){

const store=
await cookies()

const token=
store.get(
"session"
)?.value

if(!token){

return null

}

return verifyToken(token)

}

export async function clearSession(){

const store=
await cookies()

store.delete("session")

}