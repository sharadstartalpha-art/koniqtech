import prisma from "@/shared/lib/prisma"

import {
NextRequest,
NextResponse
}

from "next/server"

export async function GET(

req:NextRequest

){

const id=

req.nextUrl
.searchParams
.get(

"jobId"

)

const rows=

await prisma.job.findMany({

where:{
id:String(id)
},

include:{
customer:true
}

})

return NextResponse.json(

rows

)

}

export async function PUT(

req:NextRequest

){

const body=
await req.json()

const row=

await prisma.job.update({

where:{
id:body.id
},

data:{
status:body.status
}

})

return NextResponse.json(

row

)

}