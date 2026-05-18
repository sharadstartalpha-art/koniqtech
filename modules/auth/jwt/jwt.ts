import {

SignJWT,

jwtVerify,

JWTPayload

}

from "jose"

const secret=

new TextEncoder()

.encode(

process.env.JWT_SECRET!

)

export interface UserToken
extends JWTPayload{

id:string

orgId:string

role:string

}

export async function signToken(

payload:UserToken

){

return await new SignJWT(

payload

)

.setProtectedHeader({

alg:"HS256"

})

.setIssuedAt()

.setExpirationTime(

"7d"

)

.sign(secret)

}

export async function verifyToken(

token:string

):Promise<UserToken|null>{

try{

const verified=

await jwtVerify(

token,

secret

)

return verified.payload as UserToken

}catch{

return null

}

}