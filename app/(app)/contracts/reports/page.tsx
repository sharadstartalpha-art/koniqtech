import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
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

  const now =
    new Date()

  const totalContracts =
    await prisma.contract.count({

      where: {
        orgId
      }

    })

  const activeContracts =
    await prisma.contract.count({

      where: {
        orgId,
        status: "active"
      }

    })

  const draftContracts =
    await prisma.contract.count({

      where: {
        orgId,
        status: "draft"
      }

    })

  const expiredContracts =
    await prisma.contract.count({

      where: {
        orgId,

        endDate: {
          lt: now
        }

      }

    })

  const expiringSoon =
    await prisma.contract.count({

      where: {

        orgId,

        endDate: {

          gte: now,

          lte: new Date(
            now.getTime() +
            30 * 24 * 60 * 60 * 1000
          )

        }

      }

    })

  const contracts =
    await prisma.contract.findMany({

      where: {
        orgId
      },

      select: {
        value: true
      }

    })

  const totalValue =
    contracts.reduce(

      (sum, contract) =>

        sum + (contract.value ?? 0),

      0

    )

  const averageValue =
    contracts.length
      ? totalValue / contracts.length
      : 0

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Contract Reports
        </h1>

        <p className="text-slate-500 mt-2">
          Overview of all customer contracts.
        </p>

      </div>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white border rounded-3xl p-7">

          <p className="text-slate-500">
            Total Contracts
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {totalContracts}
          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-7">

          <p className="text-slate-500">
            Active
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-2">
            {activeContracts}
          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-7">

          <p className="text-slate-500">
            Draft
          </p>

          <h2 className="text-4xl font-bold text-yellow-600 mt-2">
            {draftContracts}
          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-7">

          <p className="text-slate-500">
            Expired
          </p>

          <h2 className="text-4xl font-bold text-red-600 mt-2">
            {expiredContracts}
          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-7">

          <p className="text-slate-500">
            Expiring (30 Days)
          </p>

          <h2 className="text-4xl font-bold text-orange-600 mt-2">
            {expiringSoon}
          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-7">

          <p className="text-slate-500">
            Total Contract Value
          </p>

          <h2 className="text-4xl font-bold mt-2">
            ₹{totalValue.toLocaleString()}
          </h2>

        </div>

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <h2 className="text-xl font-semibold mb-6">
          Summary
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between">

            <span>
              Average Contract Value
            </span>

            <strong>
              ₹{averageValue.toLocaleString(undefined,{
                maximumFractionDigits:0
              })}
            </strong>

          </div>

          <div className="flex justify-between">

            <span>
              Active Contracts
            </span>

            <strong>
              {activeContracts}
            </strong>

          </div>

          <div className="flex justify-between">

            <span>
              Expired Contracts
            </span>

            <strong>
              {expiredContracts}
            </strong>

          </div>

          <div className="flex justify-between">

            <span>
              Renewal Due
            </span>

            <strong>
              {expiringSoon}
            </strong>

          </div>

        </div>

      </div>

    </div>

  )

}