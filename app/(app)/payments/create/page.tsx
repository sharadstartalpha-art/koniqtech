// app/(app)/payments/create/page.tsx

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import { redirect } from "next/navigation"
import PaymentForm from "./PaymentForm"

export const dynamic = "force-dynamic"

export default async function CreatePaymentPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const [customers, invoices] = await Promise.all([
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
        total: true,
        customerId: true,
      },
    }),
  ])

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Record Payment
        </h1>

        <p className="mt-2 text-slate-500">
          Record a customer payment against an invoice.
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
      />

    </div>
  )
}