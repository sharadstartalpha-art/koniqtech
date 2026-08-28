import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  Prisma,
  SubscriptionPlan,
  SubscriptionStatus,
} from "@prisma/client";

import prisma from "@/shared/lib/prisma";

export const dynamic = "force-dynamic";

/* =========================================================
   PLAN CONFIGURATION
   ========================================================= */

const PLAN_CONFIG: Record<
  SubscriptionPlan,
  {
    label: string;
    amount: number;
    userLimit: number;
    storageLimit: number;
    aiCredits: number;
  }
> = {
  starter: {
    label: "Starter",
    amount: 99,
    userLimit: 5,
    storageLimit: 20,
    aiCredits: 1000,
  },

  professional: {
    label: "Professional",
    amount: 199,
    userLimit: 15,
    storageLimit: 100,
    aiCredits: 5000,
  },

  enterprise: {
    label: "Enterprise",
    amount: 499,
    userLimit: 50,
    storageLimit: 500,
    aiCredits: 20000,
  },
};

/* =========================================================
   SERVER ACTION
   ========================================================= */

async function grantSubscription(
  formData: FormData
) {
  "use server";

  const orgId =
    String(
      formData.get("orgId") ?? ""
    ).trim();

  const planValue =
    String(
      formData.get("plan") ?? ""
    ).trim();

  const duration =
  String(
    formData.get("duration") ?? "1mo"
  ).trim();

const startFromNow =
  formData.get("startFromNow") === "on";


  if (!orgId) {
    throw new Error(
      "Organization ID is required."
    );
  }

  if (
    !Object.values(
      SubscriptionPlan
    ).includes(
      planValue as SubscriptionPlan
    )
  ) {
    throw new Error(
      "Invalid subscription plan."
    );
  }

  

  const plan =
    planValue as SubscriptionPlan;

  const planConfig =
    PLAN_CONFIG[plan];

  /*
   * Confirm organization exists.
   */
  const organization =
    await prisma.organization.findUnique({
      where: {
        id: orgId,
      },

      select: {
        id: true,
        active: true,
        subscriptionEndsAt: true,
      },
    });

  if (!organization) {
    throw new Error(
      "Organization not found."
    );
  }

  /*
   * If the existing subscription is still active,
   * extend from its current expiry.
   *
   * If it is expired / missing, start from now.
   */
  const now = new Date();

  const existingEnd =
  organization.subscriptionEndsAt;

let baseDate: Date;

if (startFromNow) {
  baseDate = new Date(now);
} else {
  baseDate =
    existingEnd &&
    existingEnd > now
      ? new Date(existingEnd)
      : new Date(now);
}

  const expiresAt =
  new Date(baseDate);

  console.log("Before switch:", duration);
switch (duration) {
  case "15m":
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);
    break;

  case "30m":
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);
    break;

  case "1h":
    expiresAt.setHours(expiresAt.getHours() + 1);
    break;

  case "2h":
    expiresAt.setHours(expiresAt.getHours() + 2);
    break;

  case "6h":
    expiresAt.setHours(expiresAt.getHours() + 6);
    break;

  case "12h":
    expiresAt.setHours(expiresAt.getHours() + 12);
    break;

  case "1d":
    expiresAt.setDate(expiresAt.getDate() + 1);
    break;

  case "2d":
    expiresAt.setDate(expiresAt.getDate() + 2);
    break;

  case "3d":
    expiresAt.setDate(expiresAt.getDate() + 3);
    break;

  case "7d":
    expiresAt.setDate(expiresAt.getDate() + 7);
    break;

  case "15d":
    expiresAt.setDate(expiresAt.getDate() + 15);
    break;

  case "30d":
    expiresAt.setDate(expiresAt.getDate() + 30);
    break;

  case "3mo":
    expiresAt.setMonth(expiresAt.getMonth() + 3);
    break;

  case "6mo":
    expiresAt.setMonth(expiresAt.getMonth() + 6);
    break;

  case "12mo":
    expiresAt.setMonth(expiresAt.getMonth() + 12);
    break;

  case "24mo":
    expiresAt.setMonth(expiresAt.getMonth() + 24);
    break;

  default:
    throw new Error("Invalid subscription duration.");
}

  /*
   * Keep User / Subscription / Organization
   * synchronized in ONE transaction.
   */
  await prisma.$transaction(
    async (tx) => {
      /*
       * Create or update subscription.
       */
      await tx.subscription.upsert({
        where: {
          orgId,
        },

        create: {
          orgId,

          provider: "admin",

          externalId: null,

          customerId: null,

          plan,

          status:
            SubscriptionStatus.active,

          billingCycle: "monthly",

          amount:
            new Prisma.Decimal(
              planConfig.amount
            ),

          currency: "USD",

          renewAt: expiresAt,

          nextInvoiceDate:
            expiresAt,

          trialStart: null,

          trialEnd: null,

          interval: "month",

          cancelAtPeriodEnd: false,

          userLimit:
            planConfig.userLimit,

          storageLimit:
            planConfig.storageLimit,

          aiCredits:
            planConfig.aiCredits,
        },

        update: {
          plan,

          status:
            SubscriptionStatus.active,

          amount:
            new Prisma.Decimal(
              planConfig.amount
            ),

          currency: "USD",

          renewAt: expiresAt,

          nextInvoiceDate:
            expiresAt,

          billingCycle: "monthly",

          interval: "month",

          cancelAtPeriodEnd: false,

          userLimit:
            planConfig.userLimit,

          storageLimit:
            planConfig.storageLimit,

          aiCredits:
            planConfig.aiCredits,
        },
      });

      /*
       * Keep Organization synchronized
       * with Subscription.
       */
      await tx.organization.update({
        where: {
          id: orgId,
        },

        data: {
          plan,

          active: true,

          usersLimit:
            planConfig.userLimit,

          subscriptionEndsAt:
            expiresAt,
        },
      });
    }
  );

  /*
   * Refresh organization pages.
   */
  revalidatePath(
    `/admin/organizations/${orgId}`
  );

  revalidatePath(
    `/admin/organizations/${orgId}/users`
  );

  revalidatePath(
    "/admin/organizations"
  );

  revalidatePath(
    "/admin/subscriptions"
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function formatPlan(
  plan: SubscriptionPlan
) {
  return PLAN_CONFIG[plan]?.label ??
    String(plan);
}

function formatDate(
  date: Date | null
) {
  if (!date) {
    return "No subscription";
  }

   return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatMoney(
  amount: Prisma.Decimal | null
) {
  if (!amount) {
    return "$0.00";
  }

  return `$${Number(amount).toFixed(2)}`;
}

/* =========================================================
   PAGE
   ========================================================= */

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrganizationPage({
  params,
}: Props) {
  const { id } =
    await params;

  if (!id) {
    notFound();
  }

  /*
   * IMPORTANT:
   *
   * The relation in your schema is called
   * `subscriptions`, not `subscription`.
   */
  const organization =
    await prisma.organization.findUnique({
      where: {
        id,
      },

      include: {
        users: {
          orderBy: {
            createdAt: "desc",
          },
        },

        subscriptions: true,
      },
    });

  if (!organization) {
    notFound();
  }

  /*
   * Your schema has a singular Subscription
   * relation named `subscriptions`.
   *
   * It is nullable, not an array.
   */
  const subscription =
    organization.subscriptions;

  /*
   * Use the REAL subscription expiry as
   * the primary source.
   *
   * Fall back to organization.subscriptionEndsAt
   * only for legacy records.
   */
  const expiryDate =
    subscription?.renewAt ??
    organization.subscriptionEndsAt ??
    null;

  const now = new Date();

  const subscriptionActive =
    Boolean(
      subscription &&
        subscription.status ===
          SubscriptionStatus.active &&
        expiryDate &&
        expiryDate > now
    );

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-10">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
        <div>
          <div className="mb-3 text-sm text-slate-500">
            Admin / Organizations /{" "}
            {organization.name}
          </div>

          <h1 className="text-5xl font-bold text-slate-900">
            {organization.name}
          </h1>

          <p className="mt-2 text-slate-500">
            {organization.email}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/admin/organizations/${id}/users`}
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Users
          </Link>

          <Link
            href={`/admin/organizations/${id}/billing`}
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Billing
          </Link>
        </div>
      </div>

      {/* ================================================= */}
      {/* SUMMARY CARDS */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        {/* CRM */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">
            CRM
          </p>

          <h2 className="mt-2 text-2xl font-bold capitalize text-slate-900">
            {String(
              organization.crmType
            )}
          </h2>
        </div>

        {/* PLAN */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">
            Plan
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            {subscription
              ? formatPlan(
                  subscription.plan
                )
              : formatPlan(
                  organization.plan
                )}
          </h2>

          {subscription && (
            <p className="mt-2 text-sm text-slate-500">
              {formatMoney(
                subscription.amount
              )}
              /month
            </p>
          )}
        </div>

        {/* USERS */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">
            Users
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            {organization.users.length}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Limit:{" "}
            {subscription?.userLimit ??
              organization.usersLimit}
          </p>
        </div>

        {/* EXPIRES */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">
            Expires
          </p>

          <h2 className="mt-2 font-bold text-slate-900">
            {formatDate(expiryDate)}
          </h2>

          {expiryDate &&
            expiryDate > now && (
              <p className="mt-2 text-sm text-green-600">
                Active until expiry
              </p>
            )}
        </div>

        {/* STATUS */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">
            Status
          </p>

          <h2
            className={
              subscriptionActive
                ? "mt-2 font-bold text-green-600"
                : "mt-2 font-bold text-red-600"
            }
          >
            {subscriptionActive
              ? "ACTIVE"
              : "EXPIRED"}
          </h2>

          {subscription && (
            <p className="mt-2 text-xs capitalize text-slate-500">
              {String(
                subscription.status
              )}
            </p>
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* GRANT / CHANGE SUBSCRIPTION */}
      {/* ================================================= */}

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900">
            {subscription
              ? "Change Subscription"
              : "Grant Subscription"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Select a plan and duration. This
            updates the organization's real
            subscription record.
          </p>
        </div>

        <form
          action={grantSubscription}
          className="grid gap-4 md:grid-cols-[1fr_1fr_auto]"
        >
          <input
            type="hidden"
            name="orgId"
            value={organization.id}
          />

          {/* PLAN */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Subscription Plan
            </label>

            <select
              name="plan"
              defaultValue={
                subscription?.plan ??
                organization.plan
              }
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="starter">
                Starter — $99/month
              </option>

              <option value="professional">
                Professional — $199/month
              </option>

              <option value="enterprise">
                Enterprise — $499/month
              </option>
            </select>
          </div>

          {/* DURATION */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Duration
            </label>

            <select
              name="duration"
              defaultValue="1mo"
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
             <option value="15m">15 Minutes</option>
<option value="30m">30 Minutes</option>

<option value="1h">1 Hour</option>
<option value="2h">2 Hours</option>
<option value="6h">6 Hours</option>
<option value="12h">12 Hours</option>

<option value="1d">1 Day</option>
<option value="2d">2 Days</option>
<option value="3d">3 Days</option>
<option value="7d">7 Days</option>
<option value="15d">15 Days</option>
<option value="30d">30 Days</option>

<option value="1mo">1 Month</option>
<option value="3mo">3 Months</option>
<option value="6mo">6 Months</option>
<option value="12mo">12 Months</option>
<option value="24mo">24 Months</option>
            </select>
          </div>

          {/* ACTION */}
          <div className="flex items-center mt-8">
  <input
    id="startFromNow"
    name="startFromNow"
    type="checkbox"
    className="h-4 w-4 rounded border-slate-300"
  />

  <label
    htmlFor="startFromNow"
    className="ml-2 text-sm text-slate-700"
  >
    Start from current time (Testing)
  </label>
</div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              {subscription
                ? "Change Plan"
                : "Grant Access"}
            </button>
          </div>
        </form>

        {/* Current subscription information */}
        {subscription && (
          <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-4">
            <div>
              <p className="text-xs text-slate-500">
                Current Plan
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {formatPlan(
                  subscription.plan
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Price
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {formatMoney(
                  subscription.amount
                )}
                /month
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Status
              </p>

              <p className="mt-1 font-semibold capitalize text-slate-900">
                {String(
                  subscription.status
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Renewal / Expiry
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {formatDate(
                  subscription.renewAt
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* USERS */}
      {/* ================================================= */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Users
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Users belonging only to this
                organization.
              </p>
            </div>

            <Link
              href={`/admin/organizations/${id}/users`}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              View All Users
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Name
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Role
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {organization.users.length ===
              0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No users assigned to this
                    organization.
                  </td>
                </tr>
              ) : (
                organization.users.map(
                  (user) => (
                    <tr
                      key={user.id}
                      className="border-t border-slate-100"
                    >
                      <td className="px-6 py-5 font-medium text-slate-900">
                        {user.name}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {user.email}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                         user.organizationRole?.name.replaceAll("_", " ") ?? "No Role"
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {user.status ===
                        "active" ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                            {user.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}