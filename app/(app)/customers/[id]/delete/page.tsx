import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"
import { redirect, notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function Page({
  params,
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

  const customer = await prisma.customer.findFirst({
    where: {
      id,
      orgId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      companyName: true,
    },
  })

  if (!customer) {
    notFound()
  }

 async function deleteCustomer() {
  "use server"

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const customerToDelete =
    await prisma.customer.findFirst({
      where: {
        id,
        orgId
      }
    })

  if (!customerToDelete) {
    notFound()
  }

  await prisma.customer.delete({
    where: {
      id: customerToDelete.id
    }
  })

  redirect("/customers")
}

  return (
    <div className="max-w-2xl mx-auto space-y-8">

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

        <h1 className="text-4xl font-bold text-red-600">
          Delete Customer
        </h1>

        <p className="text-slate-500 mt-2">
          This action cannot be undone.
        </p>

      </div>

      <div
        className="
        bg-white
        border
        border-red-200
        rounded-3xl
        p-8
        shadow-sm
        space-y-6
        "
      >

        <div>

          <p className="text-sm text-slate-500">
            Customer
          </p>

          <p className="text-xl font-semibold">
            {customer.firstName} {customer.lastName}
          </p>

        </div>

        <div>

          <p className="text-sm text-slate-500">
            Company
          </p>

          <p>
            {customer.companyName || "-"}
          </p>

        </div>

        <div>

          <p className="text-sm text-slate-500">
            Email
          </p>

          <p>
            {customer.email || "-"}
          </p>

        </div>

        <div
          className="
          rounded-2xl
          bg-red-50
          border
          border-red-200
          p-5
          text-red-700
          "
        >
          Deleting this customer will permanently remove the customer record.
        </div>

        <form action={deleteCustomer}>

          <div className="flex gap-4">

            <Link
              href={`/customers/${customer.id}`}
              className="
              flex-1
              text-center
              border
              rounded-xl
              py-3
              hover:bg-slate-50
              "
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="
              flex-1
              rounded-xl
              bg-red-600
              text-white
              py-3
              hover:bg-red-700
              "
            >
              Delete Customer
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}