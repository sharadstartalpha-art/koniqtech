import prisma from "@/shared/lib/prisma";

export const dynamic = "force-dynamic";

function formatMoney(
  amount: unknown
) {
  return `$${Number(amount).toFixed(2)}`;
}

export default async function PlansPage() {
  const plans =
    await prisma.plan.findMany({
      where: {
        active: true,
      },

      orderBy: {
        sortOrder: "asc",
      },
    });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Platform
          </p>

          <h1 className="mt-1 text-4xl font-bold text-slate-900">
            Plans
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Manage the subscription plans available
            to KoniqTech organizations.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-600">
          {plans.length} active{" "}
          {plans.length === 1
            ? "plan"
            : "plans"}
        </div>
      </div>

      {/* Empty state */}
      {plans.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            No plans configured
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Create a plan in the database before
            offering subscriptions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* Plan header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    {plan.name}
                  </h2>

                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                    {plan.code}
                  </p>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Active
                </span>
              </div>

              {/* Price */}
              <div className="mt-7">
                <span className="text-4xl font-bold text-slate-900">
                  {formatMoney(
                    plan.price
                  )}
                </span>

                <span className="ml-2 text-sm text-slate-500">
                  / {plan.billingCycle}
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 min-h-[48px] text-sm leading-6 text-slate-500">
                {plan.description ??
                  "KoniqTech CRM subscription plan."}
              </p>

              {/* Limits */}
              <div className="mt-8 space-y-4 border-t border-slate-100 pt-6">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">
                    Users
                  </span>

                  <span className="font-semibold text-slate-900">
                    {plan.userLimit}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">
                    Storage
                  </span>

                  <span className="font-semibold text-slate-900">
                    {plan.storageLimit} GB
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">
                    AI Credits
                  </span>

                  <span className="font-semibold text-slate-900">
                    {plan.aiCredits.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">
                    Currency
                  </span>

                  <span className="font-semibold text-slate-900">
                    {plan.currency}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 border-t border-slate-100 pt-5">
                <p className="text-xs text-slate-400">
                  Plan ID
                </p>

                <p className="mt-1 break-all text-xs text-slate-500">
                  {plan.id}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}