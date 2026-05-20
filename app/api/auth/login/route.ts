import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import  prisma  from "@/shared/lib/prisma"

export async function POST(req: NextRequest){

try{

const body=await req.json()

const email=body.email
const password=body.password

const user=await prisma.user.findUnique({

where:{
email
},

include:{
organization:true
}

})

if(!user){

return NextResponse.json(
{error:"Invalid credentials"},
{status:401}
)

}

const ok=await bcrypt.compare(
password,
user.passwordHash
)

if(!ok){

return NextResponse.json(
{error:"Invalid credentials"},
{status:401}
)

}

const res=NextResponse.json({

ok:true,

redirect:"/dashboard"

})

res.cookies.set(

"auth",

user.id,

{
httpOnly:true,
sameSite:"lax",
path:"/"
}

)

res.cookies.set(

"tenant",

user.orgId,

{
httpOnly:true,
sameSite:"lax",
path:"/"
}

)

return res

}

catch(e){

console.log(e)

return NextResponse.json(
{error:"Login failed"},
{status:500}
)

}

}