import prisma from "@/shared/lib/prisma"
import Link from "next/link"

export default async function Page({
  params
}:{
  params:Promise<{id:string}>
}){

  const {id}=await params

  

  const lead=await prisma.lead.findUnique({
    where:{id}
  })

  if(!lead){
    return <div>Lead not found</div>
  }

  const customer = await prisma.customer.findFirst({
  where: {
    leadId: lead.id
  }
})
  return(
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-5xl font-bold">
            {lead.firstName} {lead.lastName}
          </h1>

          <p className="text-slate-500 mt-2">
            {lead.email}
          </p>
        </div>

        <div className="flex gap-3">

          <Link
            href={`/leads/edit/${lead.id}`}
            className="px-5 py-3 rounded-xl border"
          >
            Edit
          </Link>

          {customer ? (

  <Link
    href={`/customers/${customer.id}`}
    className="
    px-5
    py-3
    rounded-xl
    bg-blue-600
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
    rounded-xl
    bg-green-600
    text-white
    "
  >
    Convert Customer
  </Link>

)}
<Link
  href={`/leads/${lead.id}/notes`}
  className="
  px-4
  py-2
  border
  rounded-xl
  "
>
  Notes
</Link>
        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-3xl border p-6">

          <h2 className="font-bold mb-4">
            Lead Profile
          </h2>

          <div className="space-y-2">

            <p>{lead.phone}</p>
            <p>{lead.email}</p>
           <p
  className="
  inline-flex
  px-3
  py-1
  rounded-full
  bg-green-100
  text-green-700
  text-sm
  "
>
  Converted To Customer
</p>

          </div>

        </div>

        <div className="md:col-span-2 bg-white rounded-3xl border p-6">

          <h2 className="font-bold mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-4">


<Link
      href={`/jobs/create?leadId=${lead.id}`}
      className="
      border
      rounded-xl
      p-4
      text-center
      hover:bg-slate-50
      "
    >
      Create Job
    </Link>


  <Link
    href={`/calendar`}
    className="border rounded-xl p-4 text-center"
  >
    Schedule
  </Link>

  <Link
    href={`/messages`}
    className="border rounded-xl p-4 text-center"
  >
    Message
  </Link>

</div>

        </div>

      </div>

    </div>
  )
}