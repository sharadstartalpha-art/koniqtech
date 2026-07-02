import { redirect } from "next/navigation"

import { authGuard } from "./auth.guard"
import { INTERNAL_PLATFORM_ROLES } from "@/shared/config/roles"

/* ==========================================================
   Internal Platform Roles
========================================================== */



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