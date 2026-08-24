import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

async function createCustomer(formData: FormData) {
  "use server"

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const firstName = String(formData.get("firstName") || "").trim()
  const lastName = String(formData.get("lastName") || "").trim()

  if (!firstName) {
    throw new Error("First name is required.")
  }

  
await prisma.customer.create({
  data: {
    orgId,

    firstName,

    lastName: lastName || null,

    email:
      String(formData.get("email") || "").trim() || null,

    phone:
      String(formData.get("phone") || "").trim() || null,

    companyName:
      String(formData.get("companyName") || "").trim() || null,

    address:
      String(formData.get("address") || "").trim() || null,

    status:
      String(formData.get("status") || "active"),

    source:
      String(formData.get("source") || "").trim() || null
  }
})



  redirect("/customers")
}

export default function Page() {
  return (
    <form
      action={createCustomer}
      className="max-w-3xl space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold">
          Create Customer
        </h1>

        <p className="text-slate-500 mt-2">
          Add a new customer to your CRM.
        </p>
      </div>

      <div className="bg-white border rounded-3xl p-8 space-y-6">

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="block mb-2 font-medium">
              First Name *
            </label>

            <input
              name="firstName"
              required
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Last Name
            </label>

            <input
              name="lastName"
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Phone
            </label>

            <input
              name="phone"
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Company
            </label>

            <input
              name="companyName"
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Status
            </label>

            <select
              name="status"
              className="w-full border rounded-xl p-4"
              defaultValue="active"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="vip">VIP</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Source
            </label>

            <input
              name="source"
              defaultValue="manual"
              className="w-full border rounded-xl p-4"
            />
          </div>

        </div>

        <div>
          <label className="block mb-2 font-medium">
            Address
          </label>

          <textarea
            name="address"
            rows={3}
            className="w-full border rounded-xl p-4"
          />
        </div>

       

      </div>

      <div className="flex gap-4">

        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl"
        >
          Create Customer
        </button>

        <a
          href="/customers"
          className="border px-8 py-4 rounded-2xl hover:bg-slate-50"
        >
          Cancel
        </a>

      </div>

    </form>
  )
}