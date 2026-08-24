import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function DeleteLeadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = (session.user as any).orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const { id } = await params

  const lead = await prisma.lead.findFirst({
    where: {
      id,
      orgId,
    },
  })

  if (!lead) {
    notFound()
  }

  const customer = await prisma.customer.findFirst({
    where: {
      leadId: lead.id,
      orgId,
    },
  })

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      <div>

        <Link
          href={`/leads/${lead.id}`}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 mb-4"
        >
          ← Back to Lead
        </Link>

        <h1 className="text-3xl font-bold text-red-600">
          Delete Lead
        </h1>

        <p className="text-slate-500 mt-2">
          This action cannot be undone.
        </p>

      </div>

      <div className="bg-white border rounded-3xl p-8 shadow-sm">

        <div className="space-y-6">

          <div>

            <h2 className="text-xl font-semibold">
              Lead Information
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <p className="text-xs text-slate-500">
                Name
              </p>

              <p className="font-medium">
                {lead.firstName} {lead.lastName}
              </p>

            </div>

            <div>

              <p className="text-xs text-slate-500">
                Email
              </p>

              <p className="font-medium">
                {lead.email || "-"}
              </p>

            </div>

            <div>

              <p className="text-xs text-slate-500">
                Phone
              </p>

              <p className="font-medium">
                {lead.phone || "-"}
              </p>

            </div>

            <div>

              <p className="text-xs text-slate-500">
                Company
              </p>

              <p className="font-medium">
                {lead.companyName || "-"}
              </p>

            </div>

          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

            <h3 className="font-semibold text-red-700">
              Warning
            </h3>

            <ul className="list-disc pl-6 mt-3 text-sm text-red-700 space-y-2">

              <li>
                The lead will be permanently deleted.
              </li>

              <li>
                Notes and activities may also be removed.
              </li>

              <li>
                This action cannot be undone.
              </li>

            </ul>

          </div>

          {customer && (

            <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-5">

              <h3 className="font-semibold text-yellow-800">
                Lead Already Converted
              </h3>

              <p className="text-sm text-yellow-700 mt-2">
                This lead has already been converted into a customer.
                It is recommended that you archive it instead of deleting it.
              </p>

            </div>

          )}

          <div className="flex justify-end gap-4">

            <Link
              href={`/leads/${lead.id}`}
              className="px-6 py-3 rounded-2xl border hover:bg-slate-50"
            >
              Cancel
            </Link>

            {!customer && (

              <form
                action={`/api/leads/${lead.id}`}
                method="post"
              >

                <input
                  type="hidden"
                  name="_method"
                  value="DELETE"
                />

                <button
                  className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-medium"
                >
                  Delete Lead
                </button>

              </form>

            )}

          </div>

        </div>

      </div>

    </div>
  )

}