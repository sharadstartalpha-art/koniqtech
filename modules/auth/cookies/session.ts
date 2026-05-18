"use server"

import { cookies }
from "next/headers"

import {

signToken,

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

export async function clearSession(){

const store=
await cookies()

store.delete("session")

}