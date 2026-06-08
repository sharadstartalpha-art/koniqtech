import prisma from "@/shared/lib/prisma"
import Link from "next/link"

const stages = [
  "new",
  "contacted",
  "estimate",
  "won",
  "lost"
]

export default async function PipelinePage() {

  const leads = await prisma.lead.findMany({

    where: {
      status: {
        not: "converted"
      }
    },

    orderBy: {
      createdAt: "desc"
    }

  })

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Sales Pipeline
          </h1>

          <p className="text-slate-500 mt-2">
            Track opportunities through your sales process
          </p>

        </div>

        <Link
          href="/leads/create"
          className="
          px-5
          py-3
          rounded-xl
          bg-blue-600
          text-white
          hover:bg-blue-700
          "
        >
          New Lead
        </Link>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {stages.map(stage => {

          const items = leads.filter(lead => {

            const status =
              (lead.status || "new")
                .toString()
                .toLowerCase()

            return status === stage

          })

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

              <div className="flex items-center justify-between mb-5">

                <h2 className="font-bold capitalize">
                  {stage}
                </h2>

                <span
                  className="
                  bg-slate-100
                  px-3
                  py-1
                  rounded-full
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
                    text-sm
                    text-slate-400
                    border
                    border-dashed
                    rounded-xl
                    p-4
                    text-center
                    "
                  >
                    No leads
                  </div>

                )}

                {items.map(lead => (

                  <Link
                    key={lead.id}
                    href={`/leads/${lead.id}`}
                    className="
                    block
                    border
                    rounded-2xl
                    p-4
                    hover:shadow-md
                    transition
                    "
                  >

                    <div className="font-semibold">

                      {lead.firstName} {lead.lastName}

                    </div>

                    <div className="text-sm text-slate-500 mt-1">

                      {lead.email}

                    </div>

                    <div className="text-sm text-slate-500">

                      {lead.phone}

                    </div>

                    <div className="mt-3">

                      <span
                        className="
                        text-xs
                        px-2
                        py-1
                        rounded-full
                        bg-blue-100
                        text-blue-700
                        "
                      >
                        {lead.status || "new"}
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