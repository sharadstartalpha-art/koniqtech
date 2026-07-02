import { redirect } from "next/navigation"

import { authGuard } from "./auth.guard"

/* ==========================================================
   Internal Platform Roles
========================================================== */

const INTERNAL_PLATFORM_ROLES = new Set([
  "super_admin",
  "platform_manager",
  "support",
  "finance",
  "developer",
  "qa",
  "customer_success",
  "marketing",
  "data_entry",
])

export async function adminGuard() {

  const user = await authGuard()

  const role = String(user.role ?? "")
    .trim()
    .toLowerCase()

  if (!INTERNAL_PLATFORM_ROLES.has(role)) {
    redirect("/dashboard")
  }

  return user
}