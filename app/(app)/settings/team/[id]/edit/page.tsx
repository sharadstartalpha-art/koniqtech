import Link from "next/link"
import { redirect, notFound } from "next/navigation"
import { revalidatePath } from "next/cache"

import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

async function updateTeamMember(formData: FormData) {
  "use server"

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

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
    currentUser.organizationRole?.name?.toLowerCase() === "owner"

  const teamPermission =
    currentUser.organizationRole?.permissions.find(
      (permission) => permission.module === "Team"
    )

  if (!isOwner && !teamPermission?.canEdit) {
    throw new Error("Unauthorized")
  }

  const userId = String(formData.get("userId") ?? "").trim()

  const name = String(formData.get("name") ?? "").trim()

  const phone = String(formData.get("phone") ?? "").trim()

  const organizationRoleId = String(
    formData.get("organizationRoleId") ?? ""
  ).trim()

  const status = String(
    formData.get("status") ?? "active"
  ).trim()

  const locationIds = formData
    .getAll("locationIds")
    .map((value) => String(value).trim())
    .filter(Boolean)

  if (!userId) {
    throw new Error("User ID is required.")
  }

  if (!name) {
    throw new Error("Name is required.")
  }

  if (!organizationRoleId) {
    throw new Error("Role is required.")
  }

  if (!["active", "inactive"].includes(status)) {
    throw new Error("Invalid user status.")
  }

  if (userId === currentUser.id && status === "inactive") {
    throw new Error("You cannot deactivate your own account.")
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      organizationRole: true,
    },
  })

  if (!targetUser) {
    throw new Error("Team member not found.")
  }

  /*
   * Organization isolation.
   *
   * A user can only be edited inside the
   * organization of the currently logged-in user.
   */
  if (targetUser.orgId !== currentUser.orgId) {
    throw new Error("Unauthorized organization access.")
  }

  /*
   * Owner protection.
   *
   * The organization owner cannot be removed
   * or deactivated from this page.
   */
  const targetIsOwner =
    targetUser.organizationRole?.name?.toLowerCase() === "owner"

  if (targetIsOwner) {
    if (status === "inactive") {
      throw new Error("The organization owner cannot be deactivated.")
    }

    /*
     * Do not allow changing the owner's role.
     */
    if (organizationRoleId !== targetUser.organizationRoleId) {
      throw new Error("The organization owner's role cannot be changed.")
    }
  }

  /*
   * Make sure the selected role belongs to
   * the same organization.
   */
  const role = await prisma.organizationRole.findFirst({
    where: {
      id: organizationRoleId,
      orgId: currentUser.orgId,
      active: true,
    },
  })

  if (!role) {
    throw new Error("Invalid organization role.")
  }

  /*
   * Load the organization's subscription information.
   */
  const organization = await prisma.organization.findUnique({
    where: {
      id: currentUser.orgId,
    },
    select: {
      id: true,
      plan: true,
    },
  })

  if (!organization) {
    throw new Error("Organization not found.")
  }

  const normalizedPlan =
    organization.plan?.toLowerCase() ?? ""

  const isEnterprise =
    normalizedPlan === "enterprise"

  /*
   * Professional:
   * exactly one location maximum.
   *
   * Enterprise:
   * multiple locations allowed.
   *
   * If no locations are selected, the user
   * simply has no location assignment.
   */
  if (!isEnterprise && locationIds.length > 1) {
    throw new Error(
      "Professional plan allows only one location per team member. Upgrade to Enterprise to assign multiple locations."
    )
  }

  /*
   * Make sure EVERY selected location belongs
   * to the current organization and is active.
   *
   * This is critical for tenant isolation.
   */
  let validLocations: {
    id: string
  }[] = []

  if (locationIds.length > 0) {
    validLocations = await prisma.organizationLocation.findMany({
      where: {
        id: {
          in: locationIds,
        },
        orgId: currentUser.orgId,
        active: true,
      },
      select: {
        id: true,
      },
    })

    if (validLocations.length !== locationIds.length) {
      throw new Error(
        "One or more selected locations are invalid."
      )
    }
  }

  /*
   * Update user + location assignments atomically.
   */
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: targetUser.id,
      },
      data: {
        name,
        phone: phone || null,
        organizationRoleId,
        status,
      },
    })

    /*
     * Remove old location assignments.
     */
    await tx.userLocation.deleteMany({
      where: {
        userId: targetUser.id,
      },
    })

    /*
     * Add the new assignments.
     */
    if (validLocations.length > 0) {
      await tx.userLocation.createMany({
        data: validLocations.map((location) => ({
          userId: targetUser.id,
          locationId: location.id,
        })),
        skipDuplicates: true,
      })
    }
  })

  revalidatePath("/settings/team")
  revalidatePath(`/settings/team/${targetUser.id}/edit`)

  redirect("/settings/team?updated=1")
}

export default async function EditTeamMemberPage({
  params,
}: PageProps) {
  const { id } = await params

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

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
    currentUser.organizationRole?.name?.toLowerCase() === "owner"

  const teamPermission =
    currentUser.organizationRole?.permissions.find(
      (permission) => permission.module === "Team"
    )

  if (!isOwner && !teamPermission?.canEdit) {
    redirect("/dashboard")
  }

  /*
   * Load target user ONLY from the current organization.
   */
  const user = await prisma.user.findFirst({
    where: {
      id,
      orgId: currentUser.orgId,
    },
    include: {
      organizationRole: true,
      userLocations: {
        include: {
          location: true,
        },
      },
    },
  })

  if (!user) {
    notFound()
  }

  /*
   * Load active organization roles.
   */
  const roles = await prisma.organizationRole.findMany({
    where: {
      orgId: currentUser.orgId,
      active: true,
    },
    orderBy: {
      name: "asc",
    },
  })

  /*
   * Load active locations belonging to this organization.
   */
  const locations = await prisma.organizationLocation.findMany({
    where: {
      orgId: currentUser.orgId,
      active: true,
    },
    orderBy: [
      {
        isDefault: "desc",
      },
      {
        name: "asc",
      },
    ],
  })

  /*
   * Load plan.
   */
  const organization = await prisma.organization.findUnique({
    where: {
      id: currentUser.orgId,
    },
    select: {
      plan: true,
    },
  })

  const plan =
    organization?.plan?.toLowerCase() ?? ""

  const isEnterprise =
    plan === "enterprise"

  const assignedLocationIds = new Set(
    user.userLocations.map(
      (userLocation) => userLocation.locationId
    )
  )

  const targetIsOwner =
    user.organizationRole?.name?.toLowerCase() === "owner"

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <Link
          href="/settings/team"
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Back to Team
        </Link>

        <div className="mt-4">
          <h1 className="text-4xl font-bold">
            Edit Team Member
          </h1>

          <p className="text-slate-500 mt-2">
            Update this team member's profile, role,
            status, and location access.
          </p>
        </div>
      </div>

      {/* Owner notice */}
      {targetIsOwner && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <p className="font-semibold text-blue-900">
            Organization Owner
          </p>

          <p className="text-sm text-blue-700 mt-1">
            The organization owner's role and active
            status cannot be changed.
          </p>
        </div>
      )}

      <form
        action={updateTeamMember}
        className="bg-white border rounded-3xl p-8 space-y-8"
      >
        <input
          type="hidden"
          name="userId"
          value={user.id}
        />

        {/* Basic Information */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              Basic Information
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Update the team member's contact information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 font-medium">
                Full Name
              </label>

              <input
                name="name"
                required
                defaultValue={user.name}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Email Address
              </label>

              <input
                value={user.email}
                disabled
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-500"
              />

              <p className="text-xs text-slate-400 mt-2">
                Email address cannot be changed from this page.
              </p>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Phone
              </label>

              <input
                name="phone"
                type="tel"
                defaultValue={user.phone ?? ""}
                placeholder="+1 555 123 4567"
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

          </div>
        </section>

        {/* Role & Status */}
        <section className="border-t pt-8">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              Role & Status
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Control the team member's permissions and account status.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 font-medium">
                Role
              </label>

              <select
                name="organizationRoleId"
                defaultValue={user.organizationRoleId ?? ""}
                disabled={targetIsOwner}
                required
                className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white disabled:bg-slate-50 disabled:text-slate-500"
              >
                {roles.map((role) => (
                  <option
                    key={role.id}
                    value={role.id}
                  >
                    {role.name}
                  </option>
                ))}
              </select>

              {targetIsOwner && (
                <input
                  type="hidden"
                  name="organizationRoleId"
                  value={user.organizationRoleId ?? ""}
                />
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Status
              </label>

              <select
                name="status"
                defaultValue={user.status}
                disabled={targetIsOwner}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white disabled:bg-slate-50 disabled:text-slate-500"
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>

              {targetIsOwner && (
                <input
                  type="hidden"
                  name="status"
                  value="active"
                />
              )}
            </div>

          </div>
        </section>

        {/* Location Access */}
        <section className="border-t pt-8">

          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              Location Access
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Select which locations this team member can access.
            </p>
          </div>

          {/* Plan information */}
          <div
            className={`rounded-2xl border p-5 mb-6 ${
              isEnterprise
                ? "bg-blue-50 border-blue-200"
                : "bg-orange-50 border-orange-200"
            }`}
          >
            <div className="flex items-start justify-between gap-4">

              <div>
                <p
                  className={`font-semibold ${
                    isEnterprise
                      ? "text-blue-900"
                      : "text-orange-900"
                  }`}
                >
                  {isEnterprise
                    ? "Enterprise Plan"
                    : "Professional Plan"}
                </p>

                <p
                  className={`text-sm mt-1 ${
                    isEnterprise
                      ? "text-blue-700"
                      : "text-orange-700"
                  }`}
                >
                  {isEnterprise
                    ? "This user can be assigned to multiple locations."
                    : "This user can be assigned to one location."}
                </p>
              </div>

              {!isEnterprise && (
                <Link
                  href="/billing/plans"
                  className="shrink-0 rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                >
                  Upgrade
                </Link>
              )}

            </div>
          </div>

          {locations.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-8 text-center">

              <h3 className="font-semibold text-lg">
                No active locations
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Create a location before assigning location
                access to this team member.
              </p>

              <Link
                href="/settings/locations"
                className="inline-flex mt-5 rounded-xl bg-orange-600 px-5 py-3 text-white font-medium hover:bg-orange-700"
              >
                Manage Locations
              </Link>

            </div>
          ) : (
            <div className="space-y-3">

              {locations.map((location) => {
                const checked =
                  assignedLocationIds.has(location.id)

                return (
                  <label
                    key={location.id}
                    className={`flex items-start gap-4 rounded-2xl border p-5 cursor-pointer transition ${
                      checked
                        ? "border-orange-400 bg-orange-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >

                    <input
                      type={
                        isEnterprise
                          ? "checkbox"
                          : "radio"
                      }
                      name="locationIds"
                      value={location.id}
                      defaultChecked={checked}
                      className="mt-1 h-5 w-5 accent-orange-600"
                    />

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center gap-2 flex-wrap">

                        <span className="font-semibold">
                          {location.name}
                        </span>

                        {location.isDefault && (
                          <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                            Default
                          </span>
                        )}

                      </div>

                      <p className="text-sm text-slate-500 mt-1">
                        {location.address
                          ? `${location.address}, `
                          : ""}
                        {location.city}
                        {location.state
                          ? `, ${location.state}`
                          : ""}
                        {location.postalCode
                          ? ` ${location.postalCode}`
                          : ""}
                        {location.country
                          ? `, ${location.country}`
                          : ""}
                      </p>

                      {location.phone && (
                        <p className="text-xs text-slate-400 mt-1">
                          {location.phone}
                        </p>
                      )}

                    </div>

                  </label>
                )
              })}

              <p className="text-xs text-slate-500 pt-2">
                {isEnterprise
                  ? "Enterprise users may have access to multiple locations."
                  : "Professional users may have access to one location only."}
              </p>

            </div>
          )}

        </section>

        {/* Actions */}
        <div className="border-t pt-6 flex flex-wrap gap-3">

          <button
            type="submit"
            className="rounded-xl bg-orange-600 px-6 py-3 text-white font-medium hover:bg-orange-700"
          >
            Save Changes
          </button>

          <Link
            href="/settings/team"
            className="rounded-xl border px-6 py-3 font-medium hover:bg-slate-50"
          >
            Cancel
          </Link>

        </div>

      </form>

    </div>
  )
}