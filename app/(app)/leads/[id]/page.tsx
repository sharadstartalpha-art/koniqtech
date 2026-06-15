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

        <p className="
        text-slate-500
        mt-1
        ">
          {lead.email}
        </p>

      </div>

      <div className="flex gap-3">

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

        <div className="space-y-4">

          <div>

            <p className="text-xs text-slate-500">
              Phone
            </p>

            <p className="font-medium">
              {lead.phone}
            </p>

          </div>

          <div>

            <p className="text-xs text-slate-500">
              Email
            </p>

            <p className="font-medium">
              {lead.email}
            </p>

          </div>

          <div>

            {customer ? (

              <span
                className="
                inline-flex
                px-4
                py-2
                rounded-full
                bg-green-100
                text-green-700
                text-sm
                font-medium
                "
              >
                ✓ Converted To Customer
              </span>

            ) : (

              <span
                className="
                inline-flex
                px-4
                py-2
                rounded-full
                bg-orange-100
                text-orange-700
                text-sm
                font-medium
                "
              >
                Lead
              </span>

            )}

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
            href="/messages"
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

        </div>

      </div>

    </div>

  </div>
)

}