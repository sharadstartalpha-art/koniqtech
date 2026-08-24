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

  const opportunities =
    await prisma.opportunity.findMany({

      where: {
        orgId
      }

    })

  const total =
    opportunities.length

  const won =
    opportunities.filter(
      x => x.stage === "won"
    )

  const lost =
    opportunities.filter(
      x => x.stage === "lost"
    )

  const open =
    opportunities.filter(
      x =>
        x.stage !== "won" &&
        x.stage !== "lost"
    )

  const totalValue =
    opportunities.reduce(

      (sum, x) =>

        sum + (x.value || 0),

      0

    )

  const wonValue =
    won.reduce(

      (sum, x) =>

        sum + (x.value || 0),

      0

    )

  const avgDeal =

    total > 0
      ? totalValue / total
      : 0

  const conversion =

    total > 0

      ? (
          won.length /
          total
        ) * 100

      : 0

  const stageStats = [

    "new",

    "contacted",

    "estimate",

    "won",

    "lost"

  ].map(stage => ({

    stage,

    count:

      opportunities.filter(

        x =>

          x.stage === stage

      ).length

  }))

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Pipeline Reports
        </h1>

        <p className="text-slate-500 mt-2">
          Sales performance and opportunity analytics.
        </p>

      </div>

      {/* Summary */}

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-sm text-slate-500">
            Opportunities
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {total}
          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-sm text-slate-500">
            Pipeline Value
          </p>

          <h2 className="text-3xl font-bold mt-2">

            ₹{totalValue.toLocaleString()}

          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-sm text-slate-500">
            Won Value
          </p>

          <h2 className="text-3xl font-bold mt-2 text-green-600">

            ₹{wonValue.toLocaleString()}

          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-sm text-slate-500">
            Win Rate
          </p>

          <h2 className="text-4xl font-bold mt-2">

            {conversion.toFixed(1)}%

          </h2>

        </div>

      </div>

      {/* KPI */}

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-slate-500">
            Open Opportunities
          </p>

          <h2 className="text-5xl font-bold mt-4 text-blue-600">

            {open.length}

          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-slate-500">
            Closed Won
          </p>

          <h2 className="text-5xl font-bold mt-4 text-green-600">

            {won.length}

          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-slate-500">
            Average Deal Size
          </p>

          <h2 className="text-4xl font-bold mt-4">

            ₹{avgDeal.toLocaleString(
              undefined,
              {
                maximumFractionDigits: 0
              }
            )}

          </h2>

        </div>

      </div>

      {/* Stage Breakdown */}

      <div className="bg-white border rounded-3xl overflow-hidden">

        <div className="border-b p-6">

          <h2 className="text-xl font-semibold">
            Opportunity Stage Breakdown
          </h2>

        </div>

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="text-left p-5">
                Stage
              </th>

              <th className="text-right p-5">
                Opportunities
              </th>

            </tr>

          </thead>

          <tbody>

            {stageStats.map(stage => (

              <tr
                key={stage.stage}
                className="border-t"
              >

                <td className="p-5 capitalize font-medium">

                  {stage.stage}

                </td>

                <td className="p-5 text-right font-semibold">

                  {stage.count}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Recent Deals */}

      <div className="bg-white border rounded-3xl overflow-hidden">

        <div className="border-b p-6">

          <h2 className="text-xl font-semibold">
            Largest Opportunities
          </h2>

        </div>

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="text-left p-5">
                Opportunity
              </th>

              <th className="text-left p-5">
                Stage
              </th>

              <th className="text-right p-5">
                Value
              </th>

            </tr>

          </thead>

          <tbody>

            {opportunities

              .sort(

                (a, b) =>

                  (b.value || 0) -

                  (a.value || 0)

              )

              .slice(0, 10)

              .map(item => (

                <tr
                  key={item.id}
                  className="border-t"
                >

                  <td className="p-5 font-medium">

                    {item.title}

                  </td>

                  <td className="p-5 capitalize">

                    {item.stage}

                  </td>

                  <td className="p-5 text-right">

                    ₹{(item.value || 0).toLocaleString()}

                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>

    </div>

  )

}