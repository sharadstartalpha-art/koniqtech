import prisma from "@/shared/lib/prisma"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function Page({
  params
}:{
  params:Promise<{id:string}>
}) {

  const { id } = await params

  const lead = await prisma.lead.findUnique({
    where:{ id }
  })

  if(!lead){
    return(
      <div className="p-10">
        Lead not found
      </div>
    )
  }

  return(

    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <Link
            href={`/leads/${lead.id}`}
            className="
            inline-flex
            items-center
            gap-2
            text-slate-500
            hover:text-orange-600
            mb-4
            "
          >
            ← Back to Lead
          </Link>

          <h1 className="
          text-3xl
          font-bold
          text-slate-900
          ">
            Edit Lead
          </h1>

          <p className="
          text-slate-500
          mt-2
          ">
            Update customer information and lead details
          </p>

        </div>

        <div
          className="
          hidden
          md:flex
          items-center
          px-4
          py-2
          rounded-full
          bg-orange-100
          text-orange-700
          text-sm
          font-medium
          "
        >
          Lead ID: {lead.id.slice(0,8)}
        </div>

      </div>

      {/* Form Card */}

      <div
        className="
        bg-white
        border
        rounded-3xl
        shadow-sm
        overflow-hidden
        "
      >

        <div className="p-8 border-b">

          <h2 className="
          text-xl
          font-semibold
          ">
            Lead Information
          </h2>

        </div>

        <form
          action={`/api/leads/${lead.id}`}
          method="POST"
          className="p-8 space-y-6"
        >

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label
                className="
                block
                text-sm
                font-medium
                text-slate-600
                mb-2
                "
              >
                First Name
              </label>

              <input
                name="firstName"
                defaultValue={lead.firstName ?? ""}
                placeholder="John"
                className="
                w-full
                h-14
                px-4
                border
                rounded-2xl
                bg-slate-50
                focus:bg-white
                focus:border-orange-500
                "
              />

            </div>

            <div>

              <label
                className="
                block
                text-sm
                font-medium
                text-slate-600
                mb-2
                "
              >
                Last Name
              </label>

              <input
                name="lastName"
                defaultValue={lead.lastName ?? ""}
                placeholder="Smith"
                className="
                w-full
                h-14
                px-4
                border
                rounded-2xl
                bg-slate-50
                focus:bg-white
                focus:border-orange-500
                "
              />

            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label
                className="
                block
                text-sm
                font-medium
                text-slate-600
                mb-2
                "
              >
                Email Address
              </label>

              <input
                name="email"
                type="email"
                defaultValue={lead.email ?? ""}
                placeholder="john@email.com"
                className="
                w-full
                h-14
                px-4
                border
                rounded-2xl
                bg-slate-50
                focus:bg-white
                focus:border-orange-500
                "
              />

            </div>

            <div>

              <label
                className="
                block
                text-sm
                font-medium
                text-slate-600
                mb-2
                "
              >
                Phone Number
              </label>

              <input
                name="phone"
                defaultValue={lead.phone ?? ""}
                placeholder="+1 (555) 000-0000"
                className="
                w-full
                h-14
                px-4
                border
                rounded-2xl
                bg-slate-50
                focus:bg-white
                focus:border-orange-500
                "
              />

            </div>

          </div>

          <div>

            <label
              className="
              block
              text-sm
              font-medium
              text-slate-600
              mb-2
              "
            >
              Lead Status
            </label>

            <select
              name="status"
              defaultValue={String(lead.status)}
              className="
              w-full
              h-14
              px-4
              border
              rounded-2xl
              bg-slate-50
              focus:bg-white
              focus:border-orange-500
              "
            >
              <option value="new">
                New Lead
              </option>

              <option value="contacted">
                Contacted
              </option>

              <option value="won">
                Won
              </option>

              <option value="lost">
                Lost
              </option>

            </select>

          </div>

          {/* Actions */}

          <div
            className="
            flex
            flex-col
            md:flex-row
            gap-4
            pt-6
            border-t
            "
          >

            <button
              type="submit"
              className="
              h-14
              px-8
              rounded-2xl
              bg-orange-600
              hover:bg-orange-700
              text-white
              font-medium
              transition
              "
            >
              Save Changes
            </button>

            <Link
              href={`/leads/${lead.id}`}
              className="
              h-14
              px-8
              rounded-2xl
              border
              flex
              items-center
              justify-center
              hover:bg-slate-50
              transition
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