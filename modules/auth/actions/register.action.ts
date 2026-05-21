"use server"

import bcrypt from "bcryptjs"

import prisma from "@/shared/lib/prisma"

import { CRMType } from "@prisma/client"

function makeSlug(
text:string
){

return text

.toLowerCase()

.replace(/\s+/g,"-")

.replace(/[^a-z0-9-]/g,"")

}

export async function registerUser(

data:any

){

const existing=

await prisma.user.findUnique({

where:{

email:

data.email

}

})

if(existing){

throw new Error(

"User already exists"

)

}

const hash=

await bcrypt.hash(

data.password,

10

)

const org=

await prisma.organization.create({

data:{

name:

data.company,

slug:

makeSlug(

data.company

)+

"-"+

Date.now(),

crmType:

data.crmType ||

CRMType.roofing,

industry:

"roofing",

plan:

"pro",

email:

data.email

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

status:

"active",

amount:

199,

currency:

"USD",

interval:

"month"

}

})

await prisma.user.create({

data:{

orgId:

org.id,

name:

data.name,

email:

data.email,

passwordHash:

hash,

role:

"owner"

}

})

return{

success:true

}

}