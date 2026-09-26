
import Link from "next/link"
import prisma from "@/shared/lib/prisma"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { randomUUID } from "crypto"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

function getLocationLimit(plan: string | null | undefined) {
  const normalizedPlan = plan?.toLowerCase()

  // Enterprise = unlimited locations
  if (normalizedPlan === "enterprise") {
    return null
  }

  // Starter + Professional = 1 location
  return 1
}

function getPlanLabel(plan: string | null | undefined) {
  if (!plan) return "Current Plan"

  return (
    plan.charAt(0).toUpperCase() +
    plan.slice(1).toLowerCase()
  )
}

async function createUser(formData: FormData) {
  "use server"

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    throw new Error("Organization not found.")
  }

  /*
   * ---------------------------------------------------------
   * VERIFY CURRENT USER + PERMISSION
   * ---------------------------------------------------------
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
    throw new Error("User not found.")
  }

  const isOwner =
    currentUser.organizationRole?.name?.toLowerCase() ===
    "owner"

  const canCreate =
    isOwner ||
    currentUser.organizationRole?.permissions.some(
      permission =>
        permission.module === "Team" &&
        permission.canCreate
    )

  if (!canCreate) {
    throw new Error(
      "You do not have permission to add team members."
    )
  }

  /*
   * ---------------------------------------------------------
   * READ FORM DATA
   * ---------------------------------------------------------
   */

  const name = String(
    formData.get("name") ?? ""
  ).trim()

  const email = String(
    formData.get("email") ?? ""
  )
    .trim()
    .toLowerCase()

  const organizationRoleId = String(
    formData.get("organizationRoleId") ?? ""
  ).trim()

  /*
   * IMPORTANT:
   *
   * Multiple location checkboxes use getAll().
   */
  const locationIds = Array.from(
    new Set(
      formData
        .getAll("locationIds")
        .map(value => String(value).trim())
        .filter(Boolean)
    )
  )

  if (!name) {
    throw new Error("Full name is required.")
  }

  if (!email) {
    throw new Error("Email address is required.")
  }

  if (!organizationRoleId) {
    throw new Error("Please select a role.")
  }

  if (locationIds.length === 0) {
    throw new Error(
      "Please select at least one location."
    )
  }

  /*
   * ---------------------------------------------------------
   * LOAD ORGANIZATION
   * ---------------------------------------------------------
   */

  const organization =
    await prisma.organization.findUnique({
      where: {
        id: orgId,
      },
      select: {
        id: true,
        plan: true,
      },
    })

  if (!organization) {
    throw new Error("Organization not found.")
  }

  /*
   * ---------------------------------------------------------
   * PLAN LOCATION RESTRICTION
   * ---------------------------------------------------------
   *
   * Starter      -> 1
   * Professional -> 1
   * Enterprise   -> unlimited
   */

  const locationLimit =
    getLocationLimit(organization.plan)

  if (
    locationLimit !== null &&
    locationIds.length > locationLimit
  ) {
    throw new Error(
      "Your current plan allows only one location per team member. Upgrade to Enterprise to assign multiple locations."
    )
  }

  /*
   * ---------------------------------------------------------
   * VERIFY ROLE BELONGS TO THIS ORGANIZATION
   * ---------------------------------------------------------
   */

  const role =
    await prisma.organizationRole.findFirst({
      where: {
        id: organizationRoleId,
        orgId,
        active: true,
      },
      select: {
        id: true,
        name: true,
      },
    })

  if (!role) {
    throw new Error(
      "The selected role is invalid or inactive."
    )
  }

  /*
   * ---------------------------------------------------------
   * VERIFY LOCATIONS
   * ---------------------------------------------------------
   *
   * IMPORTANT SECURITY CHECK:
   *
   * Never trust location IDs coming from the browser.
   * Every location must belong to this organization
   * and must be active.
   */

  const locations =
    await prisma.organizationLocation.findMany({
      where: {
        id: {
          in: locationIds,
        },
        orgId,
        active: true,
      },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
      },
      orderBy: {
        name: "asc",
      },
    })

  if (locations.length !== locationIds.length) {
    throw new Error(
      "One or more selected locations are invalid or inactive."
    )
  }

  /*
   * ---------------------------------------------------------
   * CHECK EXISTING USER
   * ---------------------------------------------------------
   */

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        orgId: true,
      },
    })

  if (existingUser) {
    if (existingUser.orgId === orgId) {
      throw new Error(
        "A team member with this email already exists in your organization."
      )
    }

    throw new Error(
      "An account with this email already exists."
    )
  }

  /*
   * ---------------------------------------------------------
   * REMOVE OLD PENDING INVITATION
   * ---------------------------------------------------------
   */

  await prisma.teamInvitation.deleteMany({
    where: {
      orgId,
      email,
      status: "pending",
    },
  })

  /*
   * ---------------------------------------------------------
   * CREATE INVITATION
   * ---------------------------------------------------------
   */

  const token = randomUUID()

  const invitation =
    await prisma.teamInvitation.create({
      data: {
        orgId,
        email,
        name,
        roleId: role.id,
        invitedById: session.user.id,
        token,
        status: "pending",
        expiresAt: new Date(
          Date.now() +
            7 * 24 * 60 * 60 * 1000
        ),
      },
    })

  /*
   * ---------------------------------------------------------
   * CREATE INVITATION LOCATION ASSIGNMENTS
   * ---------------------------------------------------------
   */

  await prisma.teamInvitationLocation.createMany({
    data: locations.map(location => ({
      invitationId: invitation.id,
      locationId: location.id,
    })),
    skipDuplicates: true,
  })

  /*
   * ---------------------------------------------------------
   * BUILD INVITATION URL
   * ---------------------------------------------------------
   */

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL

  if (!appUrl) {
    throw new Error(
      "NEXT_PUBLIC_APP_URL is not configured."
    )
  }

  const inviteUrl =
    `${appUrl.replace(/\/$/, "")}/invite/${token}`

  /*
   * ---------------------------------------------------------
   * BUILD LOCATION LIST FOR EMAIL
   * ---------------------------------------------------------
   */

  const locationListHtml = locations
    .map(location => {
      const address = [
        location.address,
        location.city,
        location.state,
        location.postalCode,
        location.country,
      ]
        .filter(Boolean)
        .join(", ")

      return `
        <li style="margin-bottom:10px;">
          <strong>${location.name}</strong>
          ${
            address
              ? `<br />
                 <span style="color:#64748b;">
                   ${address}
                 </span>`
              : ""
          }
        </li>
      `
    })
    .join("")

  /*
   * ---------------------------------------------------------
   * SEND INVITATION EMAIL
   * ---------------------------------------------------------
   */

  const emailResult =
    await resend.emails.send({
      from:
        "KoniqTech <noreply@koniqtech.com>",

      to: email,

      subject:
        "You're invited to join KoniqTech",

      html: `
        <div
          style="
            font-family:Arial,Helvetica,sans-serif;
            max-width:620px;
            margin:0 auto;
            padding:32px;
            color:#0f172a;
          "
        >

          <h2
            style="
              margin:0 0 10px;
              font-size:28px;
            "
          >
            You're invited to KoniqTech
          </h2>

          <p
            style="
              color:#475569;
              font-size:16px;
              line-height:1.6;
            "
          >
            Hello ${name},
          </p>

          <p
            style="
              color:#475569;
              font-size:16px;
              line-height:1.6;
            "
          >
            You've been invited to join your
            organization on KoniqTech.
          </p>

          <div
            style="
              background:#f8fafc;
              border:1px solid #e2e8f0;
              border-radius:12px;
              padding:20px;
              margin:24px 0;
            "
          >

            <p style="margin:0 0 12px;">
              <strong>Role:</strong>
              ${role.name}
            </p>

            <p style="margin:0 0 10px;">
              <strong>
                Assigned location${
                  locations.length === 1
                    ? ""
                    : "s"
                }:
              </strong>
            </p>

            <ul
              style="
                margin:0;
                padding-left:20px;
                color:#475569;
              "
            >
              ${locationListHtml}
            </ul>

          </div>

          <p
            style="
              color:#475569;
              font-size:16px;
              line-height:1.6;
            "
          >
            Click the button below to create your
            password and activate your account.
          </p>

          <div style="margin:30px 0;">
            <a
              href="${inviteUrl}"
              style="
                background:#ea580c;
                color:#ffffff;
                padding:14px 24px;
                text-decoration:none;
                border-radius:8px;
                display:inline-block;
                font-weight:bold;
              "
            >
              Accept Invitation
            </a>
          </div>

          <p
            style="
              color:#64748b;
              font-size:14px;
              line-height:1.6;
            "
          >
            This invitation expires in 7 days.
          </p>

          <p
            style="
              color:#94a3b8;
              font-size:12px;
              margin-top:30px;
            "
          >
            If you were not expecting this
            invitation, you can safely ignore this
            email.
          </p>

        </div>
      `,
    })

  /*
   * If Resend rejects the email, remove the
   * pending invitation so the user can retry.
   */

  if (emailResult.error) {
    await prisma.teamInvitation.delete({
      where: {
        id: invitation.id,
      },
    })

    throw new Error(
      "Unable to send the invitation email. Please try again."
    )
  }

  /*
   * ---------------------------------------------------------
   * SUCCESS
   * ---------------------------------------------------------
   */

  redirect("/settings/team?created=1")
}

export default async function NewTeamMemberPage() {
  /*
   * ---------------------------------------------------------
   * AUTHENTICATION
   * ---------------------------------------------------------
   */

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    redirect("/login")
  }

  /*
   * ---------------------------------------------------------
   * CURRENT USER + PERMISSIONS
   * ---------------------------------------------------------
   */

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

  const canCreate =
    isOwner ||
    currentUser.organizationRole?.permissions.some(
      permission =>
        permission.module === "Team" &&
        permission.canCreate
    )

  if (!canCreate) {
    redirect("/settings/team")
  }

  /*
   * ---------------------------------------------------------
   * ORGANIZATION
   * ---------------------------------------------------------
   */

  const organization =
    await prisma.organization.findUnique({
      where: {
        id: orgId,
      },
      select: {
        id: true,
        plan: true,
      },
    })

  if (!organization) {
    redirect("/login")
  }

  const planLabel =
    getPlanLabel(organization.plan)

  const locationLimit =
    getLocationLimit(organization.plan)

  const isEnterprise =
    organization.plan?.toLowerCase() ===
    "enterprise"

  /*
   * ---------------------------------------------------------
   * ACTIVE LOCATIONS
   * ---------------------------------------------------------
   */

  const locations =
    await prisma.organizationLocation.findMany({
      where: {
        orgId,
        active: true,
      },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        country: true,
        postalCode: true,
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
   * ---------------------------------------------------------
   * ORGANIZATION ROLES
   * ---------------------------------------------------------
   */

  const roles =
    await prisma.organizationRole.findMany({
      where: {
        orgId,
        active: true,
      },
      orderBy: {
        name: "asc",
      },
    })

  /*
   * ---------------------------------------------------------
   * NO LOCATION
   * ---------------------------------------------------------
   */

  if (locations.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">

        <Link
          href="/settings/team"
          className="
            text-sm
            text-slate-500
            hover:text-slate-900
          "
        >
          ← Back to Team
        </Link>

        <div
          className="
            mt-6
            bg-white
            border
            rounded-3xl
            p-10
          "
        >

          <h1 className="text-3xl font-bold">
            Add Team Member
          </h1>

          <div
            className="
              mt-8
              rounded-2xl
              border
              border-yellow-200
              bg-yellow-50
              p-6
            "
          >

            <h2
              className="
                font-semibold
                text-yellow-900
              "
            >
              Create a location first
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-yellow-800
              "
            >
              Every team member must have at
              least one location assigned.
            </p>

            <Link
              href="/settings/locations"
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
              + Add Location
            </Link>

          </div>

        </div>

      </div>
    )
  }

  /*
   * ---------------------------------------------------------
   * NO ROLES
   * ---------------------------------------------------------
   */

  if (roles.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">

        <Link
          href="/settings/team"
          className="
            text-sm
            text-slate-500
            hover:text-slate-900
          "
        >
          ← Back to Team
        </Link>

        <div
          className="
            mt-6
            bg-white
            border
            rounded-3xl
            p-10
          "
        >

          <h1 className="text-3xl font-bold">
            No Roles Found
          </h1>

          <p className="mt-3 text-slate-500">
            Create at least one role before
            inviting team members.
          </p>

          <Link
            href="/settings/roles/new"
            className="
              inline-flex
              mt-6
              px-6
              py-3
              bg-orange-600
              text-white
              rounded-xl
              hover:bg-orange-700
            "
          >
            + Create Role
          </Link>

        </div>

      </div>
    )
  }

  /*
   * ---------------------------------------------------------
   * PAGE
   * ---------------------------------------------------------
   */

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}

      <div className="mb-8">

        <Link
          href="/settings/team"
          className="
            text-sm
            text-slate-500
            hover:text-slate-900
          "
        >
          ← Back to Team
        </Link>

        <h1 className="text-4xl font-bold mt-4">
          Add Team Member
        </h1>

        <p className="text-slate-500 mt-2">
          Invite a team member by email and
          assign their role and location access.
        </p>

      </div>

      {/* Plan Information */}

      <div
        className="
          mb-6
          rounded-2xl
          border
          bg-slate-50
          p-5
        "
      >

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >

          <div>

            <p className="text-sm text-slate-500">
              Current Plan
            </p>

            <p
              className="
                text-lg
                font-semibold
                mt-1
              "
            >
              {planLabel}
            </p>

          </div>

          <div className="text-right">

            <p className="text-sm text-slate-500">
              Location Access
            </p>

            <p
              className="
                text-lg
                font-semibold
                mt-1
              "
            >
              {locationLimit === null
                ? "Multiple locations"
                : "1 location"}
            </p>

          </div>

        </div>

        {!isEnterprise && (
          <p
            className="
              mt-3
              text-sm
              text-slate-500
            "
          >
            {planLabel} allows one location
            per team member. Enterprise supports
            multiple locations.
          </p>
        )}

      </div>

      {/* Form */}

      <form
        action={createUser}
        className="
          bg-white
          border
          rounded-3xl
          p-8
          space-y-8
        "
      >

        {/* Full Name */}

        <div>

          <label
            htmlFor="name"
            className="
              block
              mb-2
              font-medium
            "
          >
            Full Name
          </label>

          <input
            id="name"
            name="name"
            required
            placeholder="John Smith"
            autoComplete="name"
            className="
              w-full
              h-12
              px-4
              rounded-xl
              border
              outline-none
              focus:ring-2
              focus:ring-orange-500
            "
          />

        </div>

        {/* Email */}

        <div>

          <label
            htmlFor="email"
            className="
              block
              mb-2
              font-medium
            "
          >
            Email Address
          </label>

          <input
            id="email"
            type="email"
            name="email"
            required
            placeholder="john@company.com"
            autoComplete="email"
            className="
              w-full
              h-12
              px-4
              rounded-xl
              border
              outline-none
              focus:ring-2
              focus:ring-orange-500
            "
          />

          <p
            className="
              text-xs
              text-slate-500
              mt-2
            "
          >
            The invitation and account activation
            link will be sent to this email.
          </p>

        </div>

        {/* Role */}

        <div>

          <label
            htmlFor="organizationRoleId"
            className="
              block
              mb-2
              font-medium
            "
          >
            Role
          </label>

          <p
            className="
              text-sm
              text-slate-500
              mb-2
            "
          >
            Select the role that determines this
            user's permissions.
          </p>

          <select
            id="organizationRoleId"
            name="organizationRoleId"
            required
            defaultValue=""
            className="
              w-full
              h-12
              px-4
              rounded-xl
              border
              bg-white
              outline-none
              focus:ring-2
              focus:ring-orange-500
            "
          >

            <option
              value=""
              disabled
            >
              Select a role
            </option>

            {roles.map(role => (
              <option
                key={role.id}
                value={role.id}
              >
                {role.name}
              </option>
            ))}

          </select>

          <div className="mt-2">

            <Link
              href="/settings/roles/new"
              className="
                text-sm
                text-orange-600
                hover:underline
              "
            >
              + Create another role
            </Link>

          </div>

        </div>

        {/* Location Access */}

        <div>

          <div className="mb-4">

            <label
              className="
                block
                font-medium
              "
            >
              Location Access
            </label>

            <p
              className="
                text-sm
                text-slate-500
                mt-1
              "
            >
              Select the location
              {isEnterprise ? "s" : ""}
              {" "}this team member can access.
            </p>

          </div>

          <div className="space-y-3">

            {locations.map(location => {

              const address = [
                location.address,
                location.city,
                location.state,
                location.postalCode,
                location.country,
              ]
                .filter(Boolean)
                .join(", ")

              return (
                <label
                  key={location.id}
                  className="
                    flex
                    items-start
                    gap-4
                    rounded-2xl
                    border
                    p-4
                    cursor-pointer
                    hover:bg-slate-50
                    transition
                  "
                >

                  <input
                    type={
                      isEnterprise
                        ? "checkbox"
                        : "radio"
                    }
                    name="locationIds"
                    value={location.id}
                    required
                    className="
                      mt-1
                      h-4
                      w-4
                      accent-orange-600
                    "
                  />

                  <div className="min-w-0">

                    <p className="font-medium">
                      {location.name}
                    </p>

                    {address && (
                      <p
                        className="
                          text-sm
                          text-slate-500
                          mt-1
                        "
                      >
                        {address}
                      </p>
                    )}

                  </div>

                </label>
              )
            })}

          </div>

          {isEnterprise && (
            <p
              className="
                text-xs
                text-slate-500
                mt-3
              "
            >
              You can select multiple locations
              because this organization is on
              Enterprise.
            </p>
          )}

        </div>

        {/* Invitation Information */}

        <div
          className="
            rounded-2xl
            bg-orange-50
            border
            border-orange-100
            p-5
          "
        >

          <p
            className="
              font-medium
              text-orange-900
            "
          >
            What happens next?
          </p>

          <ul
            className="
              mt-3
              space-y-2
              text-sm
              text-orange-800
            "
          >

            <li>
              • An invitation email will be sent
              to the team member.
            </li>

            <li>
              • They will create their password
              through the invitation link.
            </li>

            <li>
              • Their selected role and location
              access will be applied automatically.
            </li>

            <li>
              • The invitation expires after
              7 days.
            </li>

          </ul>

        </div>

        {/* Buttons */}

        <div
          className="
            pt-2
            flex
            gap-3
          "
        >

          <button
            type="submit"
            className="
              px-6
              py-3
              bg-orange-600
              text-white
              rounded-xl
              font-medium
              hover:bg-orange-700
              transition
            "
          >
            Send Invitation
          </button>

          <Link
            href="/settings/team"
            className="
              px-6
              py-3
              border
              rounded-xl
              font-medium
              hover:bg-slate-50
            "
          >
            Cancel
          </Link>

        </div>

      </form>

    </div>
  )
}

