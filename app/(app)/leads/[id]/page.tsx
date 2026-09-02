import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import {
  canCreate,
  canEdit,
  canDelete,
} from "@/shared/lib/permissions";
import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function Page({
  params
}:{
  params:Promise<{id:string}>
}){

  const session = await auth()

if (!session?.user) {
  redirect("/login")
}



const permissions = (session.user as any).permissions ?? [];
const isOwner =
  session.user.organizationRole === "Owner";

const orgId = (session.user as any).orgId

if (!orgId) {
  redirect("/welcome")
}

  const {id}=await params

  
const lead = await prisma.lead.findFirst({
  where: {
    id,
    orgId
  },
  include: {
  assignedTo: true
}
})

  if (!lead) {
  notFound()
}

 const customer = await prisma.customer.findFirst({
  where: {
    leadId: lead.id,
    orgId
  }
})

const activities = await prisma.leadActivity.findMany({
  where: {
    leadId: lead.id,
  },
  orderBy: {
    createdAt: "desc",
  },
})
const leadAge =
  Math.floor(
    (Date.now() - lead.createdAt.getTime()) /
    (1000 * 60 * 60 * 24)
  )
  
return (
  <div className="space-y-8">

    {/* Header */}

    <div className="flex items-center justify-between">

      <div>

        <Link
          href="/leads"
          className="
          inline-flex
          items-center
          gap-2
          text-slate-500
          hover:text-orange-600
          mb-4
          "
        >
          ← Back to Leads
        </Link>

        <h1 className="
        text-3xl
        font-bold
        text-slate-900
        ">
          {lead.firstName} {lead.lastName}
        </h1>

        <div className="mt-2 space-y-1">

  <p className="text-slate-500">
    {lead.companyName || "No Company"}
  </p>

  <p className="text-slate-500">
    {lead.email || "-"}
  </p>

</div>

      </div>

      <div className="flex gap-3">
{canEdit(permissions, "Leads", isOwner) && (
        <Link
          href={`/leads/edit/${lead.id}`}
          className="
          px-5
          py-3
          rounded-2xl
          border
          bg-white
          hover:bg-slate-50
          "
        >
          Edit
        </Link>
)}

{canDelete(permissions, "Leads", isOwner) && (
<Link
  href={`/leads/${lead.id}/delete`}
  className="
  px-5
  py-3
  rounded-2xl
  border
  border-red-200
  text-red-600
  hover:bg-red-50
  "
>
  Delete
</Link>
)}

        {customer ? (

          <Link
            href={`/customers/${customer.id}`}
            className="
            px-5
            py-3
            rounded-2xl
            bg-orange-600
            hover:bg-orange-700
            text-white
            "
          >
            View Customer
          </Link>

        ) : (

          <Link
            href={`/leads/${lead.id}/convert`}
            className="
            px-5
            py-3
            rounded-2xl
            bg-green-600
            hover:bg-green-700
            text-white
            "
          >
            Convert Customer
          </Link>

        )}

        <Link
          href={`/leads/${lead.id}/notes`}
          className="
          px-5
          py-3
          rounded-2xl
          border
          bg-white
          hover:bg-slate-50
          "
        >
          Notes
        </Link>

      </div>

    </div>

    {/* Summary Cards */}

    <div className="grid md:grid-cols-3 gap-6">

      <div className="
      bg-white
      border
      rounded-3xl
      p-7
      shadow-sm
      ">

        <h2 className="
        text-lg
        font-semibold
        mb-5
        ">
          Lead Profile
        </h2>

<div>

  <p className="text-xs text-slate-500">
    Created
  </p>

  <p className="font-medium">
    {lead.createdAt.toLocaleDateString()}
  </p>

</div>

       <div className="space-y-4">

  <div>
    <p className="text-xs text-slate-500">
      Company
    </p>

    <p className="font-medium">
      {lead.companyName || "-"}
    </p>
  </div>

  <div>
    <p className="text-xs text-slate-500">
      Phone
    </p>

    <p className="font-medium">
      {lead.phone || "-"}
    </p>
  </div>

  <div>
    <p className="text-xs text-slate-500">
      Email
    </p>

    <p className="font-medium">
      {lead.email || "-"}
    </p>
  </div>

  <div>
    <p className="text-xs text-slate-500">
      Source
    </p>

    <p className="font-medium">
      {lead.source || "-"}
    </p>
  </div>

  <div>
    <p className="text-xs text-slate-500">
      Priority
    </p>

    <p className="font-medium">
      {lead.priority || "-"}
    </p>
  </div>

  <div>
    <p className="text-xs text-slate-500">
      Budget
    </p>

    <p className="font-medium">
      {lead.budget
        ? `₹${lead.budget.toLocaleString()}`
        : "-"
      }
    </p>
  </div>

  <div>
    <p className="text-xs text-slate-500">
      Lead Age
    </p>

    <p className="font-medium">
      {leadAge} days
    </p>
  </div>

  <div>
    <p className="text-xs text-slate-500">
      Status
    </p>

    <p className="font-medium capitalize">
     <span
  className="
  inline-flex
  rounded-full
  bg-blue-100
  px-3
  py-1
  text-blue-700
  text-sm
  font-medium
  capitalize
  "
>
  {lead.status}
</span>
    </p>
  </div>

  <div>
    <p className="text-xs text-slate-500">
      Assigned Rep
    </p>

    <p className="font-medium">
      {lead.assignedTo?.name || "-"}
    </p>
  </div>

<div>

  <p className="text-xs text-slate-500">
    Address
  </p>

  <p className="font-medium">
    {lead.address || "-"}
  </p>

</div>
</div>

      </div>

      <div className="
      md:col-span-2
      bg-white
      border
      rounded-3xl
      p-7
      shadow-sm
      ">

        <h2 className="
        text-lg
        font-semibold
        mb-5
        ">
          Quick Actions
        </h2>

        <div className="
        grid
        md:grid-cols-3
        gap-4
        ">

          <Link
            href={`/jobs/create?leadId=${lead.id}`}
            className="
            p-5
            rounded-2xl
            border
            hover:border-orange-300
            hover:bg-orange-50
            transition
            "
          >
            <div className="font-semibold">
              Create Job
            </div>

            <div className="
            text-sm
            text-slate-500
            mt-1
            ">
              Convert lead into active job
            </div>
          </Link>

          <Link
            href="/calendar"
            className="
            p-5
            rounded-2xl
            border
            hover:border-blue-300
            hover:bg-blue-50
            transition
            "
          >
            <div className="font-semibold">
              Schedule
            </div>

            <div className="
            text-sm
            text-slate-500
            mt-1
            ">
              Schedule visit or meeting
            </div>
          </Link>

          <Link
           href={`mailto:${lead.email}`}
            className="
            p-5
            rounded-2xl
            border
            hover:border-green-300
            hover:bg-green-50
            transition
            "
          >
            <div className="font-semibold">
              Message
            </div>

            <div className="
            text-sm
            text-slate-500
            mt-1
            ">
              Contact customer instantly
            </div>
          </Link>


          <Link
  href={`tel:${lead.phone}`}
  className="
  p-5
  rounded-2xl
  border
  hover:border-purple-300
  hover:bg-purple-50
  transition
  "
>

  <div className="font-semibold">
    Call Customer
  </div>

  <div className="text-sm text-slate-500 mt-1">
    Start phone call
  </div>

</Link>

        </div>

      </div>



<Link
href={`/leads/${lead.id}/notes`}
className="
p-5
rounded-2xl
border
hover:border-orange-300
hover:bg-orange-50
transition
"
>

<div className="font-semibold">
Lead Notes
</div>

<div className="text-sm text-slate-500 mt-1">
View all conversations
</div>

</Link>
    </div>


<div className="bg-white border rounded-3xl p-7 shadow-sm">

  <h2 className="text-lg font-semibold mb-6">
    Timeline
  </h2>

  {
    activities.length === 0 ? (

      <p className="text-slate-500">
        No activity recorded.
      </p>

    ) : (

      <div className="space-y-5">

        {activities.map(activity => (

          <div
            key={activity.id}
            className="border-l-2 border-orange-500 pl-5"
          >

            <div className="font-medium">
              {activity.title}
            </div>

            <div className="text-sm text-slate-500 mt-1">
              {activity.createdAt.toLocaleString()}
            </div>

          </div>

        ))}

      </div>

    )
  }

</div>

<div>

<p className="text-xs text-slate-500">
Lead ID
</p>

<p className="font-mono text-sm">
{lead.id}
</p>

</div>
  </div>
)

}