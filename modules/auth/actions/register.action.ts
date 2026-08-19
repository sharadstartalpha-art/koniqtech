"use server"

import bcrypt from "bcryptjs"

import prisma from "@/shared/lib/prisma"
import { createDefaultRoles } from "@/lib/create-default-roles"
import {
  CRMType,
  Industry,
  Prisma,
  SubscriptionPlan,
  SubscriptionStatus
} from "@prisma/client"



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

const organization=

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

industry: Industry.roofing,

plan: SubscriptionPlan.starter,

email:

data.email

}

})

await createDefaultRoles(organization.id);

await prisma.organizationSettings.create({

data:{

orgId:

organization.id,

timezone:

"America/Chicago",

currency:

"USD"

}

})

await prisma.subscription.create({

data:{

orgId:

organization.id,

provider:

"paypal",

externalId:

"SUB-"+

Date.now(),

plan: SubscriptionPlan.starter,

status: SubscriptionStatus.active,

amount: new Prisma.Decimal("199"),

currency:

"USD",

interval:

"month"

}

})

const ownerRole = await prisma.organizationRole.findFirst({
  where: {
    orgId: organization.id,
    name: "Owner",
  },
})

if (!ownerRole) {
  throw new Error("Owner role not found")
}

await prisma.user.create({
  data: {
    orgId: organization.id,
    name: data.name,
    email: data.email,
    passwordHash: hash,
    organizationRoleId: ownerRole.id,
  },
})

return{

success:true

}

}