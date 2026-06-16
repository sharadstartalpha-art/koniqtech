import prisma from "@/shared/lib/prisma"

export default async function BillingPage() {

  const organization =
    await prisma.organization.findFirst()

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
              {organization?.plan}
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

            <div className="
            text-2xl
            font-bold
            mt-2
            ">
              {organization?.usersLimit}
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

        <div className="
        border
        rounded-2xl
        p-5
        ">

          Stripe Connected

        </div>

      </div>

    </div>

  )

}