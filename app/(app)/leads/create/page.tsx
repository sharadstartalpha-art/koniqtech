import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

async function createLead(formData: FormData) {

  "use server"

  const session = await auth()

  const orgId = (session?.user as any)?.orgId

  if (!orgId) return

  await prisma.lead.create({

    data: {

      orgId,

      firstName:
        String(formData.get("firstName")),

      lastName:
        String(formData.get("lastName")),

      email:
        String(formData.get("email")),

      phone:
        String(formData.get("phone")),

      status: "new"

    }

  })

  redirect("/leads")

}

export default function Page() {

 return (

  <div className="max-w-4xl mx-auto">

    <div
      className="
      bg-white
      border
      rounded-3xl
      shadow-sm
      p-8
      md:p-10
      "
    >

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Create Lead
        </h1>

        <p className="text-slate-500 mt-2">
          Add a new prospect to your CRM pipeline.
        </p>

      </div>

      <form
        action={createLead}
        className="space-y-6"
      >

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <label className="block mb-2 font-medium">
              First Name
            </label>

            <input
              required
              name="firstName"
              placeholder="John"
              className="
              w-full
              h-14
              border
              rounded-2xl
              px-4
              outline-none
              focus:ring-2
              focus:ring-blue-500
              "
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Last Name
            </label>

            <input
              required
              name="lastName"
              placeholder="Smith"
              className="
              w-full
              h-14
              border
              rounded-2xl
              px-4
              outline-none
              focus:ring-2
              focus:ring-blue-500
              "
            />

          </div>

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Email Address
          </label>

          <input
            required
            type="email"
            name="email"
            placeholder="john@example.com"
            className="
            w-full
            h-14
            border
            rounded-2xl
            px-4
            outline-none
            focus:ring-2
            focus:ring-blue-500
            "
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Phone Number
          </label>

          <input
            required
            name="phone"
            placeholder="+1 (555) 123-4567"
            className="
            w-full
            h-14
            border
            rounded-2xl
            px-4
            outline-none
            focus:ring-2
            focus:ring-blue-500
            "
          />

        </div>

        <div className="flex gap-4 pt-4">

          <button
            type="submit"
            className="
            px-8
            py-4
            bg-blue-600
            hover:bg-blue-700
            text-white
            rounded-2xl
            font-medium
            transition
            "
          >
            Save Lead
          </button>

          <a
            href="/leads"
            className="
            px-8
            py-4
            border
            rounded-2xl
            font-medium
            hover:bg-slate-50
            transition
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