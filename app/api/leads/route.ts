import prisma from "@/shared/lib/prisma"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(){

const store=await cookies()

const email=

store.get("token")?.value

const user=

await prisma.user.findUnique({

where:{email}

})

if(!user){

return NextResponse.json([])

}

const leads=

await prisma.lead.findMany({

where:{

orgId:user.orgId

},

orderBy:{

createdAt:"desc"

}

})

return NextResponse.json(leads)

}

export async function POST(

req:Request

){

const body=

await req.json()

const store=

await cookies()

const email=

store.get(

"token"

)?.value

const user=

await prisma.user.findUnique({

where:{email}

})

if(!user){

return NextResponse.json(

{

error:"Unauthorized"

},

{

status:401

}

)

}

const lead=

await prisma.lead.create({

data:{

orgId:user.orgId,

firstName:

body.firstName ||

body.name ||

"Lead",

lastName:

body.lastName ||

"",

email:

body.email ||

null,

phone:

body.phone ||

null,

status:

body.status ||

"new",

source:

body.source ||

"website"

}

})

return NextResponse.json(

lead

)

}