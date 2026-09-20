import prisma from "@/shared/lib/prisma"

type PostLoginUser = {
  id: string
  role?: string | null
  orgId?: string | null
}

const MODULE_ROUTES: Record<string, string> = {
  dashboard: "/dashboard",
  leads: "/leads",
  customers: "/customers",
  pipeline: "/pipeline",
  quotes: "/quotes",
  jobs: "/jobs",
  vendors: "/vendors",
  purchase_orders: "/purchase-orders",
  crew: "/crew",
  dispatch: "/dispatch",
  invoices: "/invoices",
  billing: "/billing",
  messages: "/messages",
  notifications: "/notifications",
  calendar: "/calendar",
  analytics: "/analytics",
  team: "/settings/team",
  settings: "/settings/company",
}

const DEFAULT_MODULE_ORDER = [
  "dashboard",
  "leads",
  "customers",
  "pipeline",
  "quotes",
  "jobs",
  "vendors",
  "purchase_orders",
  "crew",
  "dispatch",
  "invoices",
  "billing",
  "messages",
  "notifications",
  "calendar",
  "analytics",
  "team",
  "settings",
]

export async function getPostLoginRedirect(
  user: PostLoginUser
): Promise<string> {
  /*
   * ------------------------------------------------------------
   * INTERNAL PLATFORM USERS
   * ------------------------------------------------------------
   */

  const platformRole = String(user.role ?? "")
    .trim()
    .toLowerCase()

  if (platformRole === "super_admin") {
    return "/admin/dashboard"
  }

  /*
   * ------------------------------------------------------------
   * CUSTOMER CRM USER
   * ------------------------------------------------------------
   */

  if (!user.id || !user.orgId) {
    return "/unauthorized"
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },

    include: {
      organizationRole: {
        include: {
          permissions: true,
        },
      },
    },
  })

  if (!dbUser) {
    return "/login"
  }

  /*
   * ------------------------------------------------------------
   * ACCOUNT STATUS
   * ------------------------------------------------------------
   */

  if (dbUser.status !== "active") {
    return "/login?error=inactive"
  }

  /*
   * ------------------------------------------------------------
   * OWNER
   *
   * Owner can use the normal CRM dashboard.
   * ------------------------------------------------------------
   */

  const organizationRole =
    dbUser.organizationRole?.name
      ?.trim()
      .toLowerCase()

  if (organizationRole === "owner") {
    return "/dashboard"
  }

  /*
   * ------------------------------------------------------------
   * NO ORGANIZATION ROLE
   * ------------------------------------------------------------
   */

  if (!dbUser.organizationRole) {
    return "/unauthorized"
  }

  /*
   * ------------------------------------------------------------
   * FIND FIRST PERMITTED MODULE
   * ------------------------------------------------------------
   */

  const permissions =
    dbUser.organizationRole.permissions

  for (const moduleName of DEFAULT_MODULE_ORDER) {
    const permission = permissions.find(
      (item) =>
        String(item.module)
          .trim()
          .toLowerCase() === moduleName
    )

    if (permission?.canView) {
      return (
        MODULE_ROUTES[moduleName] ??
        "/unauthorized"
      )
    }
  }

  /*
   * ------------------------------------------------------------
   * USER HAS NO VIEW PERMISSIONS
   * ------------------------------------------------------------
   */

  return "/unauthorized"
}