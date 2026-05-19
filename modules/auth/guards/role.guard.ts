import {

verifyToken

}

from "@/modules/auth/jwt/jwt"

export async function roleGuard(

token:string,

roles:string[]

){

const user=

await verifyToken(

token

)

if(

!user ||

!roles.includes(

user.role

)

){

throw new Error(

"forbidden"

)

}

return user

}