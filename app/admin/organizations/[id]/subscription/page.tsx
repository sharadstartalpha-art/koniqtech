import prisma from "@/shared/lib/prisma"

export const dynamic="force-dynamic"

export default async function Page({

params

}:any){

const subs=

await prisma.subscription.findMany({

where:{

orgId:params.id

}

})

return(

<div className="space-y-8">

<h1 className="text-4xl font-bold">

Organization Subscription

</h1>

<div className="bg-white rounded-3xl border p-8">

{

subs.map(s=>(

<div

key={s.id}

className="border rounded-xl p-5 mb-4"

>

<p>

Plan:

{s.plan}

</p>

<p>

Status:

{s.status}

</p>

<p>

Amount:

${s.amount.toFixed(2)}

</p>

<p>

Provider:

{s.provider}

</p>

</div>

))

}

</div>

</div>

)

}