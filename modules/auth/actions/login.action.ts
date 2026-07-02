"use server"

import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

import prisma from "@/shared/lib/prisma"

import { setSession } from "../cookies/session"

/* ==========================================================
   Internal KoniqTech Roles
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

export async function loginAction(
  _: unknown,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()

  const password = String(formData.get("password") ?? "")

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    return {
      error: "Invalid credentials",
    }
  }

  const passwordValid = await bcrypt.compare(
    password,
    user.passwordHash
  )

  if (!passwordValid) {
    return {
      error: "Invalid credentials",
    }
  }

  await setSession({
    id: user.id,
    orgId: user.orgId,
    role: user.role,
  })

  const role = String(user.role).toLowerCase()

  if (INTERNAL_PLATFORM_ROLES.has(role)) {
    redirect("/admin/dashboard")
  }

  redirect("/dashboard")
}