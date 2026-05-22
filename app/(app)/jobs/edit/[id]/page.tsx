import prisma from "@/shared/lib/prisma"

export default async function Page(
{
params
}:any
){

const job=

await prisma.job.findUnique({

where:{
id:params.id
}

})

return(

<div className="bg-white p-10 rounded-3xl">

<h1 className="text-4xl font-bold mb-8">

Edit Job

</h1>

<input
defaultValue={job?.title}
className="w-full border p-4 rounded-xl mb-4"
/>

<select
defaultValue={job?.status}
className="w-full border p-4 rounded-xl"
>

<option>Pending</option>

<option>Assigned</option>

<option>Completed</option>

</select>

</div>

)

}