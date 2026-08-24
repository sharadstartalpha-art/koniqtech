import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function QuotePdfPage({
  params,
}: PageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const { id } = await params

  const quote = await prisma.quote.findFirst({
    where: {
      id,
      orgId,
    },
    include: {
      customer: true,
      items: true,
    },
  })

  if (!quote) {
    notFound()
  }

  const subtotal = Number(quote.subtotal)
  const tax = Number(quote.tax)
  const total = Number(quote.total)

  return (
    <div className="bg-slate-100 min-h-screen py-10">

      <div
        className="
          max-w-5xl
          mx-auto
          bg-white
          rounded-3xl
          shadow-xl
          p-12
          print:shadow-none
          print:rounded-none
        "
      >

        <div className="flex justify-between items-start border-b pb-8">

          <div>

            <h1 className="text-5xl font-bold">
              QUOTE
            </h1>

            <p className="text-slate-500 mt-3">
              Quote #{quote.quoteNumber}
            </p>

            <p className="text-slate-500">
              Status:{" "}
              <span className="capitalize font-semibold">
                {quote.status}
              </span>
            </p>

          </div>

          <div className="text-right">

            <h2 className="text-3xl font-bold">
              Koniqtech
            </h2>

            <p className="text-slate-500">
              Field Service Platform
            </p>

            <p className="text-slate-500 mt-4">
              {quote.createdAt.toLocaleDateString()}
            </p>

            {quote.validUntil && (
              <p className="text-slate-500">
                Valid Until:{" "}
                {quote.validUntil.toLocaleDateString()}
              </p>
            )}

          </div>

        </div>

        <div className="grid grid-cols-2 gap-10 mt-10">

          <div>

            <h3 className="font-bold text-xl mb-4">
              Bill To
            </h3>

            <div className="space-y-2">

              <div className="font-semibold text-lg">
                {quote.customer.firstName}{" "}
                {quote.customer.lastName}
              </div>

              {quote.customer.companyName && (
                <div>
                  {quote.customer.companyName}
                </div>
              )}

              {quote.customer.email && (
                <div>
                  {quote.customer.email}
                </div>
              )}

              {quote.customer.phone && (
                <div>
                  {quote.customer.phone}
                </div>
              )}

              {quote.customer.address && (
                <div>
                  {quote.customer.address}
                </div>
              )}

              {quote.customer.city && (
                <div>
                  {quote.customer.city}
                </div>
              )}

              {quote.customer.state && (
                <div>
                  {quote.customer.state}
                </div>
              )}

              {quote.customer.zip && (
                <div>
                  {quote.customer.zip}
                </div>
              )}

            </div>

          </div>

        </div>

        <div className="mt-12 overflow-x-auto">

          <table className="w-full border">

            <thead>

              <tr className="bg-slate-100">

                <th className="border p-4 text-left">
                  Item
                </th>

                <th className="border p-4 text-center">
                  Qty
                </th>

                <th className="border p-4 text-right">
                  Price
                </th>

                <th className="border p-4 text-right">
                  Total
                </th>

              </tr>

            </thead>

            <tbody>

              {quote.items.map((item) => (

                <tr key={item.id}>

                  <td className="border p-4">
                    {item.itemName}
                  </td>

                  <td className="border p-4 text-center">
                    {item.qty}
                  </td>

                  <td className="border p-4 text-right">
                    $
                    {Number(item.price).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </td>

                  <td className="border p-4 text-right">
                    $
                    {Number(item.total).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        <div className="mt-10 flex justify-end">

          <div className="w-96 space-y-4">

            <div className="flex justify-between border-b pb-3">

              <span>
                Subtotal
              </span>

              <span className="font-semibold">
                $
                {subtotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>

            </div>

            <div className="flex justify-between border-b pb-3">

              <span>
                Tax
              </span>

              <span className="font-semibold">
                $
                {tax.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>

            </div>

            <div className="flex justify-between text-2xl font-bold">

              <span>
                Total
              </span>

              <span>
                $
                {total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>

            </div>

          </div>

        </div>

        <div className="mt-14 flex gap-4 print:hidden">

          <button
            onClick={() => window.print()}
            className="
              bg-orange-600
              hover:bg-orange-700
              text-white
              px-8
              py-4
              rounded-2xl
              font-semibold
            "
          >
            Print / Save PDF
          </button>

          <a
            href={`/quotes/${quote.id}`}
            className="
              border
              px-8
              py-4
              rounded-2xl
              hover:bg-slate-100
              font-semibold
            "
          >
            Back to Quote
          </a>

        </div>

      </div>

    </div>
  )
}