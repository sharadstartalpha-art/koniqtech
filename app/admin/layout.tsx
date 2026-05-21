import { cookies } from "next/headers"

import { redirect } from "next/navigation"

import prisma from "@/shared/lib/prisma"

export default async function AdminLayout({

children

}:{

children:React.ReactNode

}){

const token=

(await cookies())

.get("token")

if(!token){

redirect("/login")

}

const user=

await prisma.user.findUnique({

where:{

email:token.value

}

})

if(

!user||

user.role!=="super_admin"

){

redirect("/dashboard")

}

return children

}