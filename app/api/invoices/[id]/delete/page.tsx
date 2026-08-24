import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function DeleteInvoicePage({
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

  async function deleteInvoice() {
    "use server"

    const session = await auth()

    if (!session?.user?.orgId) {
      redirect("/login")
    }

    const invoiceId = id

await prisma.invoice.delete({
  where: {
    id: invoiceId,
  },
})

    redirect("/invoices")
  }

  return (
    <div className="max-w-2xl mx-auto">

      <div className="bg-white border border-red-200 rounded-3xl p-8">

        <div className="flex items-center gap-3 mb-6">

          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl">
            ⚠️
          </div>

          <div>

            <h1 className="text-3xl font-bold text-red-700">
              Delete Invoice
            </h1>

            <p className="text-slate-500 mt-1">
              This action cannot be undone.
            </p>

          </div>

        </div>

        <div className="bg-slate-50 border rounded-2xl p-6 space-y-3 mb-8">

          <div className="flex justify-between">

            <span className="text-slate-500">
              Invoice
            </span>

            <span className="font-semibold">
              {invoice.invoiceNumber}
            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-500">
              Customer
            </span>

            <span className="font-semibold">
              {invoice.customer.companyName ??
                `${invoice.customer.firstName ?? ""} ${invoice.customer.lastName ?? ""}`}
            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-500">
              Job
            </span>

            <span className="font-semibold">
              {invoice.job.title}
            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-500">
              Total
            </span>

            <span className="font-bold text-lg">
              ₹{Number(invoice.total).toLocaleString()}
            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-500">
              Status
            </span>

            <span className="capitalize">
              {invoice.status}
            </span>

          </div>

        </div>

        <form action={deleteInvoice}>

          <div className="flex gap-4">

            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Delete Invoice
            </button>

            <Link
              href={`/invoices/${invoice.id}`}
              className="border px-8 py-3 rounded-xl hover:bg-slate-50"
            >
              Cancel
            </Link>

          </div>

        </form>

      </div>

    </div>
  )
}