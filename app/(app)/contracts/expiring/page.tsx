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

  const next30 =
    new Date()

  next30.setDate(
    today.getDate() + 30
  )

  const contracts =
    await prisma.contract.findMany({

      where: {

        orgId,

        endDate: {

          gte: today,

          lte: next30

        }

      },

      include: {

        customer: {

          select: {

            id: true,

            firstName: true,

            lastName: true,

            companyName: true

          }

        }

      },

      orderBy: {

        endDate: "asc"

      }

    })

  return (

    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-5xl font-bold">

          Expiring Contracts

        </h1>

        <p className="text-slate-500 mt-2">

          Contracts ending within the next 30 days.

        </p>

      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-slate-500 text-sm">

            Expiring Soon

          </p>

          <h2 className="text-4xl font-bold mt-2">

            {contracts.length}

          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-slate-500 text-sm">

            Date Range

          </p>

          <h2 className="text-xl font-bold mt-2">

            30 Days

          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-slate-500 text-sm">

            Today's Date

          </p>

          <h2 className="text-xl font-bold mt-2">

            {today.toLocaleDateString()}

          </h2>

        </div>

      </div>

      {/* Table */}

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">

        {contracts.length === 0 ? (

          <div className="py-20 text-center">

            <p className="text-slate-500">

              No contracts expiring soon.

            </p>

          </div>

        ) : (

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

                  Company

                </th>

                <th className="p-5">

                  End Date

                </th>

                <th className="p-5">

                  Days Left

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

              {contracts.map(contract => {

                const daysLeft =
                  Math.ceil(

                    (
                      contract.endDate!.getTime() -
                      today.getTime()

                    ) /

                    (1000 * 60 * 60 * 24)

                  )

                return (

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

                      {contract.customer.firstName}{" "}
                      {contract.customer.lastName}

                    </td>

                    <td className="p-5">

                      {contract.customer.companyName || "-"}

                    </td>

                    <td className="p-5">

                      {contract.endDate?.toLocaleDateString()}

                    </td>

                    <td className="p-5">

                      <span
                        className="
                        inline-flex
                        rounded-full
                        bg-red-100
                        text-red-700
                        px-3
                        py-1
                        text-sm
                        "
                      >

                        {daysLeft} days

                      </span>

                    </td>

                    <td className="p-5">

                      {contract.status}

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