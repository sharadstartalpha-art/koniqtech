import prisma from "@/shared/lib/prisma"

export default async function BrandingPage() {

  const organization =
    await prisma.organization.findFirst()

  return (

    <div className="max-w-5xl space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Branding
        </h1>

        <p className="text-slate-500 mt-2">
          Customize your company appearance.
        </p>

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <form className="space-y-6">

          <div>

            <label className="block mb-2 font-medium">
              Company Name
            </label>

            <input
              defaultValue={organization?.name || ""}
              className="
              w-full
              border
              rounded-2xl
              p-4
              "
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Logo URL
            </label>

            <input
              defaultValue={organization?.logo || ""}
              className="
              w-full
              border
              rounded-2xl
              p-4
              "
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Primary Brand Color
            </label>

            <input
              type="color"
              defaultValue="#ea580c"
              className="
              h-14
              w-32
              border
              rounded-xl
              "
            />

          </div>

          <button
            className="
            px-6
            py-3
            rounded-2xl
            bg-orange-600
            text-white
            "
          >
            Save Branding
          </button>

        </form>

      </div>

    </div>

  )

}