import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import QuoteForm from "../../create/QuoteForm"

export const dynamic = "force-dynamic"

export default async function EditQuotePage({
  params,
}: {
  params: Promise<{
    id: string
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

  const customers = await prisma.customer.findMany({
    where: {
      orgId,
    },
    orderBy: {
      firstName: "asc",
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      companyName: true,
    },
  })

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-5xl font-bold">
          Edit Quote
        </h1>

        <p className="text-slate-500 mt-2">
          Update quote information and line items.
        </p>

      </div>

      <QuoteForm
        customers={customers}
        quote={{
          id: quote.id,
          customerId: quote.customerId,
          quoteNumber: quote.quoteNumber,
          status: quote.status,
          validUntil: quote.validUntil
            ? quote.validUntil.toISOString().split("T")[0]
            : "",
          items: quote.items.map((item) => ({
            itemName: item.itemName,
            qty: item.qty,
            price: Number(item.price),
          })),
        }} quoteNumber={""} statuses={[]}      />

    </div>
  )
}