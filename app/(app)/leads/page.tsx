import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import {
  canCreate,
  canEdit,
  canDelete,
} from "@/shared/lib/permissions";

import DataTable from "@/components/DataTable"
import { redirect } from "next/navigation"

export const dynamic="force-dynamic"

export default async function Page(){

const session=
await auth()

if (!session?.user) {
  redirect("/login")
}



const orgId =
session.user.orgId

if (!orgId) {
  redirect("/welcome")
}

const permissions = (session.user as any).permissions ?? [];



const isOwner =
  session.user.organizationRole === "Owner";

const leads =
await prisma.lead.findMany({

  where:{
    orgId
  },

  select:{
    id:true,
    firstName:true,
    lastName:true,
    email:true,
    phone:true,
    status:true
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
  rowHref="/leads"

  canCreate={
    canCreate(permissions, "Leads") || isOwner
  }

  canEdit={
    canEdit(permissions, "Leads") || isOwner
  }

  canDelete={
    canDelete(permissions, "Leads") || isOwner
  }

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