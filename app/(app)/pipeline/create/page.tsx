import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

async function createOpportunity(
  formData: FormData
) {

  "use server"

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const customerId =
    String(formData.get("customerId") || "")

  const title =
    String(formData.get("title") || "")

  const valueText =
    String(formData.get("value") || "")

  const stage =
    String(formData.get("stage") || "new")

  const probabilityText =
    String(formData.get("probability") || "10")

  const expectedCloseText =
    String(formData.get("expectedClose") || "")

  const notes =
    String(formData.get("notes") || "")

  await prisma.opportunity.create({

    data: {

      orgId,

      customerId:
        customerId || null,

      title,

      value:
        valueText
          ? Number(valueText)
          : null,

      stage,

      probability:
        Number(probabilityText),

      expectedCloseDate:
        expectedCloseText
          ? new Date(expectedCloseText)
          : null,

      notes

    }

  })

  redirect("/pipeline")

}

export default async function Page() {

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

  const customers =
    await prisma.customer.findMany({

      where: {
        orgId
      },

      orderBy: {
        firstName: "asc"
      }

    })

  return (

    <form
      action={createOpportunity}
      className="max-w-4xl mx-auto space-y-8"
    >

      <div>

        <Link
          href="/pipeline"
          className="text-slate-500 hover:text-orange-600"
        >
          ← Back to Pipeline
        </Link>

        <h1 className="text-5xl font-bold mt-4">
          New Opportunity
        </h1>

        <p className="text-slate-500 mt-2">
          Create a new sales opportunity.
        </p>

      </div>

      <div className="bg-white border rounded-3xl p-8 space-y-6">

        <div>

          <label className="block mb-2 font-medium">
            Customer
          </label>

          <select
            name="customerId"
            className="w-full border rounded-xl p-3"
          >

            <option value="">
              Select Customer
            </option>

            {customers.map(customer => (

              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.firstName}{" "}
                {customer.lastName ?? ""}
                {customer.companyName
                  ? ` (${customer.companyName})`
                  : ""}
              </option>

            ))}

          </select>

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Opportunity Title
          </label>

          <input
            name="title"
            required
            className="w-full border rounded-xl p-3"
            placeholder="Roof Replacement"
          />

        </div>

        <div className="grid grid-cols-2 gap-6">

          <div>

            <label className="block mb-2 font-medium">
              Estimated Value
            </label>

            <input
              type="number"
              name="value"
              className="w-full border rounded-xl p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Expected Close
            </label>

            <input
              type="date"
              name="expectedClose"
              className="w-full border rounded-xl p-3"
            />

          </div>

        </div>

        <div className="grid grid-cols-2 gap-6">

          <div>

            <label className="block mb-2 font-medium">
              Stage
            </label>

            <select
              name="stage"
              className="w-full border rounded-xl p-3"
            >

              <option value="new">
                New
              </option>

              <option value="qualified">
                Qualified
              </option>

              <option value="proposal">
                Proposal
              </option>

              <option value="negotiation">
                Negotiation
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
              Probability %
            </label>

            <input
              type="number"
              name="probability"
              defaultValue={10}
              min={0}
              max={100}
              className="w-full border rounded-xl p-3"
            />

          </div>

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Notes
          </label>

          <textarea
            name="notes"
            rows={6}
            className="w-full border rounded-xl p-3"
          />

        </div>

      </div>

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
        Create Opportunity
      </button>

    </form>

  )

}