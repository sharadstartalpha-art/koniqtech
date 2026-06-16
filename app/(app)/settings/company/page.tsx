import prisma from "@/shared/lib/prisma"

export default async function CompanyPage() {

  const organization =
    await prisma.organization.findFirst()

  return (

    <div className="max-w-6xl space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Company Information
        </h1>

        <p className="text-slate-500 mt-2">
          Manage business profile and company details.
        </p>

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <label className="text-sm text-slate-500">
              Company Name
            </label>

            <input
              defaultValue={organization?.name || ""}
              className="
              w-full
              border
              rounded-2xl
              p-4
              mt-2
              "
            />

          </div>

          <div>

            <label className="text-sm text-slate-500">
              Email
            </label>

            <input
              defaultValue={organization?.email || ""}
              className="
              w-full
              border
              rounded-2xl
              p-4
              mt-2
              "
            />

          </div>

          <div>

            <label className="text-sm text-slate-500">
              Phone
            </label>

            <input
              defaultValue={organization?.phone || ""}
              className="
              w-full
              border
              rounded-2xl
              p-4
              mt-2
              "
            />

          </div>

          <div>

            <label className="text-sm text-slate-500">
              Address
            </label>

            <input
              defaultValue={organization?.address || ""}
              className="
              w-full
              border
              rounded-2xl
              p-4
              mt-2
              "
            />

          </div>

        </div>

        <button
          className="
          mt-8
          px-6
          py-3
          bg-orange-600
          text-white
          rounded-2xl
          "
        >
          Save Changes
        </button>

      </div>

    </div>

  )

}