import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
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

    <div className="max-w-3xl mx-auto">

      <div className="bg-white border rounded-3xl p-8">

        <h1 className="text-3xl font-bold mb-8">
          Edit Opportunity
        </h1>

        <form
          action={`/api/opportunities/${opportunity.id}`}
          method="POST"
          className="space-y-5"
        >

          <div>

            <label className="block mb-2 font-medium">
              Opportunity Name
            </label>

            <input
              name="title"
              defaultValue={opportunity.title}
              className="w-full border rounded-xl p-4"
              required
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Stage
            </label>

            <select
              name="stage"
              defaultValue={opportunity.stage}
              className="w-full border rounded-xl p-4"
            >

              <option value="new">
                New
              </option>

              <option value="contacted">
                Contacted
              </option>

              <option value="estimate">
                Estimate
              </option>

              <option value="won">
                Won
              </option>

              <option value="lost">
                Lost
              </option>

            </select>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Value
            </label>

            <input
              type="number"
              step="0.01"
              name="value"
              defaultValue={opportunity.value ?? ""}
              className="w-full border rounded-xl p-4"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Expected Close Date
            </label>

            <input
              type="date"
              name="expectedCloseDate"
              defaultValue={
                opportunity.expectedCloseDate
                  ? opportunity.expectedCloseDate
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              className="w-full border rounded-xl p-4"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              name="description"
              rows={5}
              defaultValue={opportunity.description ?? ""}
              className="w-full border rounded-xl p-4"
            />

          </div>

          <div className="flex gap-4">

            <button
              className="
              bg-orange-600
              hover:bg-orange-700
              text-white
              px-8
              py-4
              rounded-2xl
              "
            >
              Save Changes
            </button>

            <a
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
            </a>

          </div>

        </form>

      </div>

    </div>

  )

}