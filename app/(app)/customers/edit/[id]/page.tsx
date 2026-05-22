import prisma from "@/shared/lib/prisma"

export default async function Page(
{
params
}:any
){

const customer=

await prisma.customer.findUnique({

where:{
id:params.id
}

})

return(

<div className="bg-white p-10 rounded-3xl">

<h1 className="text-4xl font-bold mb-8">

Edit Customer

</h1>

<input
defaultValue={
customer?.firstName || ""
}
/>

<input
defaultValue={
customer?.email || ""
}
/>

<input
defaultValue={
customer?.phone || ""
}
/>

<textarea
defaultValue={
customer?.address || ""
}
/>

</div>

)

}