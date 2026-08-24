import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"
import {
  redirect,
  notFound
} from "next/navigation"

export const dynamic = "force-dynamic"

export default async function Page({
  params
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

  const opportunity =
    await prisma.opportunity.findFirst({

      where: {
        id,
        orgId
      }

    })

  if (!opportunity) {
    notFound()
  }

  return (

    <div className="max-w-2xl mx-auto">

      <div className="bg-white border rounded-3xl p-10 shadow-sm">

        <h1 className="text-3xl font-bold text-red-600">
          Delete Opportunity
        </h1>

        <p className="mt-4 text-slate-600">

          You are about to permanently delete this
          opportunity.

        </p>

        <div className="mt-8 rounded-2xl border bg-slate-50 p-6 space-y-3">

          <div>

            <span className="text-slate-500">
              Opportunity
            </span>

            <p className="font-semibold">

              {opportunity.title}

            </p>

          </div>

          <div>

            <span className="text-slate-500">
              Stage
            </span>

            <p className="capitalize">

              {opportunity.stage}

            </p>

          </div>

          <div>

            <span className="text-slate-500">
              Value
            </span>

            <p>

              {opportunity.value
                ? `₹${opportunity.value.toLocaleString()}`
                : "-"}

            </p>

          </div>

        </div>

        <form
          action={`/api/opportunities/${opportunity.id}`}
          method="post"
          className="mt-10"
        >

          <input
            type="hidden"
            name="_method"
            value="DELETE"
          />

          <div className="flex gap-4">

            <button
              formAction={`/api/opportunities/${opportunity.id}`}
              formMethod="post"
              className="
              bg-red-600
              hover:bg-red-700
              text-white
              px-8
              py-4
              rounded-2xl
              "
            >
              Delete Opportunity
            </button>

            <Link
              href={`/pipeline/${opportunity.id}`}
              className="
              border
              px-8
              py-4
              rounded-2xl
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