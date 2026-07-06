"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

type DemoStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rescheduled"
  | "no_show"

const ALLOWED_STATUSES = new Set<DemoStatus>([
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
  "rescheduled",
  "no_show",
])

/* =========================================================
   GET MARKETING EMPLOYEE
========================================================= */

async function getCurrentEmployee() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const employee = await prisma.employee.findFirst({
    where: {
      userId: session.user.id,
      active: true,
    },

    select: {
      id: true,
    },
  })

  if (!employee) {
    throw new Error(
      "Active employee profile not found"
    )
  }

  return employee
}

/* =========================================================
   UPDATE DEMO STATUS
========================================================= */

export async function updateDemoStatusAction(
  formData: FormData
) {
  const employee = await getCurrentEmployee()

  const demoId = String(
    formData.get("demoId") ?? ""
  ).trim()

  const status = String(
    formData.get("status") ?? ""
  ).trim() as DemoStatus

  if (!demoId) {
    throw new Error("Demo ID is required")
  }

  if (!ALLOWED_STATUSES.has(status)) {
    throw new Error("Invalid demo status")
  }

  const demo = await prisma.demoSchedule.findFirst({
    where: {
      id: demoId,
      marketingEmployeeId: employee.id,
    },

    select: {
      id: true,
    },
  })

  if (!demo) {
    throw new Error(
      "Demo not found or not assigned to you"
    )
  }

  await prisma.demoSchedule.update({
    where: {
      id: demo.id,
    },

    data: {
      status,
    },
  })

  revalidatePath(
    `/admin/marketing/demos/${demoId}`
  )

  revalidatePath(
    "/admin/marketing/demos"
  )

  revalidatePath(
    "/admin/marketing/dashboard"
  )
}

/* =========================================================
   RESCHEDULE DEMO
========================================================= */

export async function rescheduleDemoAction(
  formData: FormData
) {
  const employee = await getCurrentEmployee()

  const demoId = String(
    formData.get("demoId") ?? ""
  ).trim()

  const meetingDate = String(
    formData.get("meetingDate") ?? ""
  ).trim()

  if (!demoId || !meetingDate) {
    throw new Error(
      "Demo and meeting date are required"
    )
  }

  const parsedDate = new Date(meetingDate)

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Invalid meeting date")
  }

  const demo = await prisma.demoSchedule.findFirst({
    where: {
      id: demoId,
      marketingEmployeeId: employee.id,
    },

    select: {
      id: true,
    },
  })

  if (!demo) {
    throw new Error(
      "Demo not found or not assigned to you"
    )
  }

  await prisma.demoSchedule.update({
    where: {
      id: demo.id,
    },

    data: {
      meetingDate: parsedDate,
      status: "rescheduled",
    },
  })

  revalidatePath(
    `/admin/marketing/demos/${demoId}`
  )

  revalidatePath(
    "/admin/marketing/demos"
  )

  revalidatePath(
    "/admin/marketing/dashboard"
  )
}

/* =========================================================
   UPDATE MEETING LINK
========================================================= */

export async function updateMeetingLinkAction(
  formData: FormData
) {
  const employee = await getCurrentEmployee()

  const demoId = String(
    formData.get("demoId") ?? ""
  ).trim()

  const meetingLink = String(
    formData.get("meetingLink") ?? ""
  ).trim()

  if (!demoId) {
    throw new Error("Demo ID is required")
  }

  const demo = await prisma.demoSchedule.findFirst({
    where: {
      id: demoId,
      marketingEmployeeId: employee.id,
    },

    select: {
      id: true,
    },
  })

  if (!demo) {
    throw new Error(
      "Demo not found or not assigned to you"
    )
  }

  await prisma.demoSchedule.update({
    where: {
      id: demo.id,
    },

    data: {
      meetingLink:
        meetingLink.length > 0
          ? meetingLink
          : null,
    },
  })

  revalidatePath(
    `/admin/marketing/demos/${demoId}`
  )
}

/* =========================================================
   UPDATE NOTES
========================================================= */

export async function updateDemoNotesAction(
  formData: FormData
) {
  const employee = await getCurrentEmployee()

  const demoId = String(
    formData.get("demoId") ?? ""
  ).trim()

  const notes = String(
    formData.get("notes") ?? ""
  ).trim()

  if (!demoId) {
    throw new Error("Demo ID is required")
  }

  const demo = await prisma.demoSchedule.findFirst({
    where: {
      id: demoId,
      marketingEmployeeId: employee.id,
    },

    select: {
      id: true,
    },
  })

  if (!demo) {
    throw new Error(
      "Demo not found or not assigned to you"
    )
  }

  await prisma.demoSchedule.update({
    where: {
      id: demo.id,
    },

    data: {
      notes:
        notes.length > 0
          ? notes
          : null,
    },
  })

  revalidatePath(
    `/admin/marketing/demos/${demoId}`
  )
}

/* =========================================================
   BACK TO DEMOS
========================================================= */

export async function backToDemosAction() {
  redirect("/admin/marketing/demos")
}