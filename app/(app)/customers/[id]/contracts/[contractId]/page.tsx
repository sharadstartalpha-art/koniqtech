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
    contractId:string
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

  const {
    id,
    contractId
  } = await params

  const contract =
    await prisma.contract.findFirst({

      where:{

        id:contractId,

        customerId:id,

        orgId

      },

      include:{

        customer:true

      }

    })

  if(!contract){
    notFound()
  }

  return(

    <div className="max-w-5xl mx-auto space-y-8">

      <div className="flex items-start justify-between">

        <div>

          <Link
            href={`/customers/${id}/contracts`}
            className="text-slate-500 hover:text-orange-600"
          >
            ← Back to Contracts
          </Link>

          <h1 className="text-4xl font-bold mt-4">

            {contract.title}

          </h1>

          <p className="text-slate-500 mt-2">

            Contract Details

          </p>

        </div>

        <Link
          href={`/customers/${id}/contracts/${contract.id}/edit`}
          className="
          bg-orange-600
          hover:bg-orange-700
          text-white
          px-6
          py-3
          rounded-xl
          "
        >
          Edit Contract
        </Link>

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <div className="grid md:grid-cols-2 gap-8">

          <div>

            <h3 className="text-sm text-slate-500">

              Contract Number

            </h3>

            <p className="font-semibold mt-1">

              {contract.contractNumber || "-"}

            </p>

          </div>

          <div>

            <h3 className="text-sm text-slate-500">

              Status

            </h3>

            <span
              className="
              inline-flex
              mt-2
              px-3
              py-1
              rounded-full
              bg-green-100
              text-green-700
              "
            >
              {contract.status}
            </span>

          </div>

          <div>

            <h3 className="text-sm text-slate-500">

              Customer

            </h3>

            <p className="font-semibold mt-1">

              {contract.customer.firstName} {contract.customer.lastName}

            </p>

          </div>

          <div>

            <h3 className="text-sm text-slate-500">

              Contract Type

            </h3>

            <p className="font-semibold mt-1">

              {contract.contractType || "-"}

            </p>

          </div>

          <div>

            <h3 className="text-sm text-slate-500">

              Contract Value

            </h3>

            <p className="font-semibold mt-1">

              {contract.value
                ? `$${contract.value.toLocaleString()}`
                : "-"}

            </p>

          </div>

          <div>

            <h3 className="text-sm text-slate-500">

              Created

            </h3>

            <p className="font-semibold mt-1">

              {contract.createdAt.toLocaleDateString()}

            </p>

          </div>

          <div>

            <h3 className="text-sm text-slate-500">

              Start Date

            </h3>

            <p className="font-semibold mt-1">

              {contract.startDate
                ? contract.startDate.toLocaleDateString()
                : "-"}

            </p>

          </div>

          <div>

            <h3 className="text-sm text-slate-500">

              End Date

            </h3>

            <p className="font-semibold mt-1">

              {contract.endDate
                ? contract.endDate.toLocaleDateString()
                : "-"}

            </p>

          </div>

          <div>

            <h3 className="text-sm text-slate-500">

              Renewal Date

            </h3>

            <p className="font-semibold mt-1">

              {contract.renewalDate
                ? contract.renewalDate.toLocaleDateString()
                : "-"}

            </p>

          </div>

        </div>

        <hr className="my-8"/>

        <div>

          <h3 className="text-sm text-slate-500 mb-3">

            Description

          </h3>

          <div className="whitespace-pre-wrap leading-7">

            {contract.description || "No description provided."}

          </div>

        </div>

      </div>

    </div>

  )

}