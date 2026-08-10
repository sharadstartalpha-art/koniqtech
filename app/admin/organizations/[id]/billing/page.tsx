import Link from "next/link";
import { notFound } from "next/navigation";
import { Prisma } from "@prisma/client";

import prisma from "@/shared/lib/prisma";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(
  date: Date | null | undefined
) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  ).format(date);
}

function formatDateTime(
  date: Date | null | undefined
) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(date);
}

function formatMoney(
  amount:
    | Prisma.Decimal
    | number
    | string
    | null
    | undefined
) {
  if (
    amount === null ||
    amount === undefined
  ) {
    return "$0.00";
  }

  return `$${Number(amount).toFixed(2)}`;
}

function formatStatus(
  status: string | null | undefined
) {
  if (!status) {
    return "Unknown";
  }

  return status
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (char) => char.toUpperCase()
    );
}

function statusClass(
  status: string | null | undefined
) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";

    case "trial":
      return "bg-blue-100 text-blue-700";

    case "canceled":
      return "bg-red-100 text-red-700";

    case "expired":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}



export default async function BillingPage({
  params,
}: Props) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  /*
   * Get the organization and its real
   * subscription.
   */
  const organization =
    await prisma.organization.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        name: true,
        email: true,
        crmType: true,
        plan: true,
        active: true,
        subscriptionEndsAt: true,
        usersLimit: true,

        subscriptions: true,
      },
    });

  if (!organization) {
    notFound();
  }

  /*
   * Get invoices separately.
   *
   * This means the billing page still works
   * even when the organization has no invoices.
   */
  const invoices =
    await prisma.invoice.findMany({
      where: {
        orgId: organization.id,
      },

      select: {
        id: true,
        customerId: true,
        total: true,
        status: true,
        createdAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  /*
   * Real subscription record.
   */
  const subscription =
    organization.subscriptions;

  const expiryDate =
    subscription?.renewAt ??
    organization.subscriptionEndsAt ??
    null;

  const now = new Date();

 const isActive =
  Boolean(
    subscription &&
      subscription.status === "active" &&
      expiryDate &&
      expiryDate > now
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-10">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <div className="mb-3 text-sm text-slate-500">
            Admin / Organizations /{" "}
            {organization.name} / Billing
          </div>

          <h1 className="text-4xl font-bold text-slate-900">
            Billing
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Subscription and billing information
            for{" "}
            <span className="font-semibold text-slate-700">
              {organization.name}
            </span>
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/admin/organizations/${id}`}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Back to Organization
          </Link>

          <Link
            href={`/admin/organizations/${id}/users`}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Users
          </Link>
        </div>
      </div>

      {/* ================================================= */}
      {/* BILLING SUMMARY */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* PLAN */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Current Plan
          </p>

          <p className="mt-2 text-2xl font-bold capitalize text-slate-900">
            {subscription?.plan ??
              organization.plan}
          </p>

          {subscription && (
            <p className="mt-1 text-sm text-slate-500">
              {formatMoney(
                subscription.amount
              )}
              /month
            </p>
          )}
        </div>

        {/* STATUS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Subscription Status
          </p>

          <div className="mt-3">
            <span
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${statusClass(
                subscription?.status
              )}`}
            >
              {subscription
                ? formatStatus(
                    subscription.status
                  )
                : "No Subscription"}
            </span>
          </div>

          <p
            className={`mt-3 text-sm font-medium ${
              isActive
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {isActive
              ? "Access Active"
              : "Access Expired"}
          </p>
        </div>

        {/* EXPIRY */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Renewal / Expiry
          </p>

          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatDate(expiryDate)}
          </p>

          {subscription?.renewAt && (
            <p className="mt-1 text-xs text-slate-500">
              Renewal date
            </p>
          )}
        </div>

        {/* PROVIDER */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Billing Provider
          </p>

          <p className="mt-2 text-xl font-bold capitalize text-slate-900">
            {subscription?.provider ??
              "—"}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {subscription
              ? "Subscription record"
              : "No active subscription"}
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* SUBSCRIPTION DETAILS */}
      {/* ================================================= */}

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-7 py-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Subscription Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current billing configuration for this
            organization.
          </p>
        </div>

        {subscription ? (
          <div className="grid grid-cols-1 gap-6 p-7 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Plan
              </p>

              <p className="mt-2 font-semibold capitalize text-slate-900">
                {subscription.plan}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Price
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {formatMoney(
                  subscription.amount
                )}{" "}
                / month
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Billing Cycle
              </p>

              <p className="mt-2 font-semibold capitalize text-slate-900">
                {subscription.billingCycle}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Currency
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {subscription.currency}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                User Limit
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {subscription.userLimit}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Storage Limit
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {subscription.storageLimit}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                AI Credits
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {subscription.aiCredits}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Next Invoice
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {formatDate(
                  subscription.nextInvoiceDate
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Renewal
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {formatDate(
                  subscription.renewAt
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Cancel at Period End
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {subscription.cancelAtPeriodEnd
                  ? "Yes"
                  : "No"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                External Customer
              </p>

              <p className="mt-2 break-all text-sm font-medium text-slate-700">
                {subscription.customerId ??
                  "Admin Managed"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Subscription ID
              </p>

              <p className="mt-2 break-all text-xs text-slate-600">
                {subscription.id}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-10 text-center">
            <div className="text-lg font-semibold text-slate-900">
              No subscription found
            </div>

            <p className="mt-2 text-sm text-slate-500">
              This organization has not been
              granted a subscription yet.
            </p>

            <Link
              href={`/admin/organizations/${id}`}
              className="mt-5 inline-block rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Grant Subscription
            </Link>
          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* INVOICES */}
      {/* ================================================= */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-7 py-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Invoice History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Invoices associated with this
            organization.
          </p>
        </div>

        {invoices.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-lg font-semibold text-slate-900">
              No invoices yet
            </div>

            <p className="mt-2 text-sm text-slate-500">
              No invoice records have been created
              for this organization.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Invoice
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody>
                {invoices.map(
                  (invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-t border-slate-100"
                    >
                      <td className="px-6 py-5">
                        <span className="font-medium text-slate-900">
                          {invoice.id.slice(
                            0,
                            8
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {invoice.customerId}
                      </td>

                      <td className="px-6 py-5 font-semibold text-slate-900">
                        {formatMoney(
                          invoice.total
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                          {formatStatus(
                            String(
                              invoice.status
                            )
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {formatDateTime(
                          invoice.createdAt
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* ADMIN ACTION */}
      {/* ================================================= */}

      <div className="rounded-3xl border border-blue-200 bg-blue-50 p-7">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h3 className="font-semibold text-slate-900">
              Manage Subscription
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Change the organization's plan or
              extend its access from the
              organization administration page.
            </p>
          </div>

          <Link
            href={`/admin/organizations/${id}`}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Manage Plan
          </Link>
        </div>
      </div>
    </div>
  );
}