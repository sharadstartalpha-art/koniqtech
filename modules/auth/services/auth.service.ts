import bcrypt from "bcryptjs"

import prisma from
"@/shared/lib/prisma"

export async function validateUser(

email:string,

password:string

){

const user=
await prisma.user.findUnique({

where:{
email
}

})

if(!user)
throw new Error(
"User not found"
)

const valid=
await bcrypt.compare(

password,

user.passwordHash

)

if(!valid)
throw new Error(
"Invalid password"
)

return user

}