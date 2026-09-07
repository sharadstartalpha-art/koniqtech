import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function EmailTemplatesPage() {

  const session = await auth()

if (!session?.user) {
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
    p => p.module === "Email Templates"
  )

if (
  !isOwner &&
  !permission?.canView
) {
  redirect("/dashboard")
}

const canEdit =
  isOwner ||
  permission?.canEdit === true

  return (

    <div className="max-w-6xl space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Email Templates
        </h1>

        <p className="text-slate-500 mt-2">
          Customize customer communications.
        </p>

       <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-5">
  <h3 className="font-semibold text-orange-700">
    Email Template Management
  </h3>

  <p className="mt-2 text-sm text-slate-600">
    Custom email templates will be available in a future release.
    Standard KoniqTech email templates are currently used for all
    customer communications.
  </p>
</div>

      </div>

      <div className="grid gap-6">

      <TemplateCard
  title="Welcome Email"
  canEdit={canEdit}
/>

<TemplateCard
  title="Quote Sent"
  canEdit={canEdit}
/>

<TemplateCard
  title="Invoice Sent"
  canEdit={canEdit}
/>

<TemplateCard
  title="Job Completed"
  canEdit={canEdit}
/>

      </div>

    </div>

  )

}

function TemplateCard({
  title,
  canEdit,
}:{
  title:string
  canEdit:boolean
}){

  return(

    <div className="
    bg-white
    border
    rounded-3xl
    p-6
    ">

      <div className="
      flex
      items-center
      justify-between
      ">

        <div>

          <h2 className="font-semibold">
            {title}
          </h2>

        </div>

 <button
  type="button"
  disabled
  className={`
    px-4
    py-2
    rounded-xl
    border
    ${
      canEdit
        ? "bg-orange-100 text-orange-600"
        : "bg-slate-100 text-slate-500"
    }
    cursor-not-allowed
  `}
>
  Coming Soon
</button>

      </div>

    </div>

  )

}