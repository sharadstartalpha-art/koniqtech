import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"

export default async function Page({
params
}:{
params:Promise<{id:string}>
}){

const { id }=await params

const tasks=
await prisma.jobTask.findMany({

where:{
jobId:id
}

})

async function createTask(
formData:FormData
){

"use server"

await prisma.jobTask.create({

data:{

jobId:id,

title:
String(
formData.get(
"title"
)
),

status:"pending"

}

})

revalidatePath(
`/jobs/${id}/tasks`
)

}

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Tasks

</h1>

<form
action={createTask}
className="flex gap-4"
>

<input

name="title"

placeholder="Task"

className="
flex-1
h-14
border
rounded-2xl
px-5
"

/>

<button className="
px-8
bg-blue-600
text-white
rounded-2xl
">

Add

</button>

</form>

<div className="space-y-4">

{

tasks.map(x=>(

<div

key={x.id}

className="
bg-white
border
rounded-3xl
p-6
"

>

{x.title}

</div>

))

}

</div>

</div>

)

}