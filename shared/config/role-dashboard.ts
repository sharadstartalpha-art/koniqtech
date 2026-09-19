/* =========================================================
   INTERNAL PLATFORM ROLE DASHBOARDS
========================================================= */

/**
 * User.role based internal dashboards.
 *
 * IMPORTANT:
 *
 * `user` is NOT included here.
 *
 * Both customer CRM users and internal employees
 * can have User.role = "user".
 *
 * Internal employee routing is handled separately
 * through EmployeeRole.
 */
export const INTERNAL_ROLE_DASHBOARDS: Record<
  string,
  string
> = {
  super_admin:
    "/admin/dashboard",
}

/* =========================================================
   INTERNAL EMPLOYEE ROLE DASHBOARDS
========================================================= */

/**
 * EmployeeRole.name based routing.
 *
 * EmployeeRole belongs to the internal Employee record.
 *
 * We support both:
 *
 *   "data entry"
 *   "data_entry"
 *
 * because existing EmployeeRole records may use
 * either naming convention.
 */
export const INTERNAL_EMPLOYEE_DASHBOARDS: Record<
  string,
  string
> = {
  "data entry":
    "/admin/data-entry/dashboard",

  data_entry:
    "/admin/data-entry/dashboard",

  marketing:
    "/admin/marketing/dashboard",

  sales:
    "/admin/sales/dashboard",

  "sales executive":
    "/admin/sales/dashboard",

  "sales manager":
    "/admin/sales/dashboard",

  "platform sales":
    "/admin/sales/dashboard",

  platform_sales:
    "/admin/sales/dashboard",

  support:
    "/admin/dashboard",

  finance:
    "/admin/dashboard",

  developer:
    "/admin/dashboard",

  qa:
    "/admin/dashboard",

  "customer success":
    "/admin/dashboard",

  customer_success:
    "/admin/dashboard",

  "platform manager":
    "/admin/dashboard",

  platform_manager:
    "/admin/dashboard",
}

/* =========================================================
   NORMALIZE
========================================================= */

function normalizeRole(
  value?: string | null
) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
}

/* =========================================================
   PLATFORM ROLE DASHBOARD
========================================================= */

export function getDashboardForRole(
  role?: string | null
) {
  const normalizedRole =
    normalizeRole(role)

  return (
    INTERNAL_ROLE_DASHBOARDS[
      normalizedRole
    ] ??
    "/dashboard"
  )
}

/* =========================================================
   EMPLOYEE ROLE DASHBOARD
========================================================= */

export function getDashboardForEmployeeRole(
  employeeRole?: string | null
) {
  const normalizedRole =
    normalizeRole(employeeRole)

  return (
    INTERNAL_EMPLOYEE_DASHBOARDS[
      normalizedRole
    ] ??
    "/admin/dashboard"
  )
}