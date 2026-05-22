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

const customer=

await prisma.customer.update({

where:{

id:params.id

},

data:body

})

return NextResponse.json(

customer

)

}

export async function DELETE(

req:Request,

{

params

}:any

){

await prisma.customer.delete({

where:{

id:params.id

}

})

return NextResponse.json({

success:true

})

}