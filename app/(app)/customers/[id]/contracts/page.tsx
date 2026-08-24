import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"
import {
  redirect,
  notFound
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

  const customer =
    await prisma.customer.findFirst({

      where:{
        id,
        orgId
      },

      include:{

        contracts:{

          orderBy:{
            createdAt:"desc"
          }

        }

      }

    })

  if(!customer){
    notFound()
  }

  return(

    <div className="space-y-8">

      <div className="flex items-start justify-between">

        <div>

          <Link
            href={`/customers/${customer.id}`}
            className="text-slate-500 hover:text-orange-600"
          >
            ← Back to Customer
          </Link>

          <h1 className="text-5xl font-bold mt-4">
            Customer Contracts
          </h1>

          <p className="text-slate-500 mt-2">
            Manage agreements and service contracts.
          </p>

        </div>

        <Link
          href={`/customers/${customer.id}/contracts/create`}
          className="
          bg-orange-600
          hover:bg-orange-700
          text-white
          px-6
          py-3
          rounded-xl
          "
        >
          New Contract
        </Link>

      </div>

      <div className="bg-white border rounded-3xl overflow-hidden">

        {customer.contracts.length===0 ?(

          <div className="text-center py-20">

            <p className="text-slate-500">
              No contracts found.
            </p>

            <Link
              href={`/customers/${customer.id}/contracts/create`}
              className="
              inline-block
              mt-6
              bg-orange-600
              text-white
              px-6
              py-3
              rounded-xl
              "
            >
              Create First Contract
            </Link>

          </div>

        ):(

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr className="text-left">

                <th className="p-5">
                  Contract
                </th>

                <th className="p-5">
                  Type
                </th>

                <th className="p-5">
                  Start
                </th>

                <th className="p-5">
                  End
                </th>

                <th className="p-5">
                  Status
                </th>

                <th className="p-5 text-right">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {customer.contracts.map(contract=>(

                <tr
                  key={contract.id}
                  className="border-t"
                >

                  <td className="p-5 font-medium">

                    {contract.title}

                  </td>

                  <td className="p-5">

                   {contract.contractType ?? "-"}

                  </td>

                  <td className="p-5">

                    {contract.startDate
                      ? contract.startDate.toLocaleDateString()
                      : "-"}

                  </td>

                  <td className="p-5">

                    {contract.endDate
                      ? contract.endDate.toLocaleDateString()
                      : "-"}

                  </td>

                  <td className="p-5">

                    <span
                      className="
                      inline-flex
                      rounded-full
                      bg-green-100
                      text-green-700
                      px-3
                      py-1
                      text-sm
                      "
                    >
                      {contract.status}
                    </span>

                  </td>

                  <td className="p-5">

                    <div className="flex justify-end gap-5">

                      <Link
                        href={`/customers/${customer.id}/contracts/${contract.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>

                      <Link
                       href={`/customers/${customer.id}/contracts/${contract.id}/edit`}
                        className="text-orange-600 hover:underline"
                      >
                        Edit
                      </Link>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>

  )

}