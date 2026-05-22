import prisma from "@/shared/lib/prisma"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(){

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

return NextResponse.json([])

}

const customers=

await prisma.customer.findMany({

where:{

orgId:user.orgId

}

})

return NextResponse.json(

customers

)

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


const customer=

await prisma.customer.create({

data:{

orgId:user.orgId,

firstName:

body.firstName ||

body.name ||

"Customer",

lastName:

body.lastName ||

"",

email:

body.email ||

null,

phone:

body.phone ||

null,

address:

body.address ||

null,

notes:

body.notes ||

null

}

})

return NextResponse.json(

customer

)

}