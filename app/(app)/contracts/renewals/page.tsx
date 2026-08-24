import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function Page() {

  const session =
    await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId =
    session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const today =
    new Date()

  const renewals =
    await prisma.contract.findMany({

      where:{

        orgId,

        renewalDate:{
          not:null
        }

      },

      include:{

        customer:{

          select:{

            id:true,

            firstName:true,

            lastName:true,

            companyName:true

          }

        }

      },

      orderBy:{

        renewalDate:"asc"

      }

    })

  return(

    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">

            Contract Renewals

          </h1>

          <p className="text-slate-500 mt-2">

            Review contracts that require renewal.

          </p>

        </div>

      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-slate-500 text-sm">

            Total Renewals

          </p>

          <h2 className="text-4xl font-bold mt-2">

            {renewals.length}

          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-slate-500 text-sm">

            Due This Month

          </p>

          <h2 className="text-4xl font-bold mt-2">

            {

              renewals.filter(x=>{

                if(!x.renewalDate) return false

                return (

                  x.renewalDate.getMonth()===today.getMonth() &&

                  x.renewalDate.getFullYear()===today.getFullYear()

                )

              }).length

            }

          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-slate-500 text-sm">

            Active Contracts

          </p>

          <h2 className="text-4xl font-bold mt-2">

            {

              renewals.filter(

                x=>x.status==="active"

              ).length

            }

          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-slate-500 text-sm">

            Expired

          </p>

          <h2 className="text-4xl font-bold mt-2">

            {

              renewals.filter(

                x=>x.status==="expired"

              ).length

            }

          </h2>

        </div>

      </div>

      {/* Table */}

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">

        {renewals.length===0 ?(

          <div className="py-20 text-center">

            <p className="text-slate-500">

              No contracts scheduled for renewal.

            </p>

          </div>

        ):(

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr className="text-left">

                <th className="p-5">

                  Contract

                </th>

                <th className="p-5">

                  Customer

                </th>

                <th className="p-5">

                  Renewal Date

                </th>

                <th className="p-5">

                  Status

                </th>

                <th className="p-5">

                  Days Left

                </th>

                <th className="p-5 text-right">

                  Actions

                </th>

              </tr>

            </thead>

            <tbody>

              {renewals.map(contract=>{

                const daysLeft =

                  contract.renewalDate

                  ? Math.ceil(

                      (

                        contract.renewalDate.getTime() -

                        today.getTime()

                      ) /

                      (1000*60*60*24)

                    )

                  : null

                return(

                  <tr
                    key={contract.id}
                    className="border-t hover:bg-slate-50"
                  >

                    <td className="p-5">

                      <div className="font-semibold">

                        {contract.title}

                      </div>

                      <div className="text-sm text-slate-500">

                        {contract.contractNumber || "-"}

                      </div>

                    </td>

                    <td className="p-5">

                      <Link
                        href={`/customers/${contract.customer.id}`}
                        className="text-blue-600 hover:underline"
                      >

                        {contract.customer.firstName}{" "}
                        {contract.customer.lastName}

                      </Link>

                    </td>

                    <td className="p-5">

                      {

                        contract.renewalDate?.toLocaleDateString()

                      }

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
                        capitalize
                        "
                      >

                        {contract.status}

                      </span>

                    </td>

                    <td className="p-5">

                      {

                        daysLeft===null

                        ? "-"

                        : daysLeft<0

                        ? "Expired"

                        : `${daysLeft} days`

                      }

                    </td>

                    <td className="p-5">

                      <div className="flex justify-end gap-5">

                        <Link
                          href={`/customers/${contract.customer.id}/contracts/${contract.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </Link>

                        <Link
                          href={`/customers/${contract.customer.id}/contracts/${contract.id}/edit`}
                          className="text-orange-600 hover:underline"
                        >
                          Renew
                        </Link>

                      </div>

                    </td>

                  </tr>

                )

              })}

            </tbody>

          </table>

        )}

      </div>

    </div>

  )

}