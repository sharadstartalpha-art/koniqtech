"use server"

import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { INTERNAL_PLATFORM_ROLES } from "@/shared/config/roles"
import prisma from "@/shared/lib/prisma"

import { setSession } from "../cookies/session"

/* ==========================================================
   Internal KoniqTech Roles
========================================================== */



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