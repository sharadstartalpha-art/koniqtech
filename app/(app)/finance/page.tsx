import prisma from "@/shared/lib/prisma"

export default async function Page(){

const invoices=
await prisma.invoice.findMany()

const total=
invoices.reduce(

(a,b)=>

a+
Number(
b.amount
),

0

)

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Finance

</h1>

<div className="
bg-white
rounded-3xl
border
p-8
">

Revenue:

${total}

</div>

</div>

)

}