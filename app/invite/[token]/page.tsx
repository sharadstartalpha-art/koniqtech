import prisma from "@/shared/lib/prisma"
import { notFound, redirect } from "next/navigation"
import bcrypt from "bcryptjs"

type PageProps = {
  params: Promise<{
    token: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { token } = await params

  const invitation = await prisma.teamInvitation.findUnique({
    where: {
      token,
    },
    include: {
      role: {
        select: {
          id: true,
          name: true,
        },
      },
      locations: {
        include: {
          location: {
            select: {
              id: true,
              name: true,
              address: true,
              city: true,
              state: true,
              postalCode: true,
              country: true,
              timezone: true,
              active: true,
            },
          },
        },
      },
    },
  })

  if (!invitation) {
    notFound()
  }

  if (invitation.status === "accepted") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
            ✓
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Invitation Already Accepted
          </h1>

          <p className="mt-3 text-slate-500">
            This invitation has already been used. Please sign in to your
            KoniqTech account.
          </p>

          <a
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-orange-600 px-6 py-3 font-medium text-white hover:bg-orange-700"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  if (invitation.expiresAt < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
            !
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Invitation Expired
          </h1>

          <p className="mt-3 text-slate-500">
            This invitation is no longer valid. Please ask your organization
            administrator to send you a new invitation.
          </p>
        </div>
      </div>
    )
  }

  async function acceptInvite(formData: FormData) {
    "use server"

    const name = String(formData.get("name") ?? "").trim()
    const password = String(formData.get("password") ?? "")
    const confirmPassword = String(
      formData.get("confirmPassword") ?? ""
    )

    const invitationToken = String(
      formData.get("token") ?? ""
    ).trim()

    if (!invitationToken) {
      throw new Error("Invalid invitation.")
    }

    if (!name) {
      throw new Error("Name is required.")
    }

    if (password.length < 8) {
      throw new Error(
        "Password must be at least 8 characters."
      )
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match.")
    }

    /*
     * Re-fetch the invitation inside the server action.
     *
     * Do not rely only on the invitation loaded during rendering.
     * This protects against stale invitation data and ensures that
     * the invitation is still valid when the form is submitted.
     */
    const currentInvitation =
      await prisma.teamInvitation.findUnique({
        where: {
          token: invitationToken,
        },
        include: {
          locations: {
            include: {
              location: {
                select: {
                  id: true,
                  orgId: true,
                  active: true,
                },
              },
            },
          },
          role: {
            select: {
              id: true,
              orgId: true,
              active: true,
            },
          },
        },
      })

    if (!currentInvitation) {
      throw new Error("Invitation not found.")
    }

    if (currentInvitation.status !== "pending") {
      throw new Error(
        "This invitation has already been accepted or is no longer available."
      )
    }

    if (currentInvitation.expiresAt < new Date()) {
      throw new Error(
        "This invitation has expired. Please request a new invitation."
      )
    }

    /*
     * Make sure the role still exists, is active,
     * and belongs to the same organization.
     */
    if (
      !currentInvitation.role ||
      !currentInvitation.role.active ||
      currentInvitation.role.orgId !== currentInvitation.orgId
    ) {
      throw new Error(
        "The assigned organization role is no longer valid."
      )
    }

    /*
     * Validate all assigned locations.
     *
     * A location must:
     * 1. Exist
     * 2. Belong to the same organization
     * 3. Be active
     */
    for (const assignment of currentInvitation.locations) {
      if (
        !assignment.location ||
        assignment.location.orgId !== currentInvitation.orgId
      ) {
        throw new Error(
          "One or more assigned locations are invalid."
        )
      }

      if (!assignment.location.active) {
        throw new Error(
          "One or more assigned locations are no longer active."
        )
      }
    }

    /*
     * Email is stored on the invitation and cannot be changed
     * by the invited user.
     */
    const existingUser = await prisma.user.findUnique({
      where: {
        email: currentInvitation.email,
      },
    })

    if (existingUser) {
      throw new Error(
        "An account with this email already exists."
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    /*
     * Create the user and location assignments atomically.
     *
     * If anything fails, neither the user nor invitation changes
     * are committed.
     */
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          orgId: currentInvitation.orgId,
          name,
          email: currentInvitation.email,
          passwordHash,
          organizationRoleId: currentInvitation.roleId,
          status: "active",
          emailVerified: true,
          welcomeSeen: false,
        },
      })

      /*
       * Assign every location attached to the invitation.
       *
       * UserLocation has a unique constraint:
       * @@unique([userId, locationId])
       */
      if (currentInvitation.locations.length > 0) {
        await tx.userLocation.createMany({
          data: currentInvitation.locations.map(
            (assignment) => ({
              userId: user.id,
              locationId: assignment.locationId,
            })
          ),
          skipDuplicates: true,
        })
      }

      await tx.teamInvitation.update({
        where: {
          id: currentInvitation.id,
        },
        data: {
          status: "accepted",
          acceptedAt: new Date(),
        },
      })
    })

    redirect("/login?registered=1")
  }

  const assignedLocations = invitation.locations.filter(
    (assignment) => assignment.location.active
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-lg">

        {/* Branding / Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            KoniqTech
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Field Service CRM
          </p>
        </div>

        <form
          action={acceptInvite}
          className="rounded-3xl border bg-white p-8 shadow-sm space-y-6"
        >
          {/* Hidden token */}
          <input
            type="hidden"
            name="token"
            value={invitation.token}
          />

          {/* Heading */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Accept Invitation
            </h2>

            <p className="mt-2 text-slate-500">
              Create your account to join your organization.
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              value={invitation.email}
              readOnly
              className="
                h-12
                w-full
                rounded-xl
                border
                bg-slate-50
                px-4
                text-slate-600
                outline-none
              "
            />

            <p className="mt-1 text-xs text-slate-500">
              This email address is associated with your invitation.
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>

            <input
              name="name"
              required
              defaultValue={invitation.name ?? ""}
              placeholder="John Smith"
              autoComplete="name"
              className="
                h-12
                w-full
                rounded-xl
                border
                px-4
                outline-none
                focus:border-orange-500
                focus:ring-2
                focus:ring-orange-100
              "
            />
          </div>

          {/* Role */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Organization Role
            </label>

            <div className="rounded-xl border bg-slate-50 px-4 py-3">
              <p className="font-medium text-slate-900">
                {invitation.role?.name ?? "Assigned Role"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Your role and permissions have been assigned by your
                organization administrator.
              </p>
            </div>
          </div>

          {/* Locations */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700">
                Assigned Locations
              </label>

              <span className="text-xs font-medium text-slate-500">
                {assignedLocations.length}{" "}
                {assignedLocations.length === 1
                  ? "location"
                  : "locations"}
              </span>
            </div>

            {assignedLocations.length > 0 ? (
              <div className="space-y-3">
                {assignedLocations.map((assignment) => {
                  const location = assignment.location

                  return (
                    <div
                      key={assignment.id}
                      className="
                        rounded-xl
                        border
                        bg-slate-50
                        p-4
                      "
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-orange-100
                            text-orange-600
                          "
                        >
                          <span className="text-sm font-bold">
                            ●
                          </span>
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">
                            {location.name}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {[
                              location.address,
                              location.city,
                              location.state,
                              location.postalCode,
                              location.country,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>

                          {location.timezone && (
                            <p className="mt-1 text-xs text-slate-400">
                              Timezone: {location.timezone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-sm font-medium text-yellow-800">
                  No locations have been assigned to this invitation.
                </p>

                <p className="mt-1 text-xs text-yellow-700">
                  Please contact your organization administrator before
                  creating your account.
                </p>
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              className="
                h-12
                w-full
                rounded-xl
                border
                px-4
                outline-none
                focus:border-orange-500
                focus:ring-2
                focus:ring-orange-100
              "
            />

            <p className="mt-1 text-xs text-slate-500">
              Password must contain at least 8 characters.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Confirm Password
            </label>

            <input
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              className="
                h-12
                w-full
                rounded-xl
                border
                px-4
                outline-none
                focus:border-orange-500
                focus:ring-2
                focus:ring-orange-100
              "
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={assignedLocations.length === 0}
            className="
              h-12
              w-full
              rounded-xl
              bg-orange-600
              font-medium
              text-white
              transition
              hover:bg-orange-700
              disabled:cursor-not-allowed
              disabled:bg-slate-300
            "
          >
            Create Account
          </button>

          {/* Footer */}
          <p className="text-center text-xs text-slate-400">
            By creating your account, you will be added to the
            organization with the role and locations assigned to this
            invitation.
          </p>
        </form>

      </div>
    </div>
  )
}