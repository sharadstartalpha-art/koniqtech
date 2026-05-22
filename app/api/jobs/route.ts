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

const jobs=

await prisma.job.findMany({

where:{

orgId:user?.orgId

}

})

return NextResponse.json(

jobs

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


const job=

await prisma.job.create({

data:{

orgId:user.orgId,

customerId:

body.customerId,

title:

body.title ||

"Job",

status:

body.status ||

"scheduled"

}

})

return NextResponse.json(

job

)

}