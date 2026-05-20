import bcrypt from "bcryptjs"

import prisma from "@/shared/lib/prisma"

import { NextResponse }

from "next/server"

export async function POST(
req:Request
){

const body=

await req.json()

const user=

await prisma.user.findUnique({

where:{

email:body.email

},

include:{

organization:true

}

})

if(!user){

return NextResponse.json(

{
error:"User not found"
},

{
status:400
}

)

}

const valid=

await bcrypt.compare(

body.password,

user.passwordHash

)

if(!valid){

return NextResponse.json(

{
error:"Wrong password"
},

{
status:400
}

)

}

return NextResponse.json({

ok:true,

user

})

}