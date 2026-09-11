import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import ArchiveInvoiceButton from "./ArchiveInvoiceButton"

export const dynamic = "force-dynamic"

export default async function DeleteInvoicePage({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) {

  const session =
    await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId =
    session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const { id } =
    await params

  const invoice =
    await prisma.invoice.findFirst({

      where: {
        id,
        orgId,
        archivedAt: null,
      },

      include: {
        customer: true,
        job: true,
      },

    })

  if (!invoice) {
    notFound()
  }

  const customerName =
    invoice.customer.companyName ??
    `${invoice.customer.firstName ?? ""} ${invoice.customer.lastName ?? ""}`.trim()

  return (

    <div className="max-w-2xl mx-auto">

      <div
        className="
          bg-white
          border
          rounded-3xl
          p-8
          space-y-8
        "
      >

        <div>

          <h1 className="text-3xl font-bold">
            Archive Invoice
          </h1>

          <p className="text-slate-500 mt-2">
            This invoice will be moved to the archive.
          </p>

        </div>

        <div
          className="
            border
            rounded-2xl
            bg-slate-50
            p-6
            space-y-4
          "
        >

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
              {customerName}
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

            <span className="font-semibold">
              ₹{Number(invoice.total).toFixed(2)}
            </span>

          </div>

        </div>

        <div
          className="
            border
            border-orange-200
            bg-orange-50
            rounded-2xl
            p-5
            text-orange-800
          "
        >

          <p className="font-semibold">
            This invoice will not be permanently deleted.
          </p>

          <p className="text-sm mt-1">
            It will be moved to the archive and can be
            restored by an authorized administrator.
          </p>

        </div>

        <div className="flex gap-4">

          <ArchiveInvoiceButton
            invoiceId={invoice.id}
          />

          <Link
            href={`/invoices/${invoice.id}`}
            className="
              border
              px-8
              py-4
              rounded-2xl
              font-semibold
              hover:bg-slate-100
            "
          >
            Cancel
          </Link>

        </div>

      </div>

    </div>

  )
}