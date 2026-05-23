import prisma from "@/shared/lib/prisma"

export default async function Page(){

const users=
await prisma.user.findMany({

take:20

})

return(

<div>

<h1>

Audit Logs

</h1>

{

users.map(u=>(

<div
key={u.id}
>

{u.email}

</div>

))

}

</div>

)

}