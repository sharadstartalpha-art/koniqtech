export const INTERNAL_ROLE_DASHBOARDS: Record<
  string,
  string
> = {
  super_admin:
    "/admin/dashboard",

  platform_manager:
    "/admin/dashboard",

  platform_sales:
    "/admin/sales/dashboard",

  marketing:
    "/admin/marketing/dashboard",

  data_entry:
    "/admin/data-entry/dashboard",

  developer:
    "/admin/dashboard",

  qa:
    "/admin/dashboard",

  support:
    "/admin/dashboard",

  finance:
    "/admin/dashboard",

  customer_success:
    "/admin/dashboard",
}

export function getDashboardForRole(
  role?: string | null
) {
  const normalizedRole =
    String(role ?? "")
      .trim()
      .toLowerCase()

  return (
    INTERNAL_ROLE_DASHBOARDS[
      normalizedRole
    ] ??
    "/dashboard"
  )
}