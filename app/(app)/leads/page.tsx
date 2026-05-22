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

const leads=

await prisma.lead.findMany({

where:{
orgId
},

orderBy:{
createdAt:"desc"
}

})

return(

<DataTable

title="Leads"

buttonLabel="New Lead"

buttonHref="/leads/create"

editPath="/leads/edit"

onDeletePath="/api/leads"

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

},

{

key:"status",

label:"Status"

}

]}

rows={

leads.map(

x=>({

id:x.id,

name:

`${x.firstName}

${x.lastName}`,

email:x.email,

phone:x.phone,

status:x.status

})

)

}

/>

)

}