import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import { notFound, redirect } from "next/navigation"
import PaymentForm from "../../create/PaymentForm"

export const dynamic = "force-dynamic"

export default async function EditPaymentPage({
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

  const [payment, customers, invoices] = await Promise.all([

    prisma.payment.findFirst({
      where: {
        id,
        orgId,
      },
    }),

    prisma.customer.findMany({
      where: {
        orgId,
      },
      orderBy: {
        companyName: "asc",
      },
      select: {
        id: true,
        companyName: true,
        firstName: true,
        lastName: true,
      },
    }),

    prisma.invoice.findMany({
      where: {
        orgId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        invoiceNumber: true,
        customerId: true,
        total: true,
      },
    }),

  ])

  if (!payment) {
    notFound()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Edit Payment
        </h1>

        <p className="mt-2 text-slate-500">
          Update payment information.
        </p>

      </div>

      <PaymentForm
        customers={customers}
        invoices={invoices.map((invoice) => ({
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          customerId: invoice.customerId,
          total: Number(invoice.total),
        }))}
        payment={{
          id: payment.id,
          customerId: payment.customerId,
          invoiceId: payment.invoiceId,
          amount: Number(payment.amount),
          method: payment.method,
          reference: payment.reference ?? "",
          notes: payment.notes ?? "",
          paidAt: payment.paidAt
            .toISOString()
            .split("T")[0],
        }}
      />

    </div>
  )
}