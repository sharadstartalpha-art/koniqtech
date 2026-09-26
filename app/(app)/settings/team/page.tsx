import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import DeleteUserButton from "./DeleteUserButton"

type SearchParams = {
  created?: string
  updated?: string
}

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    redirect("/login")
  }

  /*
   * ------------------------------------------------------------
   * CURRENT USER + PERMISSIONS
   * ------------------------------------------------------------
   */

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
    currentUser.organizationRole?.name?.toLowerCase() ===
    "owner"

  const permission =
    currentUser.organizationRole?.permissions.find(
      (permission) =>
        permission.module === "Team"
    )

  const canViewTeam =
    isOwner || !!permission?.canView

  if (!canViewTeam) {
    redirect("/dashboard")
  }

  const canCreateTeam =
    isOwner || !!permission?.canCreate

  const canEditTeam =
    isOwner || !!permission?.canEdit

  const canDeleteTeam =
    isOwner || !!permission?.canDelete

  /*
   * ------------------------------------------------------------
   * TEAM MEMBERS
   * ------------------------------------------------------------
   *
   * IMPORTANT:
   * orgId is always included.
   *
   * This prevents users from another organization
   * appearing in this directory.
   */

  const users = await prisma.user.findMany({
    where: {
      orgId,
    },
    include: {
      organizationRole: true,

      userLocations: {
        include: {
          location: true,
        },
        orderBy: {
          location: {
            name: "asc",
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  /*
   * ------------------------------------------------------------
   * TOGGLE USER STATUS
   * ------------------------------------------------------------
   */

  async function toggleUserStatus(
    formData: FormData
  ) {
    "use server"

    const id =
      String(formData.get("id") ?? "").trim()

    const status =
      String(formData.get("status") ?? "").trim()

    if (!id) {
      throw new Error("User ID is required.")
    }

    if (
      status !== "active" &&
      status !== "inactive"
    ) {
      throw new Error("Invalid user status.")
    }

    const session = await auth()

    if (!session?.user?.id) {
      redirect("/login")
    }

    const currentUser =
      await prisma.user.findUnique({
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
      currentUser.organizationRole?.name?.toLowerCase() ===
      "owner"

    const permission =
      currentUser.organizationRole?.permissions.find(
        (permission) =>
          permission.module === "Team"
      )

    if (
      !isOwner &&
      !permission?.canEdit
    ) {
      throw new Error("Unauthorized")
    }

    /*
     * Never allow a user to deactivate themselves.
     */

    if (id === currentUser.id) {
      throw new Error(
        "You cannot change your own account status."
      )
    }

    /*
     * Only find target user inside the
     * current organization.
     */

    const targetUser =
      await prisma.user.findFirst({
        where: {
          id,
          orgId: currentUser.orgId,
        },
        include: {
          organizationRole: true,
        },
      })

    if (!targetUser) {
      throw new Error(
        "Team member not found."
      )
    }

    /*
     * Owner cannot be deactivated.
     */

    const targetIsOwner =
      targetUser.organizationRole?.name?.toLowerCase() ===
      "owner"

    if (targetIsOwner) {
      throw new Error(
        "The organization owner cannot be deactivated."
      )
    }

    await prisma.user.update({
      where: {
        id: targetUser.id,
      },
      data: {
        status,
      },
    })

    revalidatePath("/settings/team")

    redirect("/settings/team?updated=1")
  }

  /*
   * ------------------------------------------------------------
   * DELETE USER
   * ------------------------------------------------------------
   */

  async function deleteUser(
    formData: FormData
  ) {
    "use server"

    const id =
      String(formData.get("id") ?? "").trim()

    if (!id) {
      throw new Error("User ID is required.")
    }

    const session = await auth()

    if (!session?.user?.id) {
      redirect("/login")
    }

    const currentUser =
      await prisma.user.findUnique({
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
      currentUser.organizationRole?.name?.toLowerCase() ===
      "owner"

    const permission =
      currentUser.organizationRole?.permissions.find(
        (permission) =>
          permission.module === "Team"
      )

    if (
      !isOwner &&
      !permission?.canDelete
    ) {
      throw new Error("Unauthorized")
    }

    /*
     * Never allow the current user to delete
     * themselves.
     */

    if (id === currentUser.id) {
      throw new Error(
        "You cannot delete your own account."
      )
    }

    /*
     * Organization isolation.
     */

    const user =
      await prisma.user.findFirst({
        where: {
          id,
          orgId: currentUser.orgId,
        },
        include: {
          organizationRole: true,
        },
      })

    if (!user) {
      throw new Error(
        "Team member not found."
      )
    }

    /*
     * Owner protection.
     */

    if (
      user.organizationRole?.name?.toLowerCase() ===
      "owner"
    ) {
      throw new Error(
        "The organization owner cannot be deleted."
      )
    }

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })

    revalidatePath("/settings/team")
  }

  /*
   * ------------------------------------------------------------
   * KPI DATA
   * ------------------------------------------------------------
   */

  const totalUsers = users.length

  const activeUsers =
    users.filter(
      (user) =>
        user.status === "active"
    ).length

  const admins =
    users.filter((user) => {
      const role =
        user.organizationRole?.name?.toLowerCase()

      return (
        role === "owner" ||
        role === "manager"
      )
    }).length

  const salesReps =
    users.filter(
      (user) =>
        user.organizationRole?.name?.toLowerCase() ===
        "sales"
    ).length

  /*
   * ------------------------------------------------------------
   * PAGE
   * ------------------------------------------------------------
   */

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-center justify-between gap-4">

        <div>
          <h1 className="text-4xl font-bold">
            Team Members
          </h1>

          <p className="text-slate-500 mt-1">
            Manage organization users,
            permissions, and location access
          </p>
        </div>

        {canCreateTeam && (
          <Link
            href="/settings/team/new"
            className="
              inline-flex
              items-center
              px-5
              py-3
              bg-orange-600
              text-white
              rounded-2xl
              font-medium
              hover:bg-orange-700
              transition
            "
          >
            + Add Team Member
          </Link>
        )}

      </div>

      {/* Success Messages */}

      {params.created && (
        <div
          className="
            p-4
            rounded-xl
            bg-green-100
            text-green-700
            border
            border-green-200
          "
        >
          Team member created successfully.
        </div>
      )}

      {params.updated && (
        <div
          className="
            p-4
            rounded-xl
            bg-green-100
            text-green-700
            border
            border-green-200
          "
        >
          Team member updated successfully.
        </div>
      )}

      {/* KPI Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-3xl border p-6">
          <p className="text-slate-500 text-sm">
            Total Users
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {totalUsers}
          </h2>
        </div>

        <div className="bg-white rounded-3xl border p-6">
          <p className="text-slate-500 text-sm">
            Active Users
          </p>

          <h2 className="text-4xl font-bold mt-2 text-green-600">
            {activeUsers}
          </h2>
        </div>

        <div className="bg-white rounded-3xl border p-6">
          <p className="text-slate-500 text-sm">
            Admins
          </p>

          <h2 className="text-4xl font-bold mt-2 text-blue-600">
            {admins}
          </h2>
        </div>

        <div className="bg-white rounded-3xl border p-6">
          <p className="text-slate-500 text-sm">
            Sales Reps
          </p>

          <h2 className="text-4xl font-bold mt-2 text-orange-600">
            {salesReps}
          </h2>
        </div>

      </div>

      {/* Team Table */}

      <div className="bg-white rounded-3xl border overflow-hidden">

        <div className="p-6 border-b">
          <h2 className="font-semibold text-lg">
            Team Directory
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Manage team members and their
            location access.
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead>

              <tr className="bg-slate-50">

                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Email
                </th>

                <th className="p-4 text-left">
                  Role
                </th>

                <th className="p-4 text-left">
                  Locations
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Joined
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {users.map((user) => {

                const userIsOwner =
                  user.organizationRole?.name?.toLowerCase() ===
                  "owner"

                return (
                  <tr
                    key={user.id}
                    className="border-t hover:bg-slate-50/70"
                  >

                    {/* Name */}

                    <td className="p-4">

                      <div className="font-medium">
                        {user.name}
                      </div>

                      {user.id === currentUser.id && (
                        <span className="text-xs text-orange-600">
                          You
                        </span>
                      )}

                    </td>

                    {/* Email */}

                    <td className="p-4 text-slate-600">
                      {user.email}
                    </td>

                    {/* Role */}

                    <td className="p-4">

                      <span
                        className="
                          inline-flex
                          px-3
                          py-1
                          rounded-full
                          bg-blue-100
                          text-blue-700
                          text-sm
                          capitalize
                        "
                      >
                        {user.organizationRole?.name ??
                          "No Role"}
                      </span>

                    </td>

                    {/* Locations */}

                    <td className="p-4">

                      {user.userLocations.length === 0 ? (

                        <span className="text-sm text-slate-400">
                          No location assigned
                        </span>

                      ) : (

                        <div className="flex flex-wrap gap-2 max-w-[280px]">

                          {user.userLocations.map(
                            (userLocation) => (
                              <span
                                key={userLocation.id}
                                className="
                                  inline-flex
                                  items-center
                                  rounded-full
                                  bg-orange-50
                                  border
                                  border-orange-200
                                  px-3
                                  py-1
                                  text-xs
                                  font-medium
                                  text-orange-700
                                "
                              >
                                {userLocation.location.name}
                              </span>
                            )
                          )}

                        </div>

                      )}

                    </td>

                    {/* Status */}

                    <td className="p-4">

                      <span
                        className={`
                          inline-flex
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          capitalize
                          ${
                            user.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        `}
                      >
                        {user.status}
                      </span>

                    </td>

                    {/* Joined */}

                    <td className="p-4 text-slate-500">

                      {new Date(
                        user.createdAt
                      ).toLocaleDateString()}

                    </td>

                    {/* Actions */}

                    <td className="p-4">

                      <div className="flex gap-2 flex-wrap">

                        {/* Edit */}

                        {canEditTeam && (
                          <Link
                            href={`/settings/team/${user.id}/edit`}
                            className="
                              px-3
                              py-1
                              text-sm
                              rounded-lg
                              bg-blue-100
                              text-blue-700
                              hover:bg-blue-200
                            "
                          >
                            Edit
                          </Link>
                        )}

                        {/* Activate / Deactivate */}

                        {canEditTeam &&
                          !userIsOwner &&
                          user.id !== currentUser.id && (
                            <form
                              action={toggleUserStatus}
                            >

                              <input
                                type="hidden"
                                name="id"
                                value={user.id}
                              />

                              <input
                                type="hidden"
                                name="status"
                                value={
                                  user.status ===
                                  "active"
                                    ? "inactive"
                                    : "active"
                                }
                              />

                              <button
                                type="submit"
                                className={`
                                  px-3
                                  py-1
                                  text-sm
                                  rounded-lg
                                  ${
                                    user.status ===
                                    "active"
                                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                      : "bg-green-100 text-green-700 hover:bg-green-200"
                                  }
                                `}
                              >
                                {user.status ===
                                "active"
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>

                            </form>
                          )}

                        {/* Delete */}

                        {canDeleteTeam &&
                          !userIsOwner &&
                          user.id !== currentUser.id && (
                            <DeleteUserButton
                              id={user.id}
                              action={deleteUser}
                            />
                          )}

                      </div>

                    </td>

                  </tr>
                )
              })}

              {/* Empty State */}

              {users.length === 0 && (
                <tr>

                  <td
                    colSpan={7}
                    className="p-12 text-center"
                  >

                    <div className="text-slate-500">

                      <p className="font-medium text-slate-700">
                        No team members yet
                      </p>

                      <p className="text-sm mt-1">
                        Add your first team member
                        to get started.
                      </p>

                      {canCreateTeam && (
                        <Link
                          href="/settings/team/new"
                          className="
                            inline-flex
                            mt-5
                            rounded-xl
                            bg-orange-600
                            px-5
                            py-3
                            text-white
                            font-medium
                            hover:bg-orange-700
                          "
                        >
                          + Add Team Member
                        </Link>
                      )}

                    </div>

                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}