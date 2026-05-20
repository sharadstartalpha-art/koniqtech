import { NextResponse } from "next/server"
import prisma from "@/shared/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(
req:Request
){

try{

const body=await req.json()

const {

email,
password

}=body

const user=

await prisma.user.findUnique({

where:{
email
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
status:404
}

)

}

const valid=

await bcrypt.compare(

password,

user.passwordHash

)

if(!valid){

return NextResponse.json(

{
error:"Invalid password"
},

{
status:401
}

)

}

const token=

jwt.sign(

{

id:user.id,

email:user.email,

role:user.role,

orgId:user.orgId

},

process.env.JWT_SECRET!,

{

expiresIn:"7d"

}

)

const response=

NextResponse.json({

ok:true,

token,

user

})

response.cookies.set(

"token",

token,

{

httpOnly:true,

sameSite:"lax",

secure:true,

path:"/"

}

)

return response

}

catch(error){

console.log(error)

return NextResponse.json(

{
error:"Login failed"
},

{
status:500
}

)

}

}