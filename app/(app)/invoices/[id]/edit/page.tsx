import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import { notFound, redirect } from "next/navigation"
import InvoiceForm from "../../create/InvoiceForm"

export const dynamic = "force-dynamic"

export default async function EditInvoicePage({
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

  const [invoice, customers, jobs] = await Promise.all([
    prisma.invoice.findFirst({
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
        firstName: "asc",
      },
    }),

    prisma.job.findMany({
      where: {
        orgId,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ])

  if (!invoice) {
    notFound()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Edit Invoice
        </h1>

        <p className="text-slate-600 mt-2">
          Update invoice information.
        </p>
      </div>

      <InvoiceForm
        customers={customers}
        jobs={jobs}
        invoice={{
          id: invoice.id,
          customerId: invoice.customerId,
          jobId: invoice.jobId,
          invoiceNumber: invoice.invoiceNumber,
          subtotal: Number(invoice.subtotal),
          tax: Number(invoice.tax),
          total: Number(invoice.total),
          dueDate: invoice.dueDate
            ? invoice.dueDate.toISOString().split("T")[0]
            : "",
          status: invoice.status,
        }}
      />

    </div>
  )
}