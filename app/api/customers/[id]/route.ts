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

const customer=

await prisma.customer.update({

where:{

id

},

data:{

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

companyName:

body.companyName ||

null

}

})

return NextResponse.json(

customer

)

}

catch(error){

console.log(error)

return NextResponse.json(

{

success:false,

message:

"Customer update failed"

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

await prisma.customer.delete({

where:{

id

}

})

return NextResponse.json({

success:true

})

}

catch(error){

console.log(error)

return NextResponse.json(

{

success:false,

message:

"Customer delete failed"

},

{

status:500

}

)

}

}