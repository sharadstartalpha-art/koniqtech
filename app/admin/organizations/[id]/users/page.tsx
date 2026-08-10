import Link from "next/link";
import { notFound } from "next/navigation";

import prisma from "@/shared/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrganizationUsersPage({
  params,
}: PageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  /*
   * First make sure the organization actually exists.
   * This also guarantees that the page is tied to
   * the organization from the URL.
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
      },
    });

  if (!organization) {
    notFound();
  }

  /*
   * IMPORTANT:
   * Only users belonging to this organization.
   */
  const users =
    await prisma.user.findMany({
      where: {
        orgId: organization.id,
      },

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        lastLogin: true,
        createdAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-2 text-sm text-slate-500">
            Admin / Organizations /{" "}
            {organization.name} / Users
          </div>

          <h1 className="text-4xl font-bold text-slate-900">
            Tenant Users
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Users belonging to{" "}
            <span className="font-semibold text-slate-700">
              {organization.name}
            </span>
          </p>
        </div>

        <Link
          href={`/admin/organizations/${organization.id}`}
          className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Back to Organization
        </Link>
      </div>

      {/* Organization summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Organization
          </p>

          <p className="mt-2 font-semibold text-slate-900">
            {organization.name}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            CRM
          </p>

          <p className="mt-2 font-semibold capitalize text-slate-900">
            {String(
              organization.crmType
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Plan
          </p>

          <p className="mt-2 font-semibold capitalize text-slate-900">
            {String(
              organization.plan
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Users
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {users.length}
          </p>
        </div>
      </div>

      {/* Users table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            {organization.name} Users
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Only users assigned to this
            organization are displayed.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
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

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Last Login
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Created
                </th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center"
                  >
                    <div className="text-lg font-semibold text-slate-900">
                      No users found
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      This organization does not
                      have any users assigned yet.
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    {/* Name */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                          {user.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <div className="font-semibold text-slate-900">
                            {user.name}
                          </div>

                          {user.phone && (
                            <div className="text-xs text-slate-400">
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {user.email}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-5">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                        {user.role.replaceAll(
                          "_",
                          " "
                        )}
                      </span>
                    </td>

                    {/* Status */}
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

                    {/* Last Login */}
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {user.lastLogin
                        ? new Intl.DateTimeFormat(
                            "en-US",
                            {
                              dateStyle:
                                "medium",
                              timeStyle:
                                "short",
                            }
                          ).format(
                            user.lastLogin
                          )
                        : "Never"}
                    </td>

                    {/* Created */}
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {new Intl.DateTimeFormat(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      ).format(
                        user.createdAt
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}