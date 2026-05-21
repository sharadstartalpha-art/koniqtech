import prisma from "@/shared/lib/prisma"

import bcrypt from "bcryptjs"

import { cookies } from "next/headers"

import { NextResponse } from "next/server"

export async function POST(

req:Request

){

try{

const body=

await req.json()

const email=

body.email

?.trim()

.toLowerCase()

const password=

body.password

const user=

await prisma.user.findUnique({

where:{

email

}

})

if(!user){

console.log(

"LOGIN USER NOT FOUND",

email

)

return NextResponse.json(

{

error:

"Invalid email or password"

},

{

status:401

}

)

}

const valid=

await bcrypt.compare(

password,

user.passwordHash

)

if(!valid){

console.log(

"PASSWORD INVALID",

email

)

return NextResponse.json(

{

error:

"Invalid email or password"

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

secure:true,

sameSite:"lax",

path:"/"

}

)

console.log(

"LOGIN SUCCESS",

user.email,

user.role

)

return NextResponse.json({

success:true,

role:user.role,

redirect:

user.role==="super_admin"

?

"/admin/dashboard"

:

"/dashboard"

})

}

catch(

e

){

console.error(

e

)

return NextResponse.json(

{

error:

"Server error"

},

{

status:500

}

)

}

}