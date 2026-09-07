import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function BillingPage() {

 const session = await auth()

if (!session?.user) {
  redirect("/signin")
}

const orgId = (session.user as any).orgId

const currentUser = await prisma.user.findUnique({
  where: {
    id: session.user.id,
  },
  include: {
    organizationRole: {
      include: {
        permissions: true,
      },
    },
  },
})

if (!currentUser) {
  redirect("/login")
}

const isOwner =
  currentUser.organizationRole?.name.toLowerCase() ===
  "owner"

const permission =
  currentUser.organizationRole?.permissions.find(
    p => p.module === "Billing"
  )

if (
  !isOwner &&
  !permission?.canView
) {
  redirect("/dashboard")
}

const canEdit =
  isOwner ||
  permission?.canEdit

const organization =
  await prisma.organization.findUnique({
    where: {
      id: orgId,
    },
  })

if (!organization) {
  redirect("/welcome")
}

  return (

    <div className="max-w-5xl space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Billing
        </h1>

        <p className="text-slate-500 mt-2">
          Manage subscription and invoices.
        </p>

      </div>

      <div className="
      bg-white
      border
      rounded-3xl
      p-8
      ">

         <div className="grid md:grid-cols-3 gap-6">
          <div className="
          border
          rounded-2xl
          p-6
          ">

            <div className="text-sm text-slate-500">
              Current Plan
            </div>

            <div className="
            text-2xl
            font-bold
            mt-2
            capitalize
            ">
              {organization.plan}
            </div>

          </div>

          <div className="
          border
          rounded-2xl
          p-6
          ">

            <div className="text-sm text-slate-500">
              User Limit
            </div>

           <div
    className="
    text-2xl
    font-bold
    mt-2
    "
  >
    {organization.plan === "starter"
      ? organization.usersLimit
      : "Unlimited"}
  </div>

          </div>

          <div className="
          border
          rounded-2xl
          p-6
          ">

            <div className="text-sm text-slate-500">
              Subscription Status
            </div>

            <div className="
            text-green-600
            font-semibold
            mt-2
            ">
              Active
            </div>

          </div>

        </div>

      </div>

      <div className="
      bg-white
      border
      rounded-3xl
      p-8
      ">

        <h2 className="
        text-xl
        font-semibold
        mb-6
        ">
          Payment Method
        </h2>

       <div
  className="
  border
  rounded-2xl
  p-5
  flex
  items-center
  justify-between
  "
>
  <span>Stripe Connected</span>

  {canEdit ? (
    <button
      className="
      px-4
      py-2
      rounded-xl
      bg-orange-600
      text-white
      "
    >
      Manage
    </button>
  ) : (
    <button
      disabled
      className="
      px-4
      py-2
      rounded-xl
      bg-slate-100
      text-slate-500
      cursor-not-allowed
      "
    >
      No Permission
    </button>
  )}
</div>
      </div>

    </div>

  )

}