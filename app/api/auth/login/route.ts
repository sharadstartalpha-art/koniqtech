import { NextResponse } from "next/server"

import bcrypt from "bcryptjs"

import prisma from "@/shared/lib/prisma"

export async function POST(req:Request){

const body=await req.json()

const user=

await prisma.user.findUnique({

where:{

email:body.email

}

})

if(!user){

return NextResponse.json(

{

error:"invalid"

},

{

status:401

}

)

}

const ok=

await bcrypt.compare(

body.password,

user.passwordHash

)

if(!ok){

return NextResponse.json(

{

error:"invalid"

},

{

status:401

}

)

}

return NextResponse.json({

ok:true,

user

})

}