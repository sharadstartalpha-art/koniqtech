import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const role = (session.user as any)?.role

  if (role === "super_admin") {
    redirect("/admin/dashboard")
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      email: session.user.email!
    },
    include: {
      organization: true
    }
  })

  if (!dbUser) {
    return <div>User missing</div>
  }

  const [
    leads,
    customers,
    jobs
  ] = await Promise.all([

    prisma.lead.count({
      where: { orgId: dbUser.orgId }
    }),

    prisma.customer.count({
      where: { orgId: dbUser.orgId }
    }),

    prisma.job.count({
      where: { orgId: dbUser.orgId }
    })

  ])

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-6xl font-bold">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Welcome back {dbUser.name}
        </p>

      </div>

      <div className="grid grid-cols-3 gap-6">

        <Card title="Leads" value={leads}/>
        <Card title="Customers" value={customers}/>
        <Card title="Jobs" value={jobs}/>

      </div>

      <div className="bg-white border rounded-3xl p-10">

        <div className="flex justify-between">

          <div>

            <h2 className="text-4xl font-bold">
              Subscription
            </h2>

            <div className="mt-8 space-y-4">

              <p>

                Plan:

                <b className="ml-2">

                  {
                    dbUser.organization?.plan
                    ?? "Free"
                  }

                </b>

              </p>

              <p>

                Expires:

                <b className="ml-2">

                  {

                    dbUser.organization
                    ?.subscriptionEndsAt

                    ?

                    dbUser.organization
                    .subscriptionEndsAt
                    .toDateString()

                    :

                    "No subscription"

                  }

                </b>

              </p>

            </div>

          </div>

          <Link
            href="/billing"
            className="
            bg-black
            text-white
            px-8
            py-4
            rounded-2xl
            h-fit
            "
          >

            Manage Billing

          </Link>

        </div>

      </div>

    </div>

  )

}

function Card({
  title,
  value
}:any){

  return(

    <div className="bg-white border rounded-3xl p-8">

      <p className="text-slate-500">
        {title}
      </p>

      <h2 className="text-6xl font-bold mt-4">
        {value}
      </h2>

    </div>

  )

}