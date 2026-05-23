import prisma from "@/shared/lib/prisma"

export default async function Page({
params
}:any){

const { id }=
await params

const row=
await prisma.closeoutPackage.findFirst({

where:{
jobId:id
}

})

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Closeout

</h1>

<div className="
bg-white
border
rounded-3xl
p-8
">

{

row?.notes ||

"No closeout"

}

</div>

</div>

)

}