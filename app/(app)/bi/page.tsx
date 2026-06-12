import prisma from "@/shared/lib/prisma"
export const dynamic = "force-dynamic"

export default async function Page(){

const leads=
await prisma.lead.count()

const customers=
await prisma.customer.count()

const jobs=
await prisma.job.count()

return(

<div className="
space-y-8
">

<h1 className="
text-5xl
font-bold
">

BI Dashboard

</h1>

<div className="
grid
grid-cols-3
gap-6
">

<Card
title="Leads"
value={leads}
/>

<Card
title="Customers"
value={customers}
/>

<Card
title="Jobs"
value={jobs}
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

<div className="
bg-white
border
rounded-3xl
p-8
">

<p>

{title}

</p>

<h2 className="
text-5xl
font-bold
">

{value}

</h2>

</div>

)

}