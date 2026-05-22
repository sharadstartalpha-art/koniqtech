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

session:{
strategy:"jwt"
},

providers:[

Credentials({

name:"credentials",

credentials:{

email:{
label:"Email",
type:"email"
},

password:{
label:"Password",
type:"password"
}

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
}

})

if(
!user
){

return null

}

const valid=
await bcrypt.compare(

String(
credentials.password
),

user.passwordHash

)

if(!valid){

return null

}

return{

id:user.id,

name:user.name,

email:user.email,

image:user.avatar,

orgId:user.orgId,

role:user.role

}

}

})

],

pages:{

signIn:"/login"

},

callbacks:{

async jwt({token,user}){

if(user){

(token as any).id=
(user as any).id

(token as any).orgId=
(user as any).orgId

(token as any).role=
(user as any).role

}

return token

},

async session({

session,
token

}){

if(session.user){

(session.user as any).id=
(token as any).id

(session.user as any).orgId=
(token as any).orgId

(session.user as any).role=
(token as any).role

}

return session

}

},

secret:
process.env.AUTH_SECRET

})