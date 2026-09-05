import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";
import { Prisma } from "@prisma/client";
import Link from "next/link";

import { redirect } from "next/navigation";

import {
  canView,
  canCreate,
  canEdit,
  canDelete,
} from "@/shared/lib/permissions";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    active?: string;
  }>;
}

export default async function CrewPage({
  searchParams,
}: PageProps) {

  const {
    search = "",
    active = "",
  } = await searchParams;

  const session =
    await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
  where: {
    email: session.user.email!,
  },
  include: {
    organizationRole: {
      include: {
        permissions: true,
      },
    },
  },
});

if (!dbUser) {
  redirect("/login");
}

const permissions =
  dbUser.organizationRole?.permissions ?? [];

const isOwner =
  dbUser.organizationRole?.name === "Owner";

if (!canView(permissions, "Crew", isOwner)) {
  redirect("/unauthorized");
}

const orgId = dbUser.orgId;

if (!orgId) {
  redirect("/welcome");
}

  const where: Prisma.CrewMemberWhereInput = {
  orgId,

  ...(search && {
    OR: [
      {
        name: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      },
      {
        email: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      },
      {
        phone: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      },
      {
        role: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      },
    ],
  }),

  ...(active !== ""
    ? {
        active: active === "true",
      }
    : {}),
};

  const [

    crew,

    totalCrew,

    activeCrew,

    inactiveCrew,

  ] = await Promise.all([

    prisma.crewMember.findMany({

      where,

      include: {

        assignments: {

          select: {
            id: true,
          },

        },

      },

      orderBy: {

        name: "asc",

      },

    }),

    prisma.crewMember.count({

      where: {
        orgId,
      },

    }),

    prisma.crewMember.count({

      where: {

        orgId,

        active: true,

      },

    }),

    prisma.crewMember.count({

      where: {

        orgId,

        active: false,

      },

    }),

  ]);

  const assignedCrew =
    crew.filter(
      (member) =>
        member.assignments.length > 0
    ).length;
      return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Crew
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your field crew members.
          </p>

        </div>

      {canCreate(permissions, "Crew", isOwner) && (
  <Link
    href="/crew/create"
    className="rounded-xl bg-orange-500 px-6 py-3 font-medium text-white hover:bg-orange-600"
  >
    New Crew Member
  </Link>
)}

      </div>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Total Crew
          </p>

          <h2 className="mt-3 text-5xl font-bold">
            {totalCrew}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Active
          </p>

          <h2 className="mt-3 text-5xl font-bold text-green-600">
            {activeCrew}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Inactive
          </p>

          <h2 className="mt-3 text-5xl font-bold text-red-600">
            {inactiveCrew}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Assigned
          </p>

          <h2 className="mt-3 text-5xl font-bold text-blue-600">
            {assignedCrew}
          </h2>

        </div>

      </div>

      <form
        className="flex flex-col gap-4 lg:flex-row"
      >

        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search crew..."
          className="flex-1 rounded-xl border px-5 py-3"
        />

        <select
          name="active"
          defaultValue={active}
          className="rounded-xl border px-5 py-3"
        >

          <option value="">
            All Members
          </option>

          <option value="true">
            Active
          </option>

          <option value="false">
            Inactive
          </option>

        </select>

        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800"
        >
          Search
        </button>

      </form>

      <div className="overflow-hidden rounded-3xl border bg-white">

        <table className="min-w-full">

          <thead className="border-b bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">
                Name
              </th>

              <th className="px-6 py-4 text-left">
                Role
              </th>

              <th className="px-6 py-4 text-left">
                Contact
              </th>

              <th className="px-6 py-4 text-center">
                Jobs
              </th>

              <th className="px-6 py-4 text-center">
                Status
              </th>

              <th className="px-6 py-4 text-left">
                Created
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {crew.length === 0 && (

              <tr>

                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No crew members found.
                </td>

              </tr>

            )}
                        {crew.map((member) => (

              <tr
                key={member.id}
                className="border-b last:border-b-0 hover:bg-slate-50"
              >

                <td className="px-6 py-4">

                  <div>

                    <Link
                      href={`/crew/${member.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {member.name}
                    </Link>

                    {member.email && (

                      <div className="mt-1 text-sm text-slate-500">

                        {member.email}

                      </div>

                    )}

                  </div>

                </td>

                <td className="px-6 py-4">

                  {member.role}

                </td>

                <td className="px-6 py-4">

                  <div className="space-y-1">

                    <div>

                      {member.phone ?? "-"}

                    </div>

                    {!member.phone && !member.email && (

                      <span className="text-slate-400">

                        No contact information

                      </span>

                    )}

                  </div>

                </td>

                <td className="px-6 py-4 text-center">

                  <span className="inline-flex min-w-[40px] justify-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">

                    {member.assignments.length}

                  </span>

                </td>

                <td className="px-6 py-4 text-center">

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                      member.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {member.active
                      ? "Active"
                      : "Inactive"}
                  </span>

                </td>

                <td className="px-6 py-4">

                  {member.createdAt.toLocaleDateString()}

                </td>

                <td className="px-6 py-4">

                  <div className="flex items-center justify-end gap-4">

                    <Link
                      href={`/crew/${member.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      View
                    </Link>

                   {canEdit(permissions, "Crew", isOwner) && (
  <Link
    href={`/crew/${member.id}/edit`}
    className="font-medium text-orange-600 hover:underline"
  >
    Edit
  </Link>
)}
{canDelete(permissions, "Crew", isOwner) && (
  <Link
    href={`/crew/${member.id}/delete`}
    className="font-medium text-red-600 hover:underline"
  >
    Delete
  </Link>
)}

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}