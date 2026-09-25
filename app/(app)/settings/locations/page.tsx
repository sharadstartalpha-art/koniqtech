import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"

interface Props {
  searchParams: Promise<{
    created?: string
    error?: string
  }>
}

function normalizePlan(plan: unknown) {
  return String(plan ?? "")
    .trim()
    .toLowerCase()
}

export default async function LocationsPage({
  searchParams,
}: Props) {
  const params = await searchParams

  /* ============================================================
     AUTH
  ============================================================ */

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    redirect("/dashboard")
  }

  /* ============================================================
     CURRENT USER
  ============================================================ */

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

  /* ============================================================
     ORGANIZATION
  ============================================================ */

  const organization = await prisma.organization.findUnique({
    where: {
      id: orgId,
    },
    select: {
      id: true,
      name: true,
      plan: true,
    },
  })

  if (!organization) {
    redirect("/dashboard")
  }

  /* ============================================================
     PERMISSIONS
  ============================================================ */

  const organizationRole =
    currentUser.organizationRole?.name
      ?.trim()
      .toLowerCase() ?? ""

  const isOwner = organizationRole === "owner"

  const locationPermission =
    currentUser.organizationRole?.permissions.find(
      (permission) =>
        permission.module.toLowerCase() === "locations"
    )

  /*
   * Owner always has access.
   *
   * For other users, use the Locations permission if it exists.
   *
   * This also keeps the page safe if the permission has not yet
   * been configured in the customer's role.
   */

  const canView =
    isOwner ||
    Boolean(locationPermission?.canView)

  const canCreate =
    isOwner ||
    Boolean(locationPermission?.canCreate)

  const canEdit =
    isOwner ||
    Boolean(locationPermission?.canEdit)

  const canDelete =
    isOwner ||
    Boolean(locationPermission?.canDelete)

  if (!canView) {
    redirect("/dashboard")
  }

  /* ============================================================
     PLAN
  ============================================================ */

  const plan = normalizePlan(organization.plan)

  const isEnterprise =
    plan === "enterprise"

  const isProfessional =
    plan === "professional" ||
    plan === "pro"

  /*
   * Professional:
   *   Maximum 1 active location.
   *
   * Enterprise:
   *   Unlimited locations.
   *
   * Employees are NOT limited by plan.
   */

  const locationLimit =
    isEnterprise
      ? null
      : 1

  /* ============================================================
     LOAD LOCATIONS
  ============================================================ */

  const locations =
    await prisma.organizationLocation.findMany({
      where: {
        orgId,
      },
      include: {
        userLocations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                status: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          isDefault: "desc",
        },
        {
          active: "desc",
        },
        {
          createdAt: "asc",
        },
      ],
    })

  const activeLocations =
    locations.filter(
      (location) => location.active
    )

  /* ============================================================
     LOAD TEAM MEMBERS
  ============================================================ */

  const teamMembers =
    await prisma.user.findMany({
      where: {
        orgId,
        status: "active",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    })

  /* ============================================================
     CREATE LOCATION
  ============================================================ */

  async function createLocation(
    formData: FormData
  ) {
    "use server"

    const session = await auth()

    if (!session?.user?.id) {
      redirect("/login")
    }

    const sessionOrgId = session.user.orgId

    if (!sessionOrgId) {
      redirect("/dashboard")
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

    const role =
      currentUser.organizationRole?.name
        ?.trim()
        .toLowerCase() ?? ""

    const permission =
      currentUser.organizationRole?.permissions.find(
        (p) =>
          p.module.toLowerCase() ===
          "locations"
      )

    const allowed =
      role === "owner" ||
      Boolean(permission?.canCreate)

    if (!allowed) {
      throw new Error(
        "You do not have permission to create locations."
      )
    }

    /* ----------------------------------------------------------
       Organization / plan
    ---------------------------------------------------------- */

    const organization =
      await prisma.organization.findUnique({
        where: {
          id: sessionOrgId,
        },
        select: {
          id: true,
          plan: true,
        },
      })

    if (!organization) {
      throw new Error(
        "Organization not found."
      )
    }

    const normalizedPlan =
      normalizePlan(
        organization.plan
      )

    const enterprise =
      normalizedPlan === "enterprise"

    const existingActiveCount =
      await prisma.organizationLocation.count({
        where: {
          orgId: sessionOrgId,
          active: true,
        },
      })

    /*
     * Professional = one active location.
     */

    if (
      !enterprise &&
      existingActiveCount >= 1
    ) {
      redirect(
        "/settings/locations?error=upgrade"
      )
    }

    /* ----------------------------------------------------------
       Form values
    ---------------------------------------------------------- */

    const name =
      String(
        formData.get("name") ?? ""
      ).trim()

    const address =
      String(
        formData.get("address") ?? ""
      ).trim()

    const city =
      String(
        formData.get("city") ?? ""
      ).trim()

    const state =
      String(
        formData.get("state") ?? ""
      ).trim()

    const country =
      String(
        formData.get("country") ?? ""
      ).trim()

    const postalCode =
      String(
        formData.get("postalCode") ?? ""
      ).trim()

    const phone =
      String(
        formData.get("phone") ?? ""
      ).trim()

    const email =
      String(
        formData.get("email") ?? ""
      ).trim()

    const timezone =
      String(
        formData.get("timezone") ?? "UTC"
      ).trim()

    if (!name) {
      throw new Error(
        "Location name is required."
      )
    }

    if (!city) {
      throw new Error(
        "City is required."
      )
    }

    /* ----------------------------------------------------------
       First location becomes default.
    ---------------------------------------------------------- */

    const shouldBeDefault =
      existingActiveCount === 0

    await prisma.organizationLocation.create({
      data: {
        orgId: sessionOrgId,

        name,

        address:
          address || null,

        city,

        state:
          state || null,

        country:
          country || null,

        postalCode:
          postalCode || null,

        phone:
          phone || null,

        email:
          email || null,

        timezone:
          timezone || "UTC",

        currency: "USD",

        isDefault:
          shouldBeDefault,

        active: true,
      },
    })

    revalidatePath(
      "/settings/locations"
    )

    redirect(
      "/settings/locations?created=1"
    )
  }

  /* ============================================================
     SET DEFAULT LOCATION
  ============================================================ */

  async function setDefaultLocation(
    formData: FormData
  ) {
    "use server"

    const session = await auth()

    if (!session?.user?.id) {
      redirect("/login")
    }

    const sessionOrgId =
      session.user.orgId

    if (!sessionOrgId) {
      redirect("/dashboard")
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

    const role =
      currentUser.organizationRole?.name
        ?.trim()
        .toLowerCase() ?? ""

    const permission =
      currentUser.organizationRole?.permissions.find(
        (p) =>
          p.module.toLowerCase() ===
          "locations"
      )

    const allowed =
      role === "owner" ||
      Boolean(permission?.canEdit)

    if (!allowed) {
      throw new Error(
        "You do not have permission to modify locations."
      )
    }

    const locationId =
      String(
        formData.get("locationId") ?? ""
      ).trim()

    if (!locationId) {
      throw new Error(
        "Location ID is required."
      )
    }

    /*
     * Verify location belongs to this organization.
     */

    const location =
      await prisma.organizationLocation.findFirst({
        where: {
          id: locationId,
          orgId: sessionOrgId,
          active: true,
        },
        select: {
          id: true,
        },
      })

    if (!location) {
      throw new Error(
        "Location not found."
      )
    }

    await prisma.$transaction([
      prisma.organizationLocation.updateMany({
        where: {
          orgId: sessionOrgId,
        },
        data: {
          isDefault: false,
        },
      }),

      prisma.organizationLocation.update({
        where: {
          id: locationId,
        },
        data: {
          isDefault: true,
        },
      }),
    ])

    revalidatePath(
      "/settings/locations"
    )

    redirect(
      "/settings/locations"
    )
  }

  /* ============================================================
     DEACTIVATE LOCATION
  ============================================================ */

  async function deactivateLocation(
    formData: FormData
  ) {
    "use server"

    const session = await auth()

    if (!session?.user?.id) {
      redirect("/login")
    }

    const sessionOrgId =
      session.user.orgId

    if (!sessionOrgId) {
      redirect("/dashboard")
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

    const role =
      currentUser.organizationRole?.name
        ?.trim()
        .toLowerCase() ?? ""

    const permission =
      currentUser.organizationRole?.permissions.find(
        (p) =>
          p.module.toLowerCase() ===
          "locations"
      )

    const allowed =
      role === "owner" ||
      Boolean(permission?.canDelete)

    if (!allowed) {
      throw new Error(
        "You do not have permission to deactivate locations."
      )
    }

    const locationId =
      String(
        formData.get("locationId") ?? ""
      ).trim()

    const location =
      await prisma.organizationLocation.findFirst({
        where: {
          id: locationId,
          orgId: sessionOrgId,
        },
        select: {
          id: true,
          isDefault: true,
        },
      })

    if (!location) {
      throw new Error(
        "Location not found."
      )
    }

    /*
     * Do not allow the default location
     * to be deactivated.
     */

    if (location.isDefault) {
      throw new Error(
        "Set another location as default before deactivating this location."
      )
    }

    await prisma.organizationLocation.update({
      where: {
        id: locationId,
      },
      data: {
        active: false,
      },
    })

    revalidatePath(
      "/settings/locations"
    )

    redirect(
      "/settings/locations"
    )
  }

  /* ============================================================
     REACTIVATE LOCATION
  ============================================================ */

  async function activateLocation(
    formData: FormData
  ) {
    "use server"

    const session = await auth()

    if (!session?.user?.id) {
      redirect("/login")
    }

    const sessionOrgId =
      session.user.orgId

    if (!sessionOrgId) {
      redirect("/dashboard")
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

    const role =
      currentUser.organizationRole?.name
        ?.trim()
        .toLowerCase() ?? ""

    const permission =
      currentUser.organizationRole?.permissions.find(
        (p) =>
          p.module.toLowerCase() ===
          "locations"
      )

    const allowed =
      role === "owner" ||
      Boolean(permission?.canCreate)

    if (!allowed) {
      throw new Error(
        "You do not have permission to activate locations."
      )
    }

    const locationId =
      String(
        formData.get("locationId") ?? ""
      ).trim()

    const organization =
      await prisma.organization.findUnique({
        where: {
          id: sessionOrgId,
        },
        select: {
          plan: true,
        },
      })

    if (!organization) {
      throw new Error(
        "Organization not found."
      )
    }

    const enterprise =
      normalizePlan(
        organization.plan
      ) === "enterprise"

    const activeCount =
      await prisma.organizationLocation.count({
        where: {
          orgId: sessionOrgId,
          active: true,
        },
      })

    /*
     * Professional cannot reactivate a second
     * active location.
     */

    if (
      !enterprise &&
      activeCount >= 1
    ) {
      redirect(
        "/settings/locations?error=upgrade"
      )
    }

    const location =
      await prisma.organizationLocation.findFirst({
        where: {
          id: locationId,
          orgId: sessionOrgId,
        },
      })

    if (!location) {
      throw new Error(
        "Location not found."
      )
    }

    await prisma.organizationLocation.update({
      where: {
        id: locationId,
      },
      data: {
        active: true,
      },
    })

    revalidatePath(
      "/settings/locations"
    )

    redirect(
      "/settings/locations"
    )
  }

  /* ============================================================
     ASSIGN USER TO LOCATION
  ============================================================ */

  async function assignUser(
    formData: FormData
  ) {
    "use server"

    const session = await auth()

    if (!session?.user?.id) {
      redirect("/login")
    }

    const sessionOrgId =
      session.user.orgId

    if (!sessionOrgId) {
      redirect("/dashboard")
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

    const role =
      currentUser.organizationRole?.name
        ?.trim()
        .toLowerCase() ?? ""

    const permission =
      currentUser.organizationRole?.permissions.find(
        (p) =>
          p.module.toLowerCase() ===
          "locations"
      )

    const allowed =
      role === "owner" ||
      Boolean(permission?.canEdit)

    if (!allowed) {
      throw new Error(
        "You do not have permission to assign users to locations."
      )
    }

    const locationId =
      String(
        formData.get("locationId") ?? ""
      ).trim()

    const userId =
      String(
        formData.get("userId") ?? ""
      ).trim()

    if (!locationId || !userId) {
      throw new Error(
        "Location and user are required."
      )
    }

    /*
     * Verify both belong to this organization.
     */

    const [location, user] =
      await Promise.all([
        prisma.organizationLocation.findFirst({
          where: {
            id: locationId,
            orgId: sessionOrgId,
            active: true,
          },
        }),

        prisma.user.findFirst({
          where: {
            id: userId,
            orgId: sessionOrgId,
          },
        }),
      ])

    if (!location || !user) {
      throw new Error(
        "Invalid location or user."
      )
    }

    await prisma.userLocation.upsert({
      where: {
        userId_locationId: {
          userId,
          locationId,
        },
      },
      update: {},

      create: {
        userId,
        locationId,
      },
    })

    revalidatePath(
      "/settings/locations"
    )

    redirect(
      "/settings/locations"
    )
  }

  /* ============================================================
     REMOVE USER FROM LOCATION
  ============================================================ */

  async function removeUser(
    formData: FormData
  ) {
    "use server"

    const session = await auth()

    if (!session?.user?.id) {
      redirect("/login")
    }

    const sessionOrgId =
      session.user.orgId

    if (!sessionOrgId) {
      redirect("/dashboard")
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

    const role =
      currentUser.organizationRole?.name
        ?.trim()
        .toLowerCase() ?? ""

    const permission =
      currentUser.organizationRole?.permissions.find(
        (p) =>
          p.module.toLowerCase() ===
          "locations"
      )

    const allowed =
      role === "owner" ||
      Boolean(permission?.canEdit)

    if (!allowed) {
      throw new Error(
        "You do not have permission to modify location access."
      )
    }

    const locationId =
      String(
        formData.get("locationId") ?? ""
      ).trim()

    const userId =
      String(
        formData.get("userId") ?? ""
      ).trim()

    const location =
      await prisma.organizationLocation.findFirst({
        where: {
          id: locationId,
          orgId: sessionOrgId,
        },
        select: {
          id: true,
        },
      })

    const user =
      await prisma.user.findFirst({
        where: {
          id: userId,
          orgId: sessionOrgId,
        },
        select: {
          id: true,
        },
      })

    if (!location || !user) {
      throw new Error(
        "Invalid location or user."
      )
    }

    await prisma.userLocation.deleteMany({
      where: {
        userId,
        locationId,
      },
    })

    revalidatePath(
      "/settings/locations"
    )

    redirect(
      "/settings/locations"
    )
  }

  /* ============================================================
     UI
  ============================================================ */

  const atLimit =
    locationLimit !== null &&
    activeLocations.length >=
      locationLimit

  return (
    <div className="space-y-8">

      {/* ========================================================
         HEADER
      ======================================================== */}

      <div className="flex items-start justify-between gap-6">

        <div>

          <h1 className="text-4xl font-bold">
            Locations
          </h1>

          <p className="text-slate-500 mt-2">
            Manage your business locations and
            team access.
          </p>

        </div>

        {canCreate && !atLimit && (

          <a
            href="#add-location"
            className="
              px-5
              py-3
              rounded-2xl
              bg-orange-600
              text-white
              font-medium
              hover:bg-orange-700
              transition
            "
          >
            + Add Location
          </a>

        )}

      </div>

      {/* ========================================================
         SUCCESS
      ======================================================== */}

      {params.created && (

        <div
          className="
            rounded-2xl
            border
            border-green-200
            bg-green-50
            px-5
            py-4
            text-green-700
          "
        >
          Location created successfully.
        </div>

      )}

      {/* ========================================================
         PROFESSIONAL UPGRADE MESSAGE
      ======================================================== */}

      {params.error === "upgrade" && (

        <div
          className="
            rounded-2xl
            border
            border-orange-200
            bg-orange-50
            p-6
          "
        >

          <div className="flex items-start justify-between gap-6">

            <div>

              <h2 className="font-semibold text-orange-900">
                Additional locations require Enterprise
              </h2>

              <p className="mt-2 text-sm text-orange-800">
                Your Professional plan includes
                one location. Upgrade to Enterprise
                to add multiple cities, branches,
                or offices.
              </p>

            </div>

            <Link
              href="/billing"
              className="
                shrink-0
                px-5
                py-2.5
                rounded-xl
                bg-orange-600
                text-white
                font-medium
                hover:bg-orange-700
              "
            >
              Upgrade Plan
            </Link>

          </div>

        </div>

      )}

      {/* ========================================================
         PLAN CARD
      ======================================================== */}

      <div
        className="
          bg-white
          border
          rounded-3xl
          p-6
        "
      >

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-slate-500">
              Current Plan
            </p>

            <h2 className="text-2xl font-bold mt-1 capitalize">
              {plan}
            </h2>

          </div>

          <div className="text-right">

            <p className="text-sm text-slate-500">
              Active Locations
            </p>

            <p className="text-2xl font-bold mt-1">

              {activeLocations.length}

              <span className="text-slate-400">

                {" / "}

                {locationLimit === null
                  ? "∞"
                  : locationLimit}

              </span>

            </p>

          </div>

        </div>

        <div
          className="
            mt-5
            h-2
            rounded-full
            bg-slate-100
            overflow-hidden
          "
        >

          <div
            className="
              h-full
              rounded-full
              bg-orange-500
            "
            style={{
              width:
                locationLimit === null
                  ? "35%"
                  : `${Math.min(
                      100,
                      (activeLocations.length /
                        locationLimit) *
                        100
                    )}%`,
            }}
          />

        </div>

        <p className="text-sm text-slate-500 mt-3">

          {isEnterprise
            ? "Enterprise includes unlimited business locations."
            : "Professional includes one business location. Upgrade to Enterprise for multiple locations."}

        </p>

      </div>

      {/* ========================================================
         LOCATIONS
      ======================================================== */}

      <div className="space-y-5">

        {locations.length === 0 && (

          <div
            className="
              bg-white
              border
              rounded-3xl
              p-10
              text-center
            "
          >

            <h2 className="text-xl font-semibold">
              No locations yet
            </h2>

            <p className="text-slate-500 mt-2">
              Add your first business location
              to get started.
            </p>

          </div>

        )}

        {locations.map((location) => (

          <div
            key={location.id}
            className="
              bg-white
              border
              rounded-3xl
              overflow-hidden
            "
          >

            {/* Location header */}

            <div
              className="
                p-6
                border-b
                flex
                items-start
                justify-between
                gap-6
              "
            >

              <div>

                <div className="flex items-center gap-3">

                  <h2 className="text-xl font-semibold">
                    {location.name}
                  </h2>

                  {location.isDefault && (

                    <span
                      className="
                        px-2.5
                        py-1
                        rounded-full
                        bg-blue-100
                        text-blue-700
                        text-xs
                        font-medium
                      "
                    >
                      Default
                    </span>

                  )}

                  {!location.active && (

                    <span
                      className="
                        px-2.5
                        py-1
                        rounded-full
                        bg-red-100
                        text-red-700
                        text-xs
                        font-medium
                      "
                    >
                      Inactive
                    </span>

                  )}

                </div>

                <p className="text-slate-500 mt-2">

                  {[
                    location.address,
                    location.city,
                    location.state,
                    location.country,
                    location.postalCode,
                  ]
                    .filter(Boolean)
                    .join(", ")}

                </p>

                {(location.phone ||
                  location.email) && (

                  <p className="text-sm text-slate-500 mt-2">

                    {location.phone}

                    {location.phone &&
                      location.email &&
                      " • "}

                    {location.email}

                  </p>

                )}

              </div>

              <div className="flex items-center gap-2">

                {canEdit &&
                  location.active &&
                  !location.isDefault && (

                    <form
                      action={setDefaultLocation}
                    >

                      <input
                        type="hidden"
                        name="locationId"
                        value={location.id}
                      />

                      <button
                        type="submit"
                        className="
                          px-3
                          py-2
                          rounded-xl
                          bg-blue-50
                          text-blue-700
                          text-sm
                          font-medium
                          hover:bg-blue-100
                        "
                      >
                        Make Default
                      </button>

                    </form>

                  )}

                {canDelete &&
                  location.active &&
                  !location.isDefault && (

                    <form
                      action={deactivateLocation}
                    >

                      <input
                        type="hidden"
                        name="locationId"
                        value={location.id}
                      />

                      <button
                        type="submit"
                        className="
                          px-3
                          py-2
                          rounded-xl
                          bg-red-50
                          text-red-700
                          text-sm
                          font-medium
                          hover:bg-red-100
                        "
                      >
                        Deactivate
                      </button>

                    </form>

                  )}

                {canCreate &&
                  !location.active && (

                    <form
                      action={activateLocation}
                    >

                      <input
                        type="hidden"
                        name="locationId"
                        value={location.id}
                      />

                      <button
                        type="submit"
                        className="
                          px-3
                          py-2
                          rounded-xl
                          bg-green-50
                          text-green-700
                          text-sm
                          font-medium
                          hover:bg-green-100
                        "
                      >
                        Activate
                      </button>

                    </form>

                  )}

              </div>

            </div>

            {/* Team access */}

            {location.active && (

              <div className="p-6">

                <div className="flex items-center justify-between mb-4">

                  <div>

                    <h3 className="font-semibold">
                      Team Access
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Team members assigned to this location.
                    </p>

                  </div>

                  {canEdit && (

                    <form
                      action={assignUser}
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >

                      <input
                        type="hidden"
                        name="locationId"
                        value={location.id}
                      />

                      <select
                        name="userId"
                        required
                        className="
                          h-10
                          px-3
                          rounded-xl
                          border
                          bg-white
                          text-sm
                        "
                      >

                        <option value="">
                          Add team member...
                        </option>

                        {teamMembers
                          .filter(
                            (member) =>
                              !location.userLocations.some(
                                (assignment) =>
                                  assignment.user.id ===
                                  member.id
                              )
                          )
                          .map((member) => (

                            <option
                              key={member.id}
                              value={member.id}
                            >
                              {member.name ||
                                member.email}
                            </option>

                          ))}

                      </select>

                      <button
                        type="submit"
                        className="
                          h-10
                          px-4
                          rounded-xl
                          bg-slate-900
                          text-white
                          text-sm
                          font-medium
                        "
                      >
                        Assign
                      </button>

                    </form>

                  )}

                </div>

                {location.userLocations.length ===
                  0 ? (

                  <div
                    className="
                      rounded-2xl
                      border
                      border-dashed
                      p-5
                      text-center
                      text-sm
                      text-slate-500
                    "
                  >
                    No team members assigned yet.
                  </div>

                ) : (

                  <div className="space-y-2">

                    {location.userLocations.map(
                      (assignment) => (

                        <div
                          key={assignment.id}
                          className="
                            flex
                            items-center
                            justify-between
                            rounded-2xl
                            border
                            px-4
                            py-3
                          "
                        >

                          <div>

                            <p className="font-medium">
                              {assignment.user.name ||
                                "Unnamed User"}
                            </p>

                            <p className="text-sm text-slate-500">
                              {assignment.user.email}
                            </p>

                          </div>

                          {canEdit && (

                            <form
                              action={removeUser}
                            >

                              <input
                                type="hidden"
                                name="locationId"
                                value={location.id}
                              />

                              <input
                                type="hidden"
                                name="userId"
                                value={
                                  assignment.user.id
                                }
                              />

                              <button
                                type="submit"
                                className="
                                  text-sm
                                  text-red-600
                                  hover:text-red-700
                                  font-medium
                                "
                              >
                                Remove
                              </button>

                            </form>

                          )}

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            )}

          </div>

        ))}

      </div>

      {/* ========================================================
         ADD LOCATION
      ======================================================== */}

      {canCreate && !atLimit && (

        <div
          id="add-location"
          className="
            bg-white
            border
            rounded-3xl
            p-8
          "
        >

          <div className="mb-6">

            <h2 className="text-xl font-semibold">
              Add Business Location
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Add another office, branch, or city.
            </p>

          </div>

          <form
            action={createLocation}
            className="space-y-6"
          >

            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <label className="block text-sm font-medium mb-2">
                  Location Name
                </label>

                <input
                  name="name"
                  required
                  placeholder="Dallas Office"
                  className="
                    w-full
                    h-12
                    px-4
                    rounded-xl
                    border
                  "
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  City
                </label>

                <input
                  name="city"
                  required
                  placeholder="Dallas"
                  className="
                    w-full
                    h-12
                    px-4
                    rounded-xl
                    border
                  "
                />

              </div>

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                Address
              </label>

              <input
                name="address"
                placeholder="123 Main Street"
                className="
                  w-full
                  h-12
                  px-4
                  rounded-xl
                  border
                "
              />

            </div>

            <div className="grid md:grid-cols-3 gap-5">

              <div>

                <label className="block text-sm font-medium mb-2">
                  State
                </label>

                <input
                  name="state"
                  placeholder="Texas"
                  className="
                    w-full
                    h-12
                    px-4
                    rounded-xl
                    border
                  "
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  Country
                </label>

                <input
                  name="country"
                  defaultValue="USA"
                  className="
                    w-full
                    h-12
                    px-4
                    rounded-xl
                    border
                  "
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  Postal Code
                </label>

                <input
                  name="postalCode"
                  placeholder="75001"
                  className="
                    w-full
                    h-12
                    px-4
                    rounded-xl
                    border
                  "
                />

              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <label className="block text-sm font-medium mb-2">
                  Phone
                </label>

                <input
                  name="phone"
                  type="tel"
                  placeholder="+1 555 555 5555"
                  className="
                    w-full
                    h-12
                    px-4
                    rounded-xl
                    border
                  "
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  Location Email
                </label>

                <input
                  name="email"
                  type="email"
                  placeholder="dallas@example.com"
                  className="
                    w-full
                    h-12
                    px-4
                    rounded-xl
                    border
                  "
                />

              </div>

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                Timezone
              </label>

              <input
                name="timezone"
                defaultValue="America/Chicago"
                className="
                  w-full
                  h-12
                  px-4
                  rounded-xl
                  border
                "
              />

            </div>

            <div className="pt-2">

              <button
                type="submit"
                className="
                  px-6
                  py-3
                  rounded-xl
                  bg-orange-600
                  text-white
                  font-medium
                  hover:bg-orange-700
                "
              >
                Create Location
              </button>

            </div>

          </form>

        </div>

      )}

      {/* ========================================================
         PROFESSIONAL LIMIT
      ======================================================== */}

      {canCreate && atLimit && !isEnterprise && (

        <div
          className="
            bg-white
            border
            rounded-3xl
            p-8
            text-center
          "
        >

          <div
            className="
              mx-auto
              w-14
              h-14
              rounded-2xl
              bg-orange-100
              flex
              items-center
              justify-center
              text-orange-600
              text-2xl
            "
          >
            ↑
          </div>

          <h2 className="text-xl font-semibold mt-4">
            Need another city?
          </h2>

          <p className="text-slate-500 mt-2 max-w-xl mx-auto">
            Your Professional plan includes one
            location. Upgrade to Enterprise to
            manage multiple cities, offices, and
            branches.
          </p>

          <Link
            href="/billing"
            className="
              inline-flex
              mt-5
              px-6
              py-3
              rounded-xl
              bg-orange-600
              text-white
              font-medium
              hover:bg-orange-700
            "
          >
            Upgrade to Enterprise
          </Link>

        </div>

      )}

    </div>
  )
}