import { NextResponse } from "next/server"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {

  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        redirectTo: "/login",
      },
      {
        status: 401,
      }
    )
  }

  const userId =
    session.user.id

  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        organizationRole: {
          include: {
            permissions: true,
          },
        },
      },
    })

  if (!user) {
    return NextResponse.json(
      {
        redirectTo: "/login",
      },
      {
        status: 401,
      }
    )
  }

  /* ========================================================
     CUSTOMER ORGANIZATION OWNER
  ======================================================== */

  const roleName =
    String(
      user.organizationRole?.name ?? ""
    )
      .trim()
      .toLowerCase()

  const isOwner =
    roleName === "owner"

  /*
   * Owner always has access to the CRM dashboard.
   */

  if (isOwner) {
    return NextResponse.json({
      redirectTo: "/dashboard",
    })
  }

  /* ========================================================
     DASHBOARD PERMISSION
  ======================================================== */

  const dashboardPermission =
    user.organizationRole?.permissions.find(
      (permission) =>
        permission.module.toLowerCase() ===
        "dashboard"
    )

  if (
    dashboardPermission?.canView
  ) {

    return NextResponse.json({
      redirectTo: "/dashboard",
    })
  }

  /* ========================================================
     NO DASHBOARD ACCESS
     
     Find the first CRM module that the user can view.
  ======================================================== */

  const permissions =
    user.organizationRole?.permissions ?? []

  const canView =
    (module: string) =>
      permissions.some(
        (permission) =>
          permission.module.toLowerCase() ===
            module.toLowerCase() &&
          permission.canView
      )

  /*
   * Keep this order intentional.
   * The first permitted module becomes the landing page.
   */

  if (canView("Leads")) {

    return NextResponse.json({
      redirectTo: "/leads",
    })
  }

  if (canView("Customers")) {

    return NextResponse.json({
      redirectTo: "/customers",
    })
  }

  if (canView("Pipeline")) {

    return NextResponse.json({
      redirectTo: "/pipeline",
    })
  }

  if (canView("Quotes")) {

    return NextResponse.json({
      redirectTo: "/quotes",
    })
  }

  if (canView("Jobs")) {

    return NextResponse.json({
      redirectTo: "/jobs",
    })
  }

  if (canView("Calendar")) {

    return NextResponse.json({
      redirectTo: "/calendar",
    })
  }

  if (canView("Billing")) {

    return NextResponse.json({
      redirectTo: "/billing",
    })
  }

  if (canView("Messages")) {

    return NextResponse.json({
      redirectTo: "/messages",
    })
  }

  /*
   * User has no permitted CRM module.
   */

  return NextResponse.json({
    redirectTo: "/unauthorized",
  })
}