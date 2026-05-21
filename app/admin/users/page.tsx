import prisma from "@/shared/lib/prisma"

export default async function UsersPage(){

const users=

await prisma.user.findMany({

include:{

organization:true

}

})

return(

<div className="space-y-4">

{

users.map(user=>(

<div

key={user.id}

className="bg-white p-6 rounded"

>

{user.email}

-

{user.role}

-

{user.organization?.name}

</div>

))

}

</div>

)

}