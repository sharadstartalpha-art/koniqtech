import prisma from "@/shared/lib/prisma"

export default async function Page(){

const rows=

await prisma.purchaseOrder.findMany()

return(

<div>

<h1 className="text-4xl font-semibold mb-6">

Purchase Orders

</h1>

{

rows.map(x=>(

<div
key={x.id}
className="bg-white border rounded-2xl p-5 mb-4"
>

{x.vendor}

${x.amount}

</div>

))

}

</div>

)

}