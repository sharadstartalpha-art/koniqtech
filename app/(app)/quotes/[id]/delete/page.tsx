import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DeleteQuotePage({
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
    },
  })

  if (!quote) {
    notFound()
  }

  async function deleteQuote() {
    "use server"

    const session = await auth()

    if (!session?.user?.orgId) {
      redirect("/login")
    }

    const existing = await prisma.quote.findFirst({
      where: {
        id,
        orgId: session.user.orgId,
      },
    })

    if (!existing) {
      notFound()
    }

    await prisma.quote.delete({
      where: {
        id,
      },
    })

    redirect("/quotes")
  }

  return (
    <div className="max-w-2xl mx-auto">

      <div className="bg-white border border-red-200 rounded-3xl p-10">

        <h1 className="text-4xl font-bold text-red-600 mb-4">
          Delete Quote
        </h1>

        <p className="text-slate-600 mb-8">
          This action cannot be undone.
        </p>

        <div className="rounded-2xl border bg-slate-50 p-6 space-y-3">

          <div>
            <span className="font-semibold">
              Quote Number:
            </span>{" "}
            {quote.quoteNumber}
          </div>

          <div>
            <span className="font-semibold">
              Customer:
            </span>{" "}
            {quote.customer.firstName} {quote.customer.lastName}
          </div>

          <div>
            <span className="font-semibold">
              Status:
            </span>{" "}
            <span className="capitalize">
              {quote.status}
            </span>
          </div>

          <div>
            <span className="font-semibold">
              Total:
            </span>{" "}
            $
            {Number(quote.total).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </div>

        </div>

        <form
          action={deleteQuote}
          className="flex gap-4 mt-10"
        >

          <button
            type="submit"
            className="
              bg-red-600
              hover:bg-red-700
              text-white
              px-8
              py-4
              rounded-2xl
              font-semibold
            "
          >
            Delete Quote
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
            Cancel
          </a>

        </form>

      </div>

    </div>
  )
}