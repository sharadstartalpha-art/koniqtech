import bcrypt from "bcryptjs"

import prisma from "@/shared/lib/prisma"

import { NextResponse }

from "next/server"

export async function POST(
req:Request
){

const body=await req.json()

const otp=

await prisma.otpCode.findFirst({

where:{

email:body.email,

code:body.code,

verified:false

}

})

if(!otp){

return NextResponse.json(
{error:"invalid"},
{status:400}
)

}

const hash=

await bcrypt.hash(
body.password,
10
)

const user=

await prisma.user.create({

data:{

name:body.name,

organization:

body.organization,

email:body.email,

passwordHash:hash,

role:"owner"

}

})

await prisma.otpCode.update({

where:{
id:otp.id
},

data:{
verified:true
}

})

return NextResponse.json({

ok:true,

user

})

}