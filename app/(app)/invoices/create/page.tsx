import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

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

  const [customers, jobs] = await Promise.all([
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
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ])

  const invoiceNumber = `INV-${Date.now()}`

  return (
    <div className="max-w-5xl mx-auto space-y-8">
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
          className="border px-5 py-3 rounded-xl hover:bg-slate-100"
        >
          Back
        </Link>
      </div>

      <form
        action="/api/invoices"
        method="POST"
        className="bg-white border rounded-3xl p-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-2">
              Invoice Number
            </label>

            <input
              name="invoiceNumber"
              defaultValue={invoiceNumber}
              required
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Status
            </label>

            <select
              name="status"
              defaultValue="draft"
              className="w-full border rounded-xl p-4"
            >
              <option value="draft">
                Draft
              </option>

              <option value="sent">
                Sent
              </option>

              <option value="paid">
                Paid
              </option>

              <option value="overdue">
                Overdue
              </option>

              <option value="cancelled">
                Cancelled
              </option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">
              Customer
            </label>

            <select
              name="customerId"
              required
              className="w-full border rounded-xl p-4"
            >
              <option value="">
                Select Customer
              </option>

              {customers.map((customer) => (
                <option
                  key={customer.id}
                  value={customer.id}
                >
                  {customer.firstName} {customer.lastName}
                  {customer.companyName
                    ? ` (${customer.companyName})`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">
              Job
            </label>

            <select
              name="jobId"
              required
              className="w-full border rounded-xl p-4"
            >
              <option value="">
                Select Job
              </option>

              {jobs.map((job) => (
                <option
                  key={job.id}
                  value={job.id}
                >
                  {job.title} —{" "}
                  {job.customer.firstName}{" "}
                  {job.customer.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">
              Subtotal
            </label>

            <input
              type="number"
              step="0.01"
              name="subtotal"
              defaultValue="0"
              required
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Tax
            </label>

            <input
              type="number"
              step="0.01"
              name="tax"
              defaultValue="0"
              required
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Total
            </label>

            <input
              type="number"
              step="0.01"
              name="total"
              defaultValue="0"
              required
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Due Date
            </label>

            <input
              type="date"
              name="dueDate"
              className="w-full border rounded-xl p-4"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-8
              py-4
              rounded-2xl
            "
          >
            Create Invoice
          </button>

          <Link
            href="/invoices"
            className="
              border
              px-8
              py-4
              rounded-2xl
              hover:bg-slate-100
            "
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}