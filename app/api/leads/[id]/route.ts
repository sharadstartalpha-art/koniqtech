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

const lead=

await prisma.lead.update({

where:{

id:params.id

},

data:{

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

export async function DELETE(

req:Request,

{

params

}:any

){

await prisma.lead.delete({

where:{

id:params.id

}

})

return NextResponse.json({

success:true

})

}