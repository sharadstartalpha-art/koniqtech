import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function Page() {

  const session = await auth()

  const orgId = (session?.user as any)?.orgId

  if (!orgId) {
    return <div className="p-10">No organization found</div>
  }

  const leads = await prisma.lead.findMany({
    where: {
      orgId
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <div className="space-y-8">

      <div className="flex justify-between">

        <h1 className="text-5xl font-bold">
          Leads
        </h1>

        <Link
          href="/leads/create"
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          New Lead
        </Link>

      </div>

      <div className="bg-white rounded-3xl border overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>
              <th className="p-5 text-left">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            {leads.map(lead => (

              <tr
                key={lead.id}
                className="border-t"
              >

                <td className="p-5">
                  {lead.firstName} {lead.lastName}
                </td>

                <td>
                  {lead.email}
                </td>

                <td>
                  {lead.phone}
                </td>

                <td>
                  {lead.status}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  )

}