import Link from "next/link";
import {
  Prisma,
  SubscriptionPlan,
  UserRole,
} from "@prisma/client";

import prisma from "@/shared/lib/prisma";

import CreateUserForm from "@/components/admin/developer-tools/CreateUserForm";

export const dynamic = "force-dynamic";

type UsersPageProps = {
  searchParams: Promise<{
    q?: string;
    role?: string;
    status?: string;
    orgId?: string;
    page?: string;
  }>;
};

const LIMIT = 15;

const CUSTOMER_ROLES: UserRole[] = [
  UserRole.owner,
  UserRole.manager,
  UserRole.sales,
  UserRole.dispatcher,
  UserRole.technician,
  UserRole.crew,
  UserRole.accountant,
];

function formatRole(role: UserRole) {
  return role
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

function formatPlan(
  plan: SubscriptionPlan | null
) {
  if (!plan) {
    return "No Plan";
  }

  return plan
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

function formatDate(
  date: Date | null
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
  date: Date | null
) {
  if (!date) {
    return "Never";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(date);
}

export default async function UsersPage({
  searchParams,
}: UsersPageProps) {
  const params = await searchParams;

  const q =
    typeof params.q === "string"
      ? params.q.trim()
      : "";

  const role =
    typeof params.role === "string"
      ? params.role
      : "";

  const status =
    typeof params.status === "string"
      ? params.status
      : "";

  const orgId =
    typeof params.orgId === "string"
      ? params.orgId
      : "";

  const parsedPage = Number(
    params.page ?? "1"
  );

  const page =
    Number.isFinite(parsedPage) &&
    parsedPage > 0
      ? Math.floor(parsedPage)
      : 1;

  const where: Prisma.UserWhereInput = {};

  if (q) {
    where.OR = [
      {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: q,
          mode: "insensitive",
        },
      },
    ];
  }

  if (
    role &&
    CUSTOMER_ROLES.includes(
      role as UserRole
    )
  ) {
    where.role = role as UserRole;
  }

  if (status) {
    where.status = status;
  }

  if (orgId) {
    where.orgId = orgId;
  }

  /*
   * Load everything from the real database.
   *
   * IMPORTANT:
   * The Organization -> Subscription relation
   * in your schema is called `subscriptions`.
   */
  const [
    users,
    total,
    activeUsers,
    organizations,
  ] = await Promise.all([
    prisma.user.findMany({
      where,

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        lastLogin: true,
        lastSeen: true,
        emailVerified: true,
        createdAt: true,

        organization: {
          select: {
            id: true,
            name: true,
            crmType: true,
            plan: true,
            active: true,

            subscriptions: {
              select: {
                id: true,
                plan: true,
                status: true,
                amount: true,
                currency: true,
                billingCycle: true,
                renewAt: true,
                cancelAtPeriodEnd: true,
                userLimit: true,
                storageLimit: true,
                aiCredits: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      skip: (page - 1) * LIMIT,

      take: LIMIT,
    }),

    prisma.user.count({
      where,
    }),

    prisma.user.count({
      where: {
        ...where,
        status: "active",
      },
    }),

    prisma.organization.findMany({
      where: {
        active: true,
      },

      select: {
        id: true,
        name: true,
        crmType: true,
        plan: true,
        active: true,
      },

      orderBy: {
        name: "asc",
      },
    }),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(total / LIMIT)
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  function buildUrl(
    targetPage: number
  ) {
    const search =
      new URLSearchParams();

    if (q) {
      search.set("q", q);
    }

    if (role) {
      search.set("role", role);
    }

    if (status) {
      search.set("status", status);
    }

    if (orgId) {
      search.set("orgId", orgId);
    }

    search.set(
      "page",
      String(targetPage)
    );

    return `?${search.toString()}`;
  }

  return (
    <div className="space-y-6 p-6">
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="mb-2 text-sm text-slate-500">
            Admin / Developer Tools / Users
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Users
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage CRM users, roles,
            organizations and subscriptions.
          </p>
        </div>

        <CreateUserForm
          organizations={organizations.map(
            (organization) => ({
              id: organization.id,
              name: organization.name,
              crmType:
                String(
                  organization.crmType
                ),
              plan:
                String(
                  organization.plan
                ),
              active:
                organization.active,
            })
          )}
        />
      </div>

      {/* ===================================================== */}
      {/* STATISTICS */}
      {/* ===================================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Users
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {total}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Active Users
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {activeUsers}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Organizations
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {organizations.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Showing
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {users.length}
          </p>
        </div>
      </div>

      {/* ===================================================== */}
      {/* FILTERS */}
      {/* ===================================================== */}

      <form
        method="GET"
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="grid gap-3 md:grid-cols-4">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name or email..."
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <select
            name="role"
            defaultValue={role}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              All Roles
            </option>

            {CUSTOMER_ROLES.map(
              (customerRole) => (
                <option
                  key={customerRole}
                  value={customerRole}
                >
                  {formatRole(
                    customerRole
                  )}
                </option>
              )
            )}
          </select>

          <select
            name="status"
            defaultValue={status}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              All Statuses
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>

            <option value="invited">
              Invited
            </option>

            <option value="suspended">
              Suspended
            </option>
          </select>

          <select
            name="orgId"
            defaultValue={orgId}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              All Organizations
            </option>

            {organizations.map(
              (organization) => (
                <option
                  key={organization.id}
                  value={organization.id}
                >
                  {organization.name}
                </option>
              )
            )}
          </select>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Search
          </button>

          <Link
            href="/admin/developer-tools/users"
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Reset
          </Link>
        </div>
      </form>

      {/* ===================================================== */}
      {/* TABLE */}
      {/* ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  User
                </th>

                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  Organization
                </th>

                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  CRM
                </th>

                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  Role
                </th>

                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  Status
                </th>

                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  Subscription
                </th>

                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  Last Login
                </th>

                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  Created
                </th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-16 text-center"
                  >
                    <div className="text-lg font-semibold text-slate-900">
                      No users found
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your filters
                      or create a new user.
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const subscription =
                    user.organization
                      .subscriptions;

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >
                      {/* USER */}
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                            {user.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <div className="font-semibold text-slate-900">
                              {user.name}
                            </div>

                            <div className="text-xs text-slate-500">
                              {user.email}
                            </div>

                            {user.phone && (
                              <div className="text-xs text-slate-400">
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* ORGANIZATION */}
                      <td className="px-5 py-5">
                        <div className="font-medium text-slate-900">
                          {
                            user
                              .organization
                              .name
                          }
                        </div>

                        <div className="mt-1 text-xs">
                          {user.organization
                            .active ? (
                            <span className="text-green-600">
                              Active
                            </span>
                          ) : (
                            <span className="text-red-600">
                              Inactive
                            </span>
                          )}
                        </div>
                      </td>

                      {/* CRM */}
                      <td className="px-5 py-5">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                          {String(
                            user.organization
                              .crmType
                          )}
                        </span>
                      </td>

                      {/* ROLE */}
                      <td className="px-5 py-5">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {formatRole(
                            user.role
                          )}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-5">
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

                      {/* SUBSCRIPTION */}
                      <td className="px-5 py-5">
                        {subscription ? (
                          <div>
                            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                              {formatPlan(
                                subscription.plan
                              )}
                            </span>

                            <div className="mt-2 text-xs text-slate-500">
                              $
                              {subscription.amount.toString()}
                              {" / "}
                              {String(
                                subscription.billingCycle
                              )}
                            </div>

                            {subscription.renewAt && (
                              <div className="mt-1 text-xs text-slate-400">
                                Renews{" "}
                                {formatDate(
                                  subscription.renewAt
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            No subscription
                          </span>
                        )}
                      </td>

                      {/* LAST LOGIN */}
                      <td className="px-5 py-5 text-slate-600">
                        {formatDateTime(
                          user.lastLogin
                        )}
                      </td>

                      {/* CREATED */}
                      <td className="px-5 py-5 text-slate-600">
                        {formatDate(
                          user.createdAt
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* =================================================== */}
        {/* PAGINATION */}
        {/* =================================================== */}

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
          <div className="text-sm text-slate-500">
            Page{" "}
            <span className="font-semibold text-slate-900">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {totalPages}
            </span>

            <span className="ml-2">
              ({total} users)
            </span>
          </div>

          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={buildUrl(
                  currentPage - 1
                )}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Previous
              </Link>
            )}

            {currentPage <
              totalPages && (
              <Link
                href={buildUrl(
                  currentPage + 1
                )}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}