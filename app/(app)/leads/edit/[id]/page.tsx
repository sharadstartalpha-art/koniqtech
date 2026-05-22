import prisma from "@/shared/lib/prisma"

export default async function Page(
{
params
}:any
){

const lead=

await prisma.lead.findUnique({

where:{
id:params.id
}

})

return(

<div className="max-w-3xl mx-auto">

<div className="bg-white p-10 rounded-3xl">

<h1 className="text-4xl font-bold mb-8">

Edit Lead

</h1>

<form
action={`/api/leads/${lead?.id}`}
>

<input

defaultValue={

lead?.firstName || ""

}

className="w-full border p-4 rounded-xl mb-4"

/>

<input

defaultValue={

lead?.email || ""

}

className="w-full border p-4 rounded-xl mb-4"

/>

<input

defaultValue={

lead?.phone || ""

}

className="w-full border p-4 rounded-xl mb-4"

/>

<select

defaultValue={

lead?.status || "new"

}

className="w-full border p-4 rounded-xl"

>

<option value="new">

New

</option>

<option value="contacted">

Contacted

</option>

<option value="won">

Won

</option>

<option value="lost">

Lost

</option>

</select>
<button className="bg-blue-600 text-white px-8 py-4 rounded-xl">

Save

</button>

</form>

</div>

</div>

)

}