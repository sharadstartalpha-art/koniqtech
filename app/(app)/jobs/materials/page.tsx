import prisma from "@/shared/lib/prisma"

export default async function Page(){

const rows=

await prisma.materialRequest.findMany()

return(

<div>

<h1 className="text-4xl font-semibold mb-6">

Materials

</h1>

{

rows.map(x=>(

<div
key={x.id}
className="bg-white border rounded-2xl p-5 mb-4"
>

{x.name}

Qty:

{Number(x.quantity)}

</div>

))

}

</div>

)

}