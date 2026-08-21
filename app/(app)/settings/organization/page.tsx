import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function OrganizationPage(){

  const session = await auth()

if (!session?.user?.orgId) {
  redirect("/login")
}

const orgId = session.user.orgId


  const organization =
    await prisma.organization.findUnique({

      where:{
        id:orgId
      }

    })

  if(!organization){

    return(

      <div>
        Organization not found
      </div>

    )

  }

  return(

    <div className="max-w-5xl space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Organization
        </h1>

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="text-sm text-slate-500">
              Company Name
            </label>

            <div className="mt-2">
              {organization.name}
            </div>

          </div>

          <div>

            <label className="text-sm text-slate-500">
              Industry
            </label>

            <div className="mt-2">
              {organization.industry}
            </div>

          </div>

          <div>

            <label className="text-sm text-slate-500">
              Email
            </label>

            <div className="mt-2">
              {organization.email}
            </div>

          </div>

          <div>

            <label className="text-sm text-slate-500">
              Phone
            </label>

            <div className="mt-2">
              {organization.phone}
            </div>

          </div>

          <div>

            <label className="text-sm text-slate-500">
              Plan
            </label>

            <div className="mt-2">
              {organization.plan}
            </div>

          </div>

          <div>

            <label className="text-sm text-slate-500">
              User Limit
            </label>

            <div className="mt-2">
              {organization.usersLimit}
            </div>

          </div>

        </div>

      </div>

    </div>

  )

}