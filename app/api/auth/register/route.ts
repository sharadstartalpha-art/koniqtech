import bcrypt from "bcryptjs"

import prisma from "@/shared/lib/prisma"

import { NextResponse } from "next/server"

import { CRMType } from "@prisma/client"

function makeSlug(
text:string
){

return text

.toLowerCase()

.replace(/\s+/g,"-")

.replace(/[^a-z0-9-]/g,"")

}

export async function POST(

req:Request

){

try{

const body=

await req.json()

const {

name,

company,

email,

password,


otp,

crmType

}=body

const existingUser=

await prisma.user.findUnique({

where:{

email

}

})

if(existingUser){

return NextResponse.json(

{

error:

"User already exists"

},

{

status:400

}

)

}

const otpRecord=

await prisma.otpCode.findFirst({

where:{

email,

code:otp,

expiresAt:{

gt:new Date()

}

},

orderBy:{

createdAt:

"desc"

}

})

if(!otpRecord){

return NextResponse.json(

{

error:

"Invalid OTP"

},

{

status:400

}

)

}

const org=

await prisma.organization.create({

data:{

name:company,

slug:

makeSlug(

company

)+

"-"+

Date.now(),

crmType:

crmType ||

CRMType.roofing,

industry:

"roofing",

plan:

"pro"

}

})

const passwordHash=

await bcrypt.hash(

password,

10

)

const user=

await prisma.user.create({

data:{

name,

email,

passwordHash,

role:

"owner",

organization:{

connect:{

id:org.id

}

}

}

})

await prisma.organizationSettings.create({

data:{

orgId:

org.id,

timezone:

"America/Chicago",

currency:

"USD"

}

})

await prisma.subscription.create({

data:{

orgId:

org.id,

provider:

"paypal",

externalId:

"SUB-"+

Date.now(),

plan:

"pro",

status:"active",




amount:

199,

currency:

"USD",

interval:

"month"

}

})

await prisma.otpCode.update({

where:{

id:

otpRecord.id

},

data:{

verified:true

}

})

return NextResponse.json({

success:true,

redirect:

"/payment",

user

})

}

catch(error){

console.error(

error

)

return NextResponse.json(

{

error:

"Registration failed"

},

{

status:500

}

)

}

}