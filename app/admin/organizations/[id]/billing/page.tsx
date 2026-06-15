import prisma from "@/shared/lib/prisma"

export const dynamic="force-dynamic"

export default async function Page({

params

}:any){

const invoices=

await prisma.invoice.findMany({

where:{

orgId:params.id

}

})

return(

<div className="space-y-8">

<h1 className="text-4xl font-bold">

Billing

</h1>

{

invoices.map(i=>(

<div

key={i.id}

className="bg-white border rounded-2xl p-6"

>

<p>

Customer:

{i.customerId}

</p>

<p>

Amount:

${Number(i.total)}

</p>

<p>

Status:

{i.status}

</p>

</div>

))

}

</div>

)

}