import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"

export default async function Page({
params
}:any){

const { id }=
await params

const rows=
await prisma.jobMilestone.findMany({

where:{
jobId:id
}

})

async function create(
formData:FormData
){

"use server"

await prisma.jobMilestone.create({

data:{

jobId:id,

title:
String(
formData.get(
"title"
)
)

}

})

revalidatePath(
`/jobs/${id}/milestones`
)

}

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Milestones

</h1>

<form
  action={create}
  className="flex gap-4"
>
  <input
    name="title"
    placeholder="Milestone title"
    className="
    flex-1
    h-14
    border
    rounded-2xl
    px-5
    "
  />

  <button
    type="submit"
    className="
    px-8
    bg-blue-600
    text-white
    rounded-2xl
    "
  >
    Add
  </button>
</form>

{

rows.map(x=>(

<div
key={x.id}
className="
bg-white
border
rounded-2xl
p-5
"
>

{x.title}

</div>

))

}

</div>

)

}