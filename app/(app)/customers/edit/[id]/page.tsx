import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"
import {
  notFound,
  redirect
} from "next/navigation"

export const dynamic = "force-dynamic"

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>
}) {

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const { id } = await params

  const customer =
    await prisma.customer.findFirst({

      where: {
        id,
        orgId
      }

    })

  if (!customer) {
    notFound()
  }

  return (

    <div className="max-w-5xl mx-auto space-y-8">

      <div>

        <Link
          href={`/customers/${customer.id}`}
          className="
          inline-flex
          items-center
          gap-2
          text-slate-500
          hover:text-orange-600
          mb-5
          "
        >
          ← Back to Customer
        </Link>

        <h1 className="text-4xl font-bold">
          Edit Customer
        </h1>

        <p className="text-slate-500 mt-2">
          Update customer information.
        </p>

      </div>

      <form
        action={`/api/customers/${customer.id}`}
        method="POST"
        className="
        bg-white
        border
        rounded-3xl
        p-8
        space-y-8
        "
      >

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="block mb-2 font-medium">
              First Name
            </label>

            <input
              name="firstName"
              defaultValue={customer.firstName ?? ""}
              className="w-full border rounded-xl p-4"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Last Name
            </label>

            <input
              name="lastName"
              defaultValue={customer.lastName ?? ""}
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
              defaultValue={customer.email ?? ""}
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Phone
            </label>

            <input
              name="phone"
              defaultValue={customer.phone ?? ""}
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Company
            </label>

            <input
              name="companyName"
              defaultValue={customer.companyName ?? ""}
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Status
            </label>

            <select
              name="status"
              defaultValue={customer.status}
              className="w-full border rounded-xl p-4"
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
              defaultValue={customer.source ?? ""}
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
            defaultValue={customer.address ?? ""}
            rows={4}
            className="w-full border rounded-xl p-4"
          />
        </div>

        <div className="flex gap-4">

          <button
            type="submit"
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

          <Link
            href={`/customers/${customer.id}`}
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

  )

}