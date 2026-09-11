import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import InvoiceForm from "./InvoiceForm"

export const dynamic = "force-dynamic"

export default async function CreateInvoicePage() {

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const [
    customers,
    jobs,
  ] = await Promise.all([

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

  return (

    <div className="max-w-5xl mx-auto space-y-8">

      {/* --------------------------------
          PAGE HEADER
      -------------------------------- */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Create Invoice
          </h1>

          <p className="text-slate-500 mt-2">
            Generate a new customer invoice.
          </p>

        </div>

        <Link
          href="/invoices"
          className="
            border
            px-5
            py-3
            rounded-xl
            hover:bg-slate-100
          "
        >
          Back
        </Link>

      </div>

      {/* --------------------------------
          INVOICE FORM
      -------------------------------- */}

      <InvoiceForm
        customers={customers}
        jobs={jobs}
      />

    </div>

  )

}