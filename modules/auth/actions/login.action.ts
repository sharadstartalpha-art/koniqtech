"use server"

import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

import prisma from "@/shared/lib/prisma"

import { setSession }
from "../cookies/session"

export async function loginAction(
    _: unknown,
    formData: FormData
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

where:{
email
}

})

if(!user){

return{
error:"Invalid credentials"
}

}

const ok=
await bcrypt.compare(

password,

user.passwordHash

)

if(!ok){

return{
error:"Invalid credentials"
}

}

await setSession({

id:user.id,

orgId:user.orgId,

role:user.role

})

redirect("/dashboard")

}