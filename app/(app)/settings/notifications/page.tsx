import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function NotificationSettingsPage() {

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

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
      p => p.module === "Notifications"
    )

  if (
    !isOwner &&
    !permission?.canView
  ) {
    redirect("/dashboard")
  }


  return (

    <div className="max-w-5xl space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Notifications
        </h1>

        <p className="text-slate-500 mt-2">
          Control how notifications are delivered.
        </p>

<div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-5">

  <h3 className="font-semibold text-orange-700">
    Notification Preferences
  </h3>

  <p className="mt-2 text-sm text-slate-600">
    Notification preferences are managed by your organization and
    will become configurable in a future release. Default notification
    settings are currently applied automatically.
  </p>

</div>


      </div>

      <div className="bg-white border rounded-3xl p-8">

        <div className="space-y-6">

          <label className="flex justify-between">

            <span>Email Notifications</span>

           <input
  type="checkbox"
  checked
  disabled
  className="h-5 w-5 cursor-not-allowed"
/>

          </label>

          <label className="flex justify-between">

            <span>SMS Notifications</span>
<input
  type="checkbox"
  checked
  disabled
  className="h-5 w-5 cursor-not-allowed"
/>

          </label>

          <label className="flex justify-between">

            <span>Lead Alerts</span>

            <input
  type="checkbox"
  checked
  disabled
  className="h-5 w-5 cursor-not-allowed"
/>

          </label>

          <label className="flex justify-between">

            <span>Invoice Alerts</span>

            <input
  type="checkbox"
  checked
  disabled
  className="h-5 w-5 cursor-not-allowed"
/>

          </label>

        </div>

      </div>

    </div>

  )

}