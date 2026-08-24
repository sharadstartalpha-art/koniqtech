import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"
import {
  notFound,
  redirect
} from "next/navigation"

export const dynamic = "force-dynamic"

export default async function Page({

  params

}:{

  params:Promise<{
    id:string
  }>

}){

  const session =
    await auth()

  if(!session?.user){
    redirect("/login")
  }

  const orgId =
    session.user.orgId

  if(!orgId){
    redirect("/welcome")
  }

  const { id } =
    await params

  const opportunity =
    await prisma.opportunity.findFirst({

      where:{
        id,
        orgId
      },

      include:{
        customer:true
      }

    })

  if(!opportunity){
    notFound()
  }

  const badgeColor={

    new:"bg-slate-100 text-slate-700",

    qualified:"bg-blue-100 text-blue-700",

    proposal:"bg-yellow-100 text-yellow-700",

    negotiation:"bg-purple-100 text-purple-700",

    won:"bg-green-100 text-green-700",

    lost:"bg-red-100 text-red-700"

  }[opportunity.stage] ??

  "bg-slate-100 text-slate-700"

  return(

    <div className="space-y-8">

      <div className="flex justify-between items-start">

        <div>

          <Link
            href="/pipeline"
            className="text-slate-500 hover:text-orange-600"
          >
            ← Back to Pipeline
          </Link>

          <h1 className="text-5xl font-bold mt-4">
            {opportunity.title}
          </h1>

          <p className="text-slate-500 mt-2">
            Opportunity Details
          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/pipeline/${opportunity.id}/edit`}
            className="
            bg-orange-600
            hover:bg-orange-700
            text-white
            px-6
            py-3
            rounded-xl
            "
          >
            Edit
          </Link>

          <Link
            href={`/pipeline/${opportunity.id}/delete`}
            className="
            bg-red-600
            hover:bg-red-700
            text-white
            px-6
            py-3
            rounded-xl
            "
          >
            Delete
          </Link>

        </div>

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <div className="grid grid-cols-2 gap-10">

          <div>

            <p className="text-slate-500">
              Customer
            </p>

            <p className="font-semibold text-xl mt-1">

              {opportunity.customer
                ? `${opportunity.customer.firstName} ${opportunity.customer.lastName ?? ""}`
                : "No Customer"}

            </p>

          </div>

          <div>

            <p className="text-slate-500">
              Stage
            </p>

            <span
              className={`
              inline-flex
              mt-2
              px-4
              py-2
              rounded-full
              text-sm
              ${badgeColor}
              `}
            >
              {opportunity.stage}
            </span>

          </div>

          <div>

            <p className="text-slate-500">
              Estimated Value
            </p>

            <p className="font-semibold text-2xl text-green-600 mt-1">

              $

              {(opportunity.value ?? 0).toLocaleString()}

            </p>

          </div>

          <div>

            <p className="text-slate-500">
              Probability
            </p>

            <p className="font-semibold text-xl mt-1">

              {opportunity.probability}%

            </p>

          </div>

          <div>

            <p className="text-slate-500">
              Expected Close
            </p>

            <p className="font-semibold mt-1">

              {opportunity.expectedCloseDate
                ? opportunity.expectedCloseDate.toLocaleDateString()
                : "-"}

            </p>

          </div>

          <div>

            <p className="text-slate-500">
              Created
            </p>

            <p className="font-semibold mt-1">

              {opportunity.createdAt.toLocaleDateString()}

            </p>

          </div>

        </div>

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <h2 className="text-2xl font-bold mb-5">
          Notes
        </h2>

        <div className="whitespace-pre-wrap text-slate-700">

          {opportunity.description || "No description available."}

        </div>

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <h2 className="text-2xl font-bold mb-6">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">

          <Link
            href={`/quotes/create?opportunityId=${opportunity.id}`}
            className="
            px-5
            py-3
            rounded-xl
            bg-blue-600
            text-white
            "
          >
            Create Quote
          </Link>

          {opportunity.customerId && (

            <Link
              href={`/customers/${opportunity.customerId}`}
              className="
              px-5
              py-3
              rounded-xl
              border
              "
            >
              View Customer
            </Link>

          )}

        </div>

      </div>

    </div>

  )

}