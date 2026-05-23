import prisma from "@/shared/lib/prisma"

import {
revalidatePath
}

from "next/cache"

export default async function Page({

params

}:any){

const { id }=
await params

const job=

await prisma.job.findUnique({

where:{
id
}

})

async function save(

formData:FormData

){

"use server"

await prisma.job.update({

where:{
id
},

data:{

scheduledDate:

new Date(

String(

formData.get(
"date"
)

)

)

}

})

revalidatePath(

`/jobs/${id}/schedule`

)

}

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Schedule Job

</h1>

<form

action={save}

className="
bg-white
border
rounded-3xl
p-8
space-y-6
"

>

<input

type="datetime-local"

name="date"

className="
w-full
h-14
border
rounded-2xl
px-5
"

/>

<button

className="
px-8
py-4
bg-blue-600
text-white
rounded-2xl
"

>

Save Schedule

</button>

</form>

<div className="
bg-white
border
rounded-3xl
p-8
">

<p className="text-slate-500">

Current Schedule

</p>

<h2 className="
text-3xl
font-bold
mt-4
">

{

job?.scheduledDate

?

job
.scheduledDate
.toLocaleString()

:

"Not scheduled"

}

</h2>

</div>

</div>

)

}