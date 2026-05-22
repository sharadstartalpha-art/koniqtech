import prisma from "@/shared/lib/prisma"

export const dynamic = "force-dynamic"

export default async function Page(
{
params
}:{
params:Promise<{id:string}>
}
){

const { id } = await params

const customer=

await prisma.customer.findUnique({

where:{
id
}

})

if(!customer){

return(

<div className="p-10">

Customer not found

</div>

)

}

return(

<div className="max-w-3xl mx-auto">

<div className="bg-white p-8 rounded-3xl border">

<h1 className="text-3xl font-bold mb-8">

Edit Customer

</h1>

<form

action={`/api/customers/${customer.id}`}

method="POST"

className="space-y-4"

>

<input

name="firstName"

defaultValue={

customer.firstName ?? ""

}

placeholder="First Name"

className="w-full border rounded-xl p-4"

/>

<input

name="lastName"

defaultValue={

customer.lastName ?? ""

}

placeholder="Last Name"

className="w-full border rounded-xl p-4"

/>

<input

name="email"

defaultValue={

customer.email ?? ""

}

placeholder="Email"

className="w-full border rounded-xl p-4"

/>

<input

name="phone"

defaultValue={

customer.phone ?? ""

}

placeholder="Phone"

className="w-full border rounded-xl p-4"

/>

<input

name="companyName"

defaultValue={

customer.companyName ?? ""

}

placeholder="Company"

className="w-full border rounded-xl p-4"

/>

<button

className="bg-green-600 text-white px-6 py-3 rounded-xl"

>

Save Customer

</button>

</form>

</div>

</div>

)

}