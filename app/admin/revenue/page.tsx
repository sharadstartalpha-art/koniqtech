import prisma from "@/shared/lib/prisma"

export const dynamic="force-dynamic"

export default async function Page(){

const invoices=

await prisma.invoice.findMany()

const total=

invoices.reduce(

(a,b)=>

a+

Number(b.amount),

0

)

return(

<div className="space-y-8">

<h1 className="text-4xl font-bold">

Revenue

</h1>

<div className="grid grid-cols-4 gap-6">

<Card
title="MRR"
value={`$${Math.floor(total/12)}`}
/>

<Card
title="ARR"
value={`$${total}`}
/>

<Card
title="Invoices"
value={invoices.length}
/>

<Card
title="Growth"
value="+20%"
/>

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