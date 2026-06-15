import prisma from "@/shared/lib/prisma"
import Link from "next/link"

export default async function Page(){

  const jobs =
    await prisma.job.findMany({

      include:{
        customer:true,
        closeout:true
      },

      orderBy:{
        createdAt:"desc"
      }

    })

  const inProgress =
    jobs.filter(
      x => !x.closeout?.completed
    )

  const completed =
    jobs.filter(
      x => x.closeout?.completed
    )

  return(

    <div className="space-y-8">

      <h1 className="text-5xl font-bold">
        Billing
      </h1>

      {/* QUOTES */}

      <div className="bg-white border rounded-3xl overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold">
            Quotes
          </h2>

        </div>

        <table className="w-full">

          <thead>

            <tr className="bg-slate-50">

              <th className="p-4 text-left">
                Job
              </th>

              <th className="p-4 text-left">
                Customer
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {inProgress.map(job=>(

              <tr
                key={job.id}
                className="border-t"
              >

                <td className="p-4">
                  {job.title}
                </td>

                <td className="p-4">
                  {job.customer?.firstName}
                </td>

                <td className="p-4">
                  In Progress
                </td>

                <td className="p-4">

                  <Link
                    href={`/quotes/${job.id}`}
                    className="
                    px-4
                    py-2
                    bg-blue-600
                    text-white
                    rounded-xl
                    "
                  >
                    Send Quote
                  </Link>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* INVOICES */}

      <div className="bg-white border rounded-3xl overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold">
            Ready For Invoice
          </h2>

        </div>

        <table className="w-full">

          <thead>

            <tr className="bg-slate-50">

              <th className="p-4 text-left">
                Job
              </th>

              <th className="p-4 text-left">
                Customer
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {completed.map(job=>(

              <tr
                key={job.id}
                className="border-t"
              >

                <td className="p-4">
                  {job.title}
                </td>

                <td className="p-4">
                  {job.customer?.firstName}
                </td>

                <td className="p-4">
                  Completed
                </td>

                <td className="p-4">

                  <Link
                    href={`/billing/invoice/${job.id}`}
                    className="
                    px-4
                    py-2
                    bg-green-600
                    text-white
                    rounded-xl
                    "
                  >
                    Generate Invoice
                  </Link>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  )

}