import prisma from "@/shared/lib/prisma"

export default async function Page(){

const techs=
await prisma.user.findMany({

where:{
role:"technician"
}

})

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Technician Tracking

</h1>

<div className="
grid
grid-cols-3
gap-6
">

{techs.map(t=>(

<div
key={t.id}
className="
bg-white
border
rounded-3xl
p-8
"
>

<h2 className="font-bold">

{t.name}

</h2>

<p>

Live Tracking

</p>

</div>

))}

</div>

</div>

)

}