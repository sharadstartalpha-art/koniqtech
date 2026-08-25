import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function PaymentDetailsPage({
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

  const payment = await prisma.payment.findFirst({
    where: {
      id,
      orgId,
    },
    include: {
      customer: true,
      invoice: true,
    },
  })

  if (!payment) {
    notFound()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      <div className="flex items-start justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Payment Details
          </h1>

          <p className="text-slate-500 mt-2">
            Payment record information.
          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/payments/${payment.id}/edit`}
            className="
              px-5
              py-3
              rounded-xl
              bg-blue-600
              text-white
              hover:bg-blue-700
            "
          >
            Edit
          </Link>

          <Link
            href={`/payments/${payment.id}/delete`}
            className="
              px-5
              py-3
              rounded-xl
              bg-red-600
              text-white
              hover:bg-red-700
            "
          >
            Delete
          </Link>

        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        <div className="bg-white border rounded-3xl p-8 space-y-6">

          <h2 className="text-2xl font-bold">
            Payment
          </h2>

          <div className="flex justify-between">

            <span className="text-slate-500">
              Amount
            </span>

            <span className="font-bold text-2xl text-emerald-600">
              ₹{Number(payment.amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-500">
              Method
            </span>

            <span className="capitalize">
              {payment.method.replaceAll("_", " ")}
            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-500">
              Paid On
            </span>

            <span>
              {payment.paidAt.toLocaleDateString()}
            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-500">
              Reference
            </span>

            <span>
              {payment.reference || "-"}
            </span>

          </div>

        </div>

        <div className="bg-white border rounded-3xl p-8 space-y-6">

          <h2 className="text-2xl font-bold">
            Invoice
          </h2>

          <div className="flex justify-between">

            <span className="text-slate-500">
              Invoice
            </span>

            <Link
              href={`/invoices/${payment.invoice.id}`}
              className="text-blue-600 hover:underline"
            >
              {payment.invoice.invoiceNumber}
            </Link>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-500">
              Invoice Total
            </span>

            <span>
              ₹{Number(payment.invoice.total).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-500">
              Status
            </span>

            <span className="capitalize">
              {payment.invoice.status}
            </span>

          </div>

        </div>

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <h2 className="text-2xl font-bold mb-6">
          Customer
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <div className="text-slate-500 mb-1">
              Name
            </div>

            <div className="font-semibold">

              {payment.customer.companyName ||

                `${payment.customer.firstName ?? ""} ${payment.customer.lastName ?? ""}`}

            </div>

          </div>

          <div>

            <div className="text-slate-500 mb-1">
              Email
            </div>

            <div>
              {payment.customer.email || "-"}
            </div>

          </div>

          <div>

            <div className="text-slate-500 mb-1">
              Phone
            </div>

            <div>
              {payment.customer.phone || "-"}
            </div>

          </div>

        </div>

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <h2 className="text-2xl font-bold mb-4">
          Notes
        </h2>

        <p className="whitespace-pre-wrap text-slate-700">
          {payment.notes || "No notes available."}
        </p>

      </div>

    </div>
  )
}