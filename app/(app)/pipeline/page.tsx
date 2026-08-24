import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

const stages = [
  "new",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost"
]

export default async function PipelinePage() {

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const opportunities =
    await prisma.opportunity.findMany({

      where: {
        orgId
      },

      include: {
        customer: true
      },

      orderBy: {
        createdAt: "desc"
      }

    })

  const pipelineValue =
    opportunities.reduce(
      (sum, item) => sum + (item.value ?? 0),
      0
    )

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Sales Pipeline
          </h1>

          <p className="text-slate-500 mt-2">
            Track sales opportunities through every stage.
          </p>

        </div>

        <Link
          href="/pipeline/create"
          className="
          bg-orange-600
          hover:bg-orange-700
          text-white
          px-6
          py-3
          rounded-xl
          "
        >
          New Opportunity
        </Link>

      </div>

      <div className="bg-white border rounded-3xl p-6">

        <div className="grid grid-cols-4 gap-6">

          <div>

            <p className="text-slate-500 text-sm">
              Opportunities
            </p>

            <h2 className="text-3xl font-bold">
              {opportunities.length}
            </h2>

          </div>

          <div>

            <p className="text-slate-500 text-sm">
              Pipeline Value
            </p>

            <h2 className="text-3xl font-bold text-green-600">
              ${pipelineValue.toLocaleString()}
            </h2>

          </div>

          <div>

            <p className="text-slate-500 text-sm">
              Won
            </p>

            <h2 className="text-3xl font-bold">
              {
                opportunities.filter(
                  o => o.stage === "won"
                ).length
              }
            </h2>

          </div>

          <div>

            <p className="text-slate-500 text-sm">
              Lost
            </p>

            <h2 className="text-3xl font-bold">
              {
                opportunities.filter(
                  o => o.stage === "lost"
                ).length
              }
            </h2>

          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">

        {stages.map(stage => {

          const items =
            opportunities.filter(
              o => (o.stage ?? "new") === stage
            )

          return (

            <div
              key={stage}
              className="
              bg-white
              border
              rounded-3xl
              p-5
              min-h-[650px]
              "
            >

              <div className="flex justify-between items-center mb-5">

                <h2 className="font-bold capitalize">
                  {stage}
                </h2>

                <span
                  className="
                  bg-slate-100
                  rounded-full
                  px-3
                  py-1
                  text-sm
                  "
                >
                  {items.length}
                </span>

              </div>

              <div className="space-y-4">

                {items.length === 0 && (

                  <div
                    className="
                    border
                    border-dashed
                    rounded-xl
                    p-4
                    text-center
                    text-slate-400
                    text-sm
                    "
                  >
                    No Opportunities
                  </div>

                )}

                {items.map(opportunity => (

                  <Link
                    key={opportunity.id}
                    href={`/pipeline/${opportunity.id}`}
                    className="
                    block
                    border
                    rounded-2xl
                    p-4
                    hover:shadow-lg
                    transition
                    "
                  >

                    <div className="font-semibold text-lg">
                      {opportunity.title}
                    </div>

                    <div className="text-sm text-slate-500 mt-1">
                      {opportunity.customer
                        ? `${opportunity.customer.firstName} ${opportunity.customer.lastName ?? ""}`
                        : "No Customer"}
                    </div>

                    <div className="mt-3 font-bold text-green-600">
                      $
                      {(opportunity.value ?? 0).toLocaleString()}
                    </div>

                    <div className="text-xs text-slate-400 mt-2">
                      Close:
                      {" "}
                      {opportunity.expectedCloseDate
                        ? opportunity.expectedCloseDate.toLocaleDateString()
                        : "-"}
                    </div>

                    <div className="mt-3">

                      <span
                        className="
                        inline-flex
                        bg-blue-100
                        text-blue-700
                        rounded-full
                        px-2
                        py-1
                        text-xs
                        "
                      >
                        {opportunity.stage}
                      </span>

                    </div>

                  </Link>

                ))}

              </div>

            </div>

          )

        })}

      </div>

    </div>

  )

}