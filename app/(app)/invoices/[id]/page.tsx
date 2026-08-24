import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function InvoiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
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

  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
      orgId,
    },
    include: {
      customer: true,
      job: true,
    },
  })

  if (!invoice) {
    notFound()
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            Invoice {invoice.invoiceNumber}
          </h1>

          <p className="text-slate-500 mt-2">
            Invoice details and payment information
          </p>
        </div>

        <div className="flex gap-3">

          <Link
            href={`/invoices/${invoice.id}/edit`}
            className="px-5 py-3 rounded-xl bg-orange-600 text-white hover:bg-orange-700"
          >
            Edit
          </Link>

          <Link
            href={`/invoices/pdf/${invoice.id}`}
            className="px-5 py-3 rounded-xl border hover:bg-slate-50"
          >
            PDF
          </Link>

          <Link
            href={`/invoices/${invoice.id}/delete`}
            className="px-5 py-3 rounded-xl border border-red-500 text-red-600 hover:bg-red-50"
          >
            Delete
          </Link>

        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white border rounded-3xl p-8">

          <h2 className="text-xl font-bold mb-6">
            Invoice Information
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span className="text-slate-500">
                Invoice Number
              </span>

              <span className="font-semibold">
                {invoice.invoiceNumber}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Status
              </span>

              <span className="font-semibold capitalize">
                {invoice.status}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Created
              </span>

              <span>
                {invoice.createdAt.toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Due Date
              </span>

              <span>
                {invoice.dueDate
                  ? invoice.dueDate.toLocaleDateString()
                  : "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Sent
              </span>

              <span>
                {invoice.sentAt
                  ? invoice.sentAt.toLocaleDateString()
                  : "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Paid
              </span>

              <span>
                {invoice.paidAt
                  ? invoice.paidAt.toLocaleDateString()
                  : "-"}
              </span>
            </div>

          </div>

        </div>

        <div className="bg-white border rounded-3xl p-8">

          <h2 className="text-xl font-bold mb-6">
            Customer
          </h2>

          <div className="space-y-3">

            <div>

              <div className="font-semibold">
                {invoice.customer.companyName ??
                  `${invoice.customer.firstName ?? ""} ${invoice.customer.lastName ?? ""}`}
              </div>

            </div>

            {invoice.customer.email && (
              <div>
                <span className="text-slate-500">
                  Email:
                </span>{" "}
                {invoice.customer.email}
              </div>
            )}

            {invoice.customer.phone && (
              <div>
                <span className="text-slate-500">
                  Phone:
                </span>{" "}
                {invoice.customer.phone}
              </div>
            )}

            {invoice.customer.address && (
              <div>
                <span className="text-slate-500">
                  Address:
                </span>{" "}
                {invoice.customer.address}
              </div>
            )}

            {invoice.customer.city && (
              <div>
                {invoice.customer.city}
              </div>
            )}

            {invoice.customer.state && (
              <div>
                {invoice.customer.state}
              </div>
            )}

            {invoice.customer.zip && (
              <div>
                {invoice.customer.zip}
              </div>
            )}

          </div>

        </div>

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <h2 className="text-xl font-bold mb-6">
          Job
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between">
            <span className="text-slate-500">
              Job
            </span>

            <span className="font-semibold">
              {invoice.job.title}
            </span>
          </div>

        </div>

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <h2 className="text-xl font-bold mb-6">
          Amounts
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between">
            <span>Subtotal</span>

            <span>
              ₹{Number(invoice.subtotal).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>

            <span>
              ₹{Number(invoice.tax).toFixed(2)}
            </span>
          </div>

          <div className="border-t pt-4 flex justify-between text-xl font-bold">

            <span>Total</span>

            <span>
              ₹{Number(invoice.total).toFixed(2)}
            </span>

          </div>

        </div>

      </div>

    </div>
  )
}