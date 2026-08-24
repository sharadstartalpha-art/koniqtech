import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import { QuoteStatus } from "@prisma/client"

export const dynamic = "force-dynamic"

export default async function QuotesPage({
  searchParams
}: {
  searchParams: Promise<{
    search?: string
    status?: string
  }>
}) {

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const {
    search = "",
    status = ""
  } = await searchParams

  const quotes = await prisma.quote.findMany({

    where:{

      orgId,

      ...(status
        ? {  status: status as QuoteStatus }
        : {}),

      ...(search
  ? {
      OR: [
        {
          quoteNumber: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          customer: {
            firstName: {
              contains: search,
              mode: "insensitive"
            }
          }
        },
        {
          customer: {
            lastName: {
              contains: search,
              mode: "insensitive"
            }
          }
        },
        {
          customer: {
            companyName: {
              contains: search,
              mode: "insensitive"
            }
          }
        }
      ]
    }
  : {})
    },

    include:{
      customer:true
    },

    orderBy:{
      createdAt:"desc"
    }

  })

  const totalValue =
    quotes.reduce(
      (sum, quote) =>sum + Number(quote.total),
      0
    )

  return (

    <div className="space-y-8">

      <div className="flex items-start justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Quotes
          </h1>

          <p className="text-slate-500 mt-2">
            Manage customer quotations.
          </p>

        </div>

        <Link
          href="/quotes/create"
          className="
          bg-orange-600
          hover:bg-orange-700
          text-white
          px-6
          py-3
          rounded-xl
          "
        >
          New Quote
        </Link>

      </div>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-slate-500">
            Total Quotes
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {quotes.length}
          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-slate-500">
            Total Value
          </p>

          <h2 className="text-4xl font-bold mt-2">
            $
            {totalValue.toLocaleString()}
          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-slate-500">
            Accepted
          </p>

          <h2 className="text-4xl font-bold mt-2">

            {
          quotes.filter(
    q => q.status === QuoteStatus.approved
).length
            }

          </h2>

        </div>

      </div>

      <form
        className="flex gap-4"
      >

        <input
          name="search"
          defaultValue={search}
          placeholder="Search quote..."
          className="
          flex-1
          border
          rounded-xl
          px-5
          py-3
          "
        />

        <select
          name="status"
          defaultValue={status}
          className="
          border
          rounded-xl
          px-5
          "
        >

          <option value="">
            All Status
          </option>

          <option value="draft">
            Draft
          </option>

          <option value="sent">
            Sent
          </option>

         <option value="approved">
    Approved
</option>

<option value="expired">
    Expired
</option>

          <option value="rejected">
            Rejected
          </option>

        </select>

        <button
          className="
          bg-slate-900
          text-white
          px-6
          rounded-xl
          "
        >
          Search
        </button>

      </form>

      <div className="bg-white border rounded-3xl overflow-hidden">

        {quotes.length === 0 ? (

          <div className="py-24 text-center">

            <h2 className="text-2xl font-semibold">
              No quotes found
            </h2>

            <p className="text-slate-500 mt-3">
              Create your first customer quote.
            </p>

            <Link
              href="/quotes/create"
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
              Create Quote
            </Link>

          </div>

        ) : (

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr className="text-left">

                <th className="p-5">
                  Quote
                </th>

                <th className="p-5">
                  Customer
                </th>

                <th className="p-5">
                  Status
                </th>

                <th className="p-5">
                  Value
                </th>

                <th className="p-5">
                  Created
                </th>

                <th className="p-5 text-right">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {quotes.map((quote)=>(

                <tr
                  key={quote.id}
                  className="border-t"
                >

                  <td className="p-5 font-medium">

                    {quote.quoteNumber}

                  </td>

                  <td className="p-5">

                    {quote.customer?.companyName ||
                     `${quote.customer?.firstName ?? ""} ${quote.customer?.lastName ?? ""}`}

                  </td>

                  <td className="p-5">

                    <span
                      className="
                      px-3
                      py-1
                      rounded-full
                      bg-blue-100
                      text-blue-700
                      text-sm
                      "
                    >
                      {quote.status}
                    </span>

                  </td>

                  <td className="p-5">

                    $

                    {(Number(quote.total).toLocaleString())}

                  </td>

                  <td className="p-5">

                    {quote.createdAt
                      .toLocaleDateString()}

                  </td>

                  <td className="p-5">

                    <div className="flex justify-end gap-5">

                      <Link
                        href={`/quotes/${quote.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>

                      <Link
                        href={`/quotes/${quote.id}/edit`}
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