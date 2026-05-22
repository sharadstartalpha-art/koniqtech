import prisma from "@/shared/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(

req:Request,

{

params

}:any

){

const body=

await req.json()

const job=

await prisma.job.update({

where:{

id:params.id

},

data:body

})

return NextResponse.json(

job

)

}

export async function DELETE(

req:Request,

{

params

}:any

){

await prisma.job.delete({

where:{

id:params.id

}

})

return NextResponse.json({

success:true

})

}