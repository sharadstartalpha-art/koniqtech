import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

import prisma from "@/shared/lib/prisma"

import bcrypt from "bcryptjs"

export const {

handlers,
auth,
signIn,
signOut

}=NextAuth({

secret:
process.env.AUTH_SECRET,

trustHost:true,

session:{
strategy:"jwt"
},

providers:[

Credentials({

credentials:{

email:{},
password:{}

},

async authorize(credentials){

if(

!credentials?.email ||

!credentials?.password

){

return null

}

const user=

await prisma.user.findUnique({

where:{

email:String(
credentials.email
)

},

include:{

organization:true

}

})

if(!user){

return null

}

const ok=

await bcrypt.compare(

String(
credentials.password
),

user.passwordHash

)

if(!ok){

return null

}

return{

id:user.id,

email:user.email,

name:user.name,

role:user.role,

orgId:user.orgId

}

}

})

],

callbacks:{

async jwt({

token,
user

}){

if(user){

token.id=
(user as any).id

token.role=
(user as any).role

token.orgId=
(user as any).orgId

}

return token

},

async session({

session,
token

}){

if(session.user){

(session.user as any).id=
token.id as string

(session.user as any).role=
token.role as string

(session.user as any).orgId=
token.orgId as string

}

return session

}

},

pages:{

signIn:"/login"

}

})