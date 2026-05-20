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

expiresAt:new Date(
Date.now()+1000*60*10
)

}

})

await resend.emails.send({

from:"KONIQ CRM <otp@koniqtech.com>",

to:body.email,

subject:"Verify your KONIQ CRM account",

html:`

<div style="
font-family:Arial;
padding:40px;
background:#f5f7fb;
">

<h1>

Welcome to KONIQ CRM

</h1>

<p>

Use OTP below:

</p>

<div style="
font-size:42px;
font-weight:bold;
padding:20px;
background:white;
border-radius:12px;
">

${code}

</div>

<p>

Expires in 10 minutes

</p>

</div>

`

})

return NextResponse.json({

ok:true

})

}