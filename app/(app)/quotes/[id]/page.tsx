import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params

  const quote =
    await prisma.quote.findUnique({

      where: {
        id
      },

      include: {

        customer: true,

        items: true

      }

    })

  if (!quote) {
    notFound()
  }

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Quote
          </h1>

          <p className="text-slate-500 mt-2">

            {quote.quoteNumber}

          </p>

        </div>

        <Link
          href={`/jobs/create?quoteId=${quote.id}`}
          className="
          bg-green-600
          text-white
          px-5
          py-3
          rounded-xl
          "
        >
          Convert To Job
        </Link>


<Link
  href={`/quotes/${quote.id}/edit`}
  className="
  bg-blue-600
  text-white
  px-5
  py-3
  rounded-xl
  "
>
  Add Items
</Link>

      </div>

      <div className="bg-white rounded-3xl p-10 border">

        <div className="mb-8">

          <h2 className="text-2xl font-bold">

            {quote.customer.firstName}
            {" "}
            {quote.customer.lastName}

          </h2>

          <p className="text-slate-500">

            {quote.customer.email}

          </p>

        </div>

        <div className="space-y-3">

          {quote.items.map(item => (

            <div
              key={item.id}
              className="
              flex
              justify-between
              bg-slate-100
              rounded-xl
              p-4
              "
            >

              <div>

                <div className="font-medium">

                  {item.itemName}

                </div>

                <div className="text-sm text-slate-500">

                  Qty: {item.qty}

                </div>

              </div>

              <div>

                $
                {Number(item.total).toFixed(2)}

              </div>

            </div>

          ))}

          {quote.items.length === 0 && (

            <div className="text-slate-500">

              No quote items

            </div>

          )}

        </div>

        <div className="mt-10 border-t pt-6">

          <div className="flex justify-between mb-2">

            <span>Subtotal</span>

            <span>

              $
              {Number(quote.subtotal).toFixed(2)}

            </span>

          </div>

          <div className="flex justify-between mb-4">

            <span>Tax</span>

            <span>

              $
              {Number(quote.tax).toFixed(2)}

            </span>

          </div>

          <div className="flex justify-between text-3xl font-bold">

            <span>Total</span>

            <span>

              $
              {Number(quote.total).toFixed(2)}

            </span>

          </div>

        </div>

      </div>

    </div>

  )

}