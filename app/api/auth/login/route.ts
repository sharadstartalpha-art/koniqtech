import prisma from "@/shared/lib/prisma"

import bcrypt from "bcryptjs"

import { cookies } from "next/headers"

import { NextResponse } from "next/server"

export async function POST(

req:Request

){

const body=

await req.json()

const user=

await prisma.user.findUnique({

where:{

email:body.email

}

})

if(!user){

return NextResponse.json(

{

error:"Invalid login"

},

{

status:401

}

)

}

const valid=

await bcrypt.compare(

body.password,

user.passwordHash

)

if(!valid){

return NextResponse.json(

{

error:"Invalid login"

},

{

status:401

}

)

}

const store=

await cookies()

store.set(

"token",

user.email,

{

httpOnly:true,

path:"/"

}

)

return NextResponse.json({

success:true,

role:user.role,

redirect:

user.role==="super_admin"

?"/admin/dashboard"

:"/dashboard"

})

}