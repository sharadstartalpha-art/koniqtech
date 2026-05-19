import prisma

from "@/shared/lib/prisma"

import {

NextRequest,

NextResponse

}

from "next/server"

export async function GET(

request:NextRequest,

context:{

params:Promise<{

id:string

}>

}

){

const {

id

}

=

await context.params

const lead=

await prisma.lead.findUnique({

where:{

id

}

})

return NextResponse.json(

lead

)

}

export async function DELETE(

request:NextRequest,

context:{

params:Promise<{

id:string

}>

}

){

const {

id

}

=

await context.params

await prisma.lead.delete({

where:{

id

}

})

return NextResponse.json({

ok:true

})

}