import prisma from "@/shared/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(

req: NextRequest,

{

params

}:{

params: Promise<{

id:string

}>

}

){

try{

const { id }=

await params

const body=

await req.json()

const lead=

await prisma.lead.update({

where:{

id

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

"website",

notes:

body.notes ||

null

}

})

return NextResponse.json(

lead

)

}

catch{

return NextResponse.json(

{

success:false,

message:

"Lead update failed"

},

{

status:500

}

)

}

}

export async function DELETE(

req: NextRequest,

{

params

}:{

params: Promise<{

id:string

}>

}

){

try{

const { id }=

await params

await prisma.lead.delete({

where:{

id

}

})

return NextResponse.json({

success:true

})

}

catch{

return NextResponse.json(

{

success:false,

message:

"Lead delete failed"

},

{

status:500

}

)

}

}