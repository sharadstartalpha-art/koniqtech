import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* ============================================================
   TYPES
============================================================ */

type LocationStatus = "ACTIVE" | "INACTIVE";

type LocationPayload = {
  name?: unknown;
  addressLine1?: unknown;
  addressLine2?: unknown;
  city?: unknown;
  state?: unknown;
  postalCode?: unknown;
  country?: unknown;
  phone?: unknown;
  email?: unknown;
  timezone?: unknown;
  status?: unknown;
  isDefault?: unknown;
};

/* ============================================================
   HELPERS
============================================================ */

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePlan(plan: unknown): string {
  return String(plan ?? "")
    .trim()
    .toLowerCase();
}

function getLocationLimit(plan: unknown): number | null {
  const normalizedPlan = normalizePlan(plan);

  /*
   * Enterprise = unlimited locations.
   *
   * Starter and Professional = one location.
   *
   * This intentionally does NOT use SubscriptionPlan comparisons,
   * because the API only needs the persisted organization plan.
   */
  if (normalizedPlan === "enterprise") {
    return null;
  }

  return 1;
}

function getPlanLabel(plan: unknown): string {
  const normalizedPlan = normalizePlan(plan);

  switch (normalizedPlan) {
    case "enterprise":
      return "Enterprise";

    case "professional":
    case "pro":
      return "Professional";

    case "starter":
      return "Starter";

    default:
      return normalizedPlan
        ? normalizedPlan.charAt(0).toUpperCase() +
            normalizedPlan.slice(1)
        : "Starter";
  }
}

function isValidEmail(email: string): boolean {
  if (!email) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidTimezone(timezone: string): boolean {
  if (!timezone) {
    return true;
  }

  try {
    new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
    });

    return true;
  } catch {
    return false;
  }
}

function parseBoolean(
  value: unknown,
  fallback = false
): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true" || normalized === "1") {
      return true;
    }

    if (normalized === "false" || normalized === "0") {
      return false;
    }
  }

  return fallback;
}

function normalizeStatus(
  value: unknown,
  fallback: LocationStatus = "ACTIVE"
): LocationStatus {
  const normalized = text(value).toUpperCase();

  if (
    normalized === "ACTIVE" ||
    normalized === "INACTIVE"
  ) {
    return normalized;
  }

  return fallback;
}

function jsonError(
  message: string,
  status = 400,
  extra: Record<string, unknown> = {}
) {
  return NextResponse.json(
    {
      error: message,
      ...extra,
    },
    { status }
  );
}

/* ============================================================
   AUTHENTICATION + PERMISSIONS
============================================================ */

async function getAuthorizedContext() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: jsonError("Authentication required.", 401),
    };
  }

  const orgId = session.user.orgId;

  if (!orgId) {
    return {
      error: jsonError(
        "Your account is not associated with an organization.",
        403
      ),
    };
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
    });

  if (!currentUser) {
    return {
      error: jsonError("User not found.", 401),
    };
  }

  /*
   * Owner always has location-management access.
   *
   * Other CRM users require the Locations permission.
   */
  const role =
    currentUser.organizationRole?.name
      ?.trim()
      .toLowerCase() ?? "";

  const locationPermission =
    currentUser.organizationRole?.permissions.find(
      (permission) =>
        permission.module?.trim().toLowerCase() ===
        "locations"
    );

  const canView =
    role === "owner" ||
    Boolean(locationPermission?.canView);

  const canCreate =
    role === "owner" ||
    Boolean(locationPermission?.canCreate);

  const canEdit =
    role === "owner" ||
    Boolean(locationPermission?.canEdit);

  const canDelete =
    role === "owner" ||
    Boolean(locationPermission?.canDelete);

  const organization =
    await prisma.organization.findUnique({
      where: {
        id: orgId,
      },
      select: {
        id: true,
        plan: true,
        active: true,
      },
    });

  if (!organization) {
    return {
      error: jsonError("Organization not found.", 404),
    };
  }

  return {
    session,
    currentUser,
    orgId,
    organization,
    permissions: {
      canView,
      canCreate,
      canEdit,
      canDelete,
    },
  };
}

/* ============================================================
   GET
   ============================================================

   GET /api/settings/locations

   Returns:
   - locations
   - current plan
   - maxLocations
============================================================ */

export async function GET() {
  try {
    const context = await getAuthorizedContext();

    if ("error" in context) {
      return context.error;
    }

    const {
      orgId,
      organization,
      permissions,
    } = context;

    if (!permissions.canView) {
      return jsonError(
        "You do not have permission to view locations.",
        403
      );
    }

    const locations =
      await prisma.organizationLocation.findMany({
        where: {
          orgId,
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
      });

    const maxLocations =
      getLocationLimit(organization.plan);

    const responseLocations =
      locations.map((location) => ({
        id: location.id,
        name: location.name,

        /*
         * The database has one `address` field.
         * The frontend uses addressLine1/addressLine2.
         *
         * We expose the database value as addressLine1
         * so the UI does not require a schema change.
         */
        addressLine1: location.address ?? null,
        addressLine2: null,

        city: location.city ?? null,
        state: location.state ?? null,
        postalCode: location.postalCode ?? null,
        country: location.country ?? null,

        phone: location.phone ?? null,
        email: location.email ?? null,
        timezone: location.timezone ?? null,

        status: location.active
          ? "ACTIVE"
          : "INACTIVE",

        isDefault: location.isDefault,

        createdAt:
          location.createdAt.toISOString(),

        updatedAt:
          location.updatedAt.toISOString(),
      }));

    return NextResponse.json({
      locations: responseLocations,

      /*
       * IMPORTANT:
       * Return the string plan, NOT a plan configuration object.
       *
       * This fixes the TypeScript error shown in your screenshot.
       */
      plan: normalizePlan(organization.plan),

      planLabel: getPlanLabel(
        organization.plan
      ),

      maxLocations,

      activeLocations:
        responseLocations.filter(
          (location) =>
            location.status === "ACTIVE"
        ).length,

      permissions,

      unlimitedLocations:
        maxLocations === null,
    });
  } catch (error) {
    console.error(
      "[GET /api/settings/locations]",
      error
    );

    return jsonError(
      "Unable to load locations.",
      500
    );
  }
}

/* ============================================================
   POST
   ============================================================

   POST /api/settings/locations

   Creates a new location.
============================================================ */

export async function POST(
  request: NextRequest
) {
  try {
    const context =
      await getAuthorizedContext();

    if ("error" in context) {
      return context.error;
    }

    const {
      orgId,
      organization,
      permissions,
    } = context;

    if (!permissions.canCreate) {
      return jsonError(
        "You do not have permission to create locations.",
        403
      );
    }

    let body: LocationPayload;

    try {
      body =
        (await request.json()) as LocationPayload;
    } catch {
      return jsonError(
        "Invalid JSON request body.",
        400
      );
    }

    /* ----------------------------------------------------------
       PLAN LIMIT
    ---------------------------------------------------------- */

    const maxLocations =
      getLocationLimit(organization.plan);

    const existingActiveCount =
      await prisma.organizationLocation.count({
        where: {
          orgId,
          active: true,
        },
      });

    if (
      maxLocations !== null &&
      existingActiveCount >= maxLocations
    ) {
      const plan =
        normalizePlan(organization.plan);

      return jsonError(
        plan === "professional"
          ? "Your Professional plan includes 1 location. Upgrade to Enterprise to add additional locations."
          : plan === "starter"
            ? "Your Starter plan includes 1 location. Upgrade to Enterprise to add additional locations."
            : "Your current plan has reached its location limit.",
        409,
        {
          code: "LOCATION_LIMIT_REACHED",
          plan,
          planLabel: getPlanLabel(
            organization.plan
          ),
          maxLocations,
          currentLocations:
            existingActiveCount,
          upgradeRequired:
            maxLocations !== null,
        }
      );
    }

    /* ----------------------------------------------------------
       FORM VALUES
    ---------------------------------------------------------- */

    const name = text(body.name);

    const addressLine1 =
      text(body.addressLine1);

    const addressLine2 =
      text(body.addressLine2);

    const city = text(body.city);
    const state = text(body.state);
    const postalCode =
      text(body.postalCode);

    const country =
      text(body.country);

    const phone = text(body.phone);
    const email = text(body.email);

    const timezone =
      text(body.timezone) || "UTC";

    const requestedDefault =
      parseBoolean(
        body.isDefault,
        false
      );

    const requestedStatus =
      normalizeStatus(
        body.status,
        "ACTIVE"
      );

    /* ----------------------------------------------------------
       VALIDATION
    ---------------------------------------------------------- */

    if (!name) {
      return jsonError(
        "Location name is required."
      );
    }

    if (!city) {
      return jsonError(
        "City is required."
      );
    }

    if (!country) {
      return jsonError(
        "Country is required."
      );
    }

    if (!isValidEmail(email)) {
      return jsonError(
        "Please enter a valid location email address."
      );
    }

    if (!isValidTimezone(timezone)) {
      return jsonError(
        "Invalid timezone."
      );
    }

    /*
     * Database has a single address field.
     * Combine address line 1 and line 2 safely.
     */
    const address =
      [addressLine1, addressLine2]
        .filter(Boolean)
        .join(", ") || null;

    /*
     * If this is the first active location,
     * it MUST become default.
     */
    const shouldBeDefault =
      existingActiveCount === 0
        ? true
        : requestedDefault;

    /* ----------------------------------------------------------
       CREATE
    ---------------------------------------------------------- */

    const location =
      await prisma.$transaction(
        async (tx) => {
          /*
           * If creating an active default location,
           * remove default status from all other locations.
           */
          if (
            requestedStatus === "ACTIVE" &&
            shouldBeDefault
          ) {
            await tx.organizationLocation.updateMany(
              {
                where: {
                  orgId,
                  isDefault: true,
                },
                data: {
                  isDefault: false,
                },
              }
            );
          }

          return tx.organizationLocation.create(
            {
              data: {
                orgId,

                name,

                address,

                city,
                state: state || null,
                country: country || null,
                postalCode:
                  postalCode || null,

                phone: phone || null,
                email: email || null,

                timezone,

                currency: "USD",

                active:
                  requestedStatus ===
                  "ACTIVE",

                isDefault:
                  requestedStatus ===
                    "ACTIVE" &&
                  shouldBeDefault,
              },
            }
          );
        }
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Location created successfully.",

        location: {
          id: location.id,
          name: location.name,
          addressLine1:
            location.address,
          addressLine2: null,
          city: location.city,
          state: location.state,
          postalCode:
            location.postalCode,
          country: location.country,
          phone: location.phone,
          email: location.email,
          timezone: location.timezone,
          status: location.active
            ? "ACTIVE"
            : "INACTIVE",
          isDefault:
            location.isDefault,
          createdAt:
            location.createdAt.toISOString(),
          updatedAt:
            location.updatedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "[POST /api/settings/locations]",
      error
    );

    /*
     * Prisma unique constraint:
     * @@unique([orgId, name])
     */
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return jsonError(
        "A location with this name already exists in your organization.",
        409,
        {
          code: "LOCATION_NAME_EXISTS",
        }
      );
    }

    return jsonError(
      "Unable to create location.",
      500
    );
  }
}

/* ============================================================
   PATCH
   ============================================================

   PATCH /api/settings/locations

   Body:
   {
     id: "...",
     name: "...",
     addressLine1: "...",
     ...
   }
============================================================ */

export async function PATCH(
  request: NextRequest
) {
  try {
    const context =
      await getAuthorizedContext();

    if ("error" in context) {
      return context.error;
    }

    const {
      orgId,
      permissions,
    } = context;

    if (!permissions.canEdit) {
      return jsonError(
        "You do not have permission to edit locations.",
        403
      );
    }

    let body: LocationPayload & {
      id?: unknown;
    };

    try {
      body =
        (await request.json()) as LocationPayload & {
          id?: unknown;
        };
    } catch {
      return jsonError(
        "Invalid JSON request body.",
        400
      );
    }

    const locationId =
      text(body.id);

    if (!locationId) {
      return jsonError(
        "Location ID is required."
      );
    }

    /* ----------------------------------------------------------
       VERIFY ORGANIZATION OWNERSHIP
    ---------------------------------------------------------- */

    const existingLocation =
      await prisma.organizationLocation.findFirst(
        {
          where: {
            id: locationId,
            orgId,
          },
        }
      );

    if (!existingLocation) {
      return jsonError(
        "Location not found.",
        404
      );
    }

    /* ----------------------------------------------------------
       READ FIELDS
    ---------------------------------------------------------- */

    const name =
      body.name !== undefined
        ? text(body.name)
        : existingLocation.name;

    const addressLine1 =
      body.addressLine1 !== undefined
        ? text(body.addressLine1)
        : existingLocation.address ?? "";

    const addressLine2 =
      body.addressLine2 !== undefined
        ? text(body.addressLine2)
        : "";

    const city =
      body.city !== undefined
        ? text(body.city)
        : existingLocation.city;

    const state =
      body.state !== undefined
        ? text(body.state)
        : existingLocation.state ?? "";

    const postalCode =
      body.postalCode !== undefined
        ? text(body.postalCode)
        : existingLocation.postalCode ?? "";

    const country =
      body.country !== undefined
        ? text(body.country)
        : existingLocation.country ?? "";

    const phone =
      body.phone !== undefined
        ? text(body.phone)
        : existingLocation.phone ?? "";

    const email =
      body.email !== undefined
        ? text(body.email)
        : existingLocation.email ?? "";

    const timezone =
      body.timezone !== undefined
        ? text(body.timezone)
        : existingLocation.timezone ??
          "UTC";

    const status =
      body.status !== undefined
        ? normalizeStatus(
            body.status,
            existingLocation.active
              ? "ACTIVE"
              : "INACTIVE"
          )
        : existingLocation.active
          ? "ACTIVE"
          : "INACTIVE";

    const isDefault =
      body.isDefault !== undefined
        ? parseBoolean(
            body.isDefault,
            existingLocation.isDefault
          )
        : existingLocation.isDefault;

    /* ----------------------------------------------------------
       VALIDATION
    ---------------------------------------------------------- */

    if (!name) {
      return jsonError(
        "Location name is required."
      );
    }

    if (!city) {
      return jsonError(
        "City is required."
      );
    }

    if (!country) {
      return jsonError(
        "Country is required."
      );
    }

    if (!isValidEmail(email)) {
      return jsonError(
        "Please enter a valid location email address."
      );
    }

    if (!isValidTimezone(timezone)) {
      return jsonError(
        "Invalid timezone."
      );
    }

    /*
     * Prevent an existing default location from
     * being turned inactive.
     */
    if (
      existingLocation.isDefault &&
      status === "INACTIVE"
    ) {
      return jsonError(
        "Set another location as default before deactivating this location.",
        409,
        {
          code:
            "DEFAULT_LOCATION_CANNOT_BE_INACTIVE",
        }
      );
    }

    /*
     * If a location is being activated, enforce
     * the Professional/Starter one-location rule.
     */
    if (
      status === "ACTIVE" &&
      !existingLocation.active
    ) {
      const organization =
        await prisma.organization.findUnique(
          {
            where: {
              id: orgId,
            },
            select: {
              plan: true,
            },
          }
        );

      if (!organization) {
        return jsonError(
          "Organization not found.",
          404
        );
      }

      const maxLocations =
        getLocationLimit(
          organization.plan
        );

      const activeCount =
        await prisma.organizationLocation.count(
          {
            where: {
              orgId,
              active: true,
              id: {
                not: locationId,
              },
            },
          }
        );

      if (
        maxLocations !== null &&
        activeCount >= maxLocations
      ) {
        return jsonError(
          "Your current plan allows only one active location. Upgrade to Enterprise to activate additional locations.",
          409,
          {
            code:
              "LOCATION_LIMIT_REACHED",
            plan:
              normalizePlan(
                organization.plan
              ),
            maxLocations,
            currentLocations:
              activeCount,
            upgradeRequired: true,
          }
        );
      }
    }

    const address =
      [addressLine1, addressLine2]
        .filter(Boolean)
        .join(", ") || null;

    /*
     * If this is being made default,
     * clear every other default first.
     */
    const updatedLocation =
      await prisma.$transaction(
        async (tx) => {
          if (
            status === "ACTIVE" &&
            isDefault
          ) {
            await tx.organizationLocation.updateMany(
              {
                where: {
                  orgId,
                  id: {
                    not: locationId,
                  },
                  isDefault: true,
                },
                data: {
                  isDefault: false,
                },
              }
            );
          }

          return tx.organizationLocation.update(
            {
              where: {
                id: locationId,
              },
              data: {
                name,

                address,

                city,
                state: state || null,
                country: country || null,
                postalCode:
                  postalCode || null,

                phone: phone || null,
                email: email || null,

                timezone,

                active:
                  status === "ACTIVE",

                /*
                 * Never allow inactive locations
                 * to remain default.
                 */
                isDefault:
                  status === "ACTIVE" &&
                  isDefault,
              },
            }
          );
        }
      );

    return NextResponse.json({
      success: true,
      message:
        "Location updated successfully.",

      location: {
        id: updatedLocation.id,
        name: updatedLocation.name,
        addressLine1:
          updatedLocation.address,
        addressLine2: null,
        city: updatedLocation.city,
        state: updatedLocation.state,
        postalCode:
          updatedLocation.postalCode,
        country:
          updatedLocation.country,
        phone:
          updatedLocation.phone,
        email:
          updatedLocation.email,
        timezone:
          updatedLocation.timezone,
        status:
          updatedLocation.active
            ? "ACTIVE"
            : "INACTIVE",
        isDefault:
          updatedLocation.isDefault,
        createdAt:
          updatedLocation.createdAt.toISOString(),
        updatedAt:
          updatedLocation.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error(
      "[PATCH /api/settings/locations]",
      error
    );

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return jsonError(
        "A location with this name already exists in your organization.",
        409,
        {
          code: "LOCATION_NAME_EXISTS",
        }
      );
    }

    return jsonError(
      "Unable to update location.",
      500
    );
  }
}

/* ============================================================
   DELETE
   ============================================================

   DELETE /api/settings/locations?id=LOCATION_ID

   We use SOFT DELETE / DEACTIVATION instead of
   physically deleting the database record.

   This protects historical CRM records that may
   reference the location.
============================================================ */

export async function DELETE(
  request: NextRequest
) {
  try {
    const context =
      await getAuthorizedContext();

    if ("error" in context) {
      return context.error;
    }

    const {
      orgId,
      permissions,
    } = context;

    if (!permissions.canDelete) {
      return jsonError(
        "You do not have permission to deactivate locations.",
        403
      );
    }

    const { searchParams } =
      new URL(request.url);

    const locationId =
      text(searchParams.get("id"));

    if (!locationId) {
      return jsonError(
        "Location ID is required."
      );
    }

    /* ----------------------------------------------------------
       VERIFY LOCATION BELONGS TO ORGANIZATION
    ---------------------------------------------------------- */

    const location =
      await prisma.organizationLocation.findFirst(
        {
          where: {
            id: locationId,
            orgId,
          },
          select: {
            id: true,
            isDefault: true,
            active: true,
          },
        }
      );

    if (!location) {
      return jsonError(
        "Location not found.",
        404
      );
    }

    if (!location.active) {
      return NextResponse.json({
        success: true,
        message:
          "Location is already inactive.",
      });
    }

    /*
     * Never deactivate the default location.
     *
     * The customer must first make another
     * location default.
     */
    if (location.isDefault) {
      return jsonError(
        "Set another location as default before deactivating this location.",
        409,
        {
          code:
            "DEFAULT_LOCATION_CANNOT_BE_DELETED",
        }
      );
    }

    /* ----------------------------------------------------------
       SOFT DELETE
    ---------------------------------------------------------- */

    await prisma.organizationLocation.update({
      where: {
        id: locationId,
      },
      data: {
        active: false,
      },
    });

    /*
     * Remove user-location assignments for
     * the deactivated location.
     *
     * Historical location record remains intact.
     */
    await prisma.userLocation.deleteMany({
      where: {
        locationId,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Location deactivated successfully.",
    });
  } catch (error) {
    console.error(
      "[DELETE /api/settings/locations]",
      error
    );

    return jsonError(
      "Unable to deactivate location.",
      500
    );
  }
}