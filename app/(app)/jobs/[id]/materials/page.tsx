import prisma from "@/shared/lib/prisma"

export default async function Page({
params
}:any){

const { id }=
await params

const rows=
await prisma.materialRequest.findMany({

where:{
jobId:id
}

})

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Materials

</h1>

{

rows.map(x=>(

<div
key={x.id}
className="
bg-white
border
rounded-3xl
p-5
mb-4
"
>

{x.name}

</div>

))

}

</div>

)

}