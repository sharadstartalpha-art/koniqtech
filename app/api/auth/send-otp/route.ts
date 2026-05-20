import { NextResponse } from "next/server"

import prisma from "@/shared/lib/prisma"

import { resend }

from "@/shared/lib/resend"

export async function POST(

req:Request

){

const body=

await req.json()

const code=

Math.floor(

100000+

Math.random()*900000

).toString()

await prisma.otpCode.create({

data:{

email:body.email,

code,

expiresAt:

new Date(

Date.now()+

1000*60*10

)

}

})

await resend.emails.send({

from:"otp@koniqtech.com",

to:body.email,

subject:"KONIQ OTP",

html:

`<h1>${code}</h1>`

})

return NextResponse.json({

ok:true

})

}