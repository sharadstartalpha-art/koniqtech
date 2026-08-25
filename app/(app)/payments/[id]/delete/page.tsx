import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import {
  notFound,
  redirect,
} from "next/navigation"

export const dynamic = "force-dynamic"

export default async function DeletePaymentPage({
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

  const payment =
    await prisma.payment.findFirst({
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

  async function deletePayment() {
    "use server"

    const session =
      await auth()

    if (!session?.user?.orgId) {
      redirect("/login")
    }

    const existing =
      await prisma.payment.findFirst({
        where: {
          id,
          orgId:
            session.user.orgId,
        },
      })

    if (!existing) {
      notFound()
    }

    const invoiceId =
      existing.invoiceId

    await prisma.payment.delete({
      where: {
        id,
      },
    })

    const invoice =
      await prisma.invoice.findUnique({
        where: {
          id: invoiceId,
        },
      })

    if (invoice) {
      const totalPaid =
        await prisma.payment.aggregate({
          where: {
            invoiceId,
          },
          _sum: {
            amount: true,
          },
        })

      const paid =
        Number(
          totalPaid._sum.amount ??
            0
        )

      const invoiceTotal =
        Number(invoice.total)

      let status = "draft"

      if (paid > 0) {
        status = "partial"
      }

      if (
        paid >= invoiceTotal
      ) {
        status = "paid"
      }

      await prisma.invoice.update({
        where: {
          id: invoiceId,
        },
        data: {
          status,
          paidAt:
            status === "paid"
              ? new Date()
              : null,
        },
      })
    }

    redirect("/payments")
  }

  return (
    <div className="max-w-2xl mx-auto">

      <div className="bg-white border border-red-200 rounded-3xl p-8">

        <div className="flex items-center gap-4 mb-8">

          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-3xl">
            ⚠️
          </div>

          <div>

            <h1 className="text-3xl font-bold text-red-700">
              Delete Payment
            </h1>

            <p className="text-slate-500 mt-1">
              This action cannot be
              undone.
            </p>

          </div>

        </div>

        <div className="bg-slate-50 border rounded-2xl p-6 space-y-4">

          <div className="flex justify-between">

            <span className="text-slate-500">
              Customer
            </span>

            <span className="font-semibold">

              {payment.customer
                .companyName ??
                `${payment.customer.firstName ?? ""} ${payment.customer.lastName ?? ""}`}

            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-500">
              Invoice
            </span>

            <span className="font-semibold">
              {
                payment.invoice
                  .invoiceNumber
              }
            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-500">
              Amount
            </span>

            <span className="font-bold text-lg text-green-600">
              ₹
              {Number(
                payment.amount
              ).toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-500">
              Method
            </span>

            <span className="capitalize">
              {payment.method.replaceAll(
                "_",
                " "
              )}
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

        </div>

        <form
          action={deletePayment}
          className="mt-8"
        >

          <div className="flex gap-4">

            <button
              type="submit"
              className="
                bg-red-600
                hover:bg-red-700
                text-white
                px-8
                py-3
                rounded-xl
                font-semibold
              "
            >
              Delete Payment
            </button>

            <Link
              href={`/payments/${payment.id}`}
              className="
                border
                px-8
                py-3
                rounded-xl
                hover:bg-slate-50
              "
            >
              Cancel
            </Link>

          </div>

        </form>

      </div>

    </div>
  )
}