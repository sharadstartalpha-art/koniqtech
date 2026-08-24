import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import { notFound, redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function InvoicePdfPage({
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
    <div className="bg-slate-100 min-h-screen py-10">

      <div className="max-w-4xl mx-auto bg-white shadow-xl p-12">

        <div className="flex justify-between items-start border-b pb-8">

          <div>

            <h1 className="text-5xl font-bold">
              INVOICE
            </h1>

            <p className="text-slate-500 mt-3">
              #{invoice.invoiceNumber}
            </p>

          </div>

          <div className="text-right">

            <h2 className="text-2xl font-bold">
              KoniqTech
            </h2>

            <p className="text-slate-500">
              Professional Services
            </p>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-10 mt-10">

          <div>

            <h3 className="font-bold mb-3">
              Bill To
            </h3>

            <div className="space-y-1 text-slate-700">

              {(invoice.customer.companyName ||
                invoice.customer.firstName ||
                invoice.customer.lastName) && (
                <div className="font-semibold">
                  {invoice.customer.companyName ??
                    `${invoice.customer.firstName ?? ""} ${invoice.customer.lastName ?? ""}`}
                </div>
              )}

              {invoice.customer.email && (
                <div>
                  {invoice.customer.email}
                </div>
              )}

              {invoice.customer.phone && (
                <div>
                  {invoice.customer.phone}
                </div>
              )}

              {invoice.customer.address && (
                <div>
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

          <div className="text-right space-y-2">

            <div>
              <span className="font-semibold">
                Status:
              </span>{" "}
              <span className="capitalize">
                {invoice.status}
              </span>
            </div>

            <div>
              <span className="font-semibold">
                Created:
              </span>{" "}
              {invoice.createdAt.toLocaleDateString()}
            </div>

            {invoice.dueDate && (
              <div>
                <span className="font-semibold">
                  Due:
                </span>{" "}
                {invoice.dueDate.toLocaleDateString()}
              </div>
            )}

          </div>

        </div>

        <div className="mt-12">

          <table className="w-full border">

            <thead className="bg-slate-100">

              <tr>

                <th className="text-left p-4 border">
                  Description
                </th>

                <th className="text-right p-4 border">
                  Amount
                </th>

              </tr>

            </thead>

            <tbody>

              <tr>

                <td className="p-4 border">
                  {invoice.job.title}
                </td>

                <td className="p-4 border text-right">
                  ₹{Number(invoice.subtotal).toLocaleString()}
                </td>

              </tr>

            </tbody>

          </table>

        </div>

        <div className="flex justify-end mt-10">

          <div className="w-80 space-y-3">

            <div className="flex justify-between">

              <span>
                Subtotal
              </span>

              <span>
                ₹{Number(invoice.subtotal).toLocaleString()}
              </span>

            </div>

            <div className="flex justify-between">

              <span>
                Tax
              </span>

              <span>
                ₹{Number(invoice.tax).toLocaleString()}
              </span>

            </div>

            <div className="flex justify-between border-t pt-4 text-2xl font-bold">

              <span>
                Total
              </span>

              <span>
                ₹{Number(invoice.total).toLocaleString()}
              </span>

            </div>

          </div>

        </div>

        <div className="mt-16 border-t pt-8 text-center text-slate-500">

          Thank you for your business.

        </div>

      </div>

    </div>
  )
}