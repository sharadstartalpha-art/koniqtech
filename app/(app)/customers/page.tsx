import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function Page() {

  const session = await auth()

  const orgId = (session?.user as any)?.orgId

  if (!orgId) {
    return <div>No organization found</div>
  }

  const customers = await prisma.customer.findMany({

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

          Customers

        </h1>

        <Link
          href="/customers/create"
          className="bg-black text-white px-6 py-3 rounded-xl"
        >

          Add Customer

        </Link>

      </div>

      <div className="bg-white border rounded-3xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-5 text-left">
                Name
              </th>

              <th>
                Email
              </th>

              <th>
                Phone
              </th>

            </tr>

          </thead>

          <tbody>

            {customers.map(customer => (

              <tr
                key={customer.id}
                className="border-t"
              >

                <td className="p-5">

                  {customer.firstName}
                  {" "}
                  {customer.lastName}

                </td>

                <td>

                  {customer.email}

                </td>

                <td>

                  {customer.phone}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  )

}