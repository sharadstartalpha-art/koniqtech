"use server"

import bcrypt from "bcryptjs"

import { redirect } from "next/navigation"

import prisma from "@/shared/lib/prisma"

import { createSession }
from "../cookies/session"

export async function loginAction(
_:unknown,
formData:FormData
){

const email=
String(
formData.get("email")
)

const password=
String(
formData.get("password")
)

const user=
await prisma.user.findUnique({

where:{email}

})

if(!user){

return{
error:"Invalid login"
}

}

const ok=
await bcrypt.compare(

password,

user.password

)

if(!ok){

return{
error:"Invalid login"
}

}

await createSession({

id:user.id,

orgId:user.orgId,

role:user.role

})

redirect(
"/dashboard"
)

}