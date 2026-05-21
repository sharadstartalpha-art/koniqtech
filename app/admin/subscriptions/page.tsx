import prisma from "@/shared/lib/prisma"

export default async function Page(){

const subs=

await prisma.subscription.findMany({

include:{

organization:true

}

})

return(

<div className="space-y-4">

{

subs.map(x=>(

<div

key={x.id}

className="bg-white p-6 rounded"

>

{x.organization.name}

-

{x.status}

</div>

))

}

</div>

)

}