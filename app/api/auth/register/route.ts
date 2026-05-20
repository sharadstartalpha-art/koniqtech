import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

import prisma from "@/shared/lib/prisma"

export async function POST(
req: Request
){

try{

const body=

await req.json()

const {

name,
email,
password,
company,
otp

}=body

const existing=

await prisma.user.findUnique({

where:{
email
}

})

if(existing){

return NextResponse.json(

{
error:"User already exists"
},

{
status:400}

)

}

const otpRecord=

await prisma.otpCode.findFirst({

where:{

email,

code:otp,

verified:false,

expiresAt:{
gt:new Date()
}

},

orderBy:{
createdAt:"desc"
}

})

if(!otpRecord){

return NextResponse.json(

{
error:"OTP invalid"
},

{
status:400
}

)

}

const passwordHash=

await bcrypt.hash(
password,
10
)

const user=

await prisma.user.create({

data:{

name,

email,

organization:company,

passwordHash,

role:"owner"

}

})

await prisma.otpCode.update({

where:{

id:otpRecord.id

},

data:{

verified:true

}

})

return NextResponse.json({

ok:true,

user

})

}

catch(err){

console.error(err)

return NextResponse.json(

{
error:"register failed"
},

{
status:500
}

)

}

}