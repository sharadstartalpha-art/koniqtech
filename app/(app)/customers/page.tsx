import prisma from "@/shared/lib/prisma"

import { auth } from "@/auth"

import DataTable from "@/components/DataTable"

export const dynamic="force-dynamic"

export default async function Page(){

const session=
await auth()

const orgId=

(session?.user as any)
?.orgId

const customers=

await prisma.customer.findMany({

where:{
orgId
}

})

return(

<DataTable

title="Customers"

buttonLabel="Add Customer"

buttonHref="/customers/create"

editPath="/customers/edit"

onDeletePath="/api/customers"

columns={[

{

key:"name",

label:"Name"

},

{

key:"email",

label:"Email"

},

{

key:"phone",

label:"Phone"

}

]}

rows={

customers.map(

x=>({

id:x.id,

name:

`${x.firstName}

${x.lastName}`,

email:x.email,

phone:x.phone

})

)

}

/>

)

}