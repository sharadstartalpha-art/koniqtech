import prisma from "@/shared/lib/prisma"

import {
NextRequest,
NextResponse
}

from "next/server"

export async function PUT(

req:NextRequest

){

const body=
await req.json()

const row=

await prisma.job.update({

where:{

id:
String(
body.jobId
)

},

data:{

technicianId:

String(
body.techId
)

}

})

return NextResponse.json(

row

)

}