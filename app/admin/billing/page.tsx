import prisma from "@/shared/lib/prisma"

export const dynamic="force-dynamic"

export default async function Page(){

const invoices=

await prisma.invoice.findMany()

const revenue=

invoices.reduce(

(a,b)=>

a+

Number(b.total),

0

)

return(

<div className="space-y-8">

<h1 className="text-4xl font-bold">

Billing

</h1>

<div className="grid grid-cols-4 gap-6">

<Card
title="Revenue"
value={`$${revenue}`}
/>

<Card
title="Invoices"
value={invoices.length}
/>

</div>

<div className="bg-white rounded-3xl border p-8">

{

invoices.map(i=>(

<div

key={i.id}

className="border rounded-xl p-5 mb-4 flex justify-between"

>

<div>

<h2 className="font-bold">

Org:

{i.orgId}

</h2>

<p>

Customer:

{i.customerId}

</p>

</div>

<div>

${Number(i.total)}

</div>

</div>

))

}

</div>

</div>

)

}

function Card({

title,
value

}:any){

return(

<div className="bg-white p-8 rounded-3xl border">

<p>

{title}

</p>

<h2 className="text-4xl font-bold">

{value}

</h2>

</div>

)

}