import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import SendInvoiceButton from "./SendInvoiceButton"
export const dynamic = "force-dynamic"

export default async function SendInvoicePage({
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
      archivedAt: null,
    },
    include: {
      customer: true,
      job: true,
      organization: true,
    },
  })

  if (!invoice) {
    notFound()
  }

  const customerName =
    invoice.customer.companyName ||
    [
      invoice.customer.firstName,
      invoice.customer.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    "Customer"

  const customerEmail =
    invoice.customer.email || ""

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* HEADER */}

      <div>

        <Link
          href={`/invoices/${invoice.id}`}
          className="
            inline-flex
            items-center
            px-4
            py-2
            rounded-xl
            border
            hover:bg-slate-50
            mb-6
          "
        >
          ← Back to Invoice
        </Link>

        <h1 className="text-4xl font-bold">
          Send Invoice
        </h1>

        <p className="text-slate-500 mt-2">
          Send this invoice to your customer by email.
        </p>

      </div>


      {/* INVOICE SUMMARY */}

      <div className="bg-white border rounded-3xl p-8">

        <h2 className="text-xl font-bold mb-6">
          Invoice Summary
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
              Customer
            </span>

            <span className="font-semibold">
              {customerName}
            </span>

          </div>


          <div className="flex justify-between">

            <span className="text-slate-500">
              Amount
            </span>

            <span className="font-semibold">
              ${Number(invoice.total).toFixed(2)}
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

        </div>

      </div>


      {/* EMAIL INFORMATION */}

      <div className="bg-white border rounded-3xl p-8">

        <h2 className="text-xl font-bold mb-6">
          Email
        </h2>

        {!customerEmail ? (

          <div className="
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-5
            text-red-700
          ">

            <div className="font-semibold mb-1">
              Customer email is missing
            </div>

            <div className="text-sm">
              Please add an email address to the customer
              before sending this invoice.
            </div>

          </div>

        ) : (

          <div className="space-y-5">

            <div>

              <label className="
                block
                text-sm
                font-medium
                text-slate-600
                mb-2
              ">
                Send To
              </label>

              <div className="
                w-full
                border
                rounded-xl
                px-4
                py-3
                bg-slate-50
              ">
                {customerEmail}
              </div>

            </div>


            <div>

              <label className="
                block
                text-sm
                font-medium
                text-slate-600
                mb-2
              ">
                Subject
              </label>

              <div className="
                w-full
                border
                rounded-xl
                px-4
                py-3
                bg-slate-50
              ">
                Invoice {invoice.invoiceNumber}
              </div>

            </div>


            <div>

              <label className="
                block
                text-sm
                font-medium
                text-slate-600
                mb-2
              ">
                Attachment
              </label>

              <div className="
                border
                rounded-xl
                px-4
                py-3
                bg-slate-50
              ">
                📄 {invoice.invoiceNumber}.pdf
              </div>

            </div>

          </div>

        )}

      </div>


      {/* ACTIONS */}

      <div className="
  flex
  items-center
  justify-end
  gap-3
">

  <Link
    href={`/invoices/${invoice.id}`}
    className="
      px-5
      py-3
      rounded-xl
      border
      hover:bg-slate-50
    "
  >
    Cancel
  </Link>

  {customerEmail && (
    <SendInvoiceButton
      invoiceId={invoice.id}
    />
  )}

</div>

    </div>
  )
}