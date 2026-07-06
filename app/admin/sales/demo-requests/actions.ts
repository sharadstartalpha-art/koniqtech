// app/admin/sales/demo-requests/actions.ts

"use server"

import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"

import { DemoStatus } from "@prisma/client"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"


/* ==========================================================
   TYPES
========================================================== */

export type DemoRequestActionState = {
  success: boolean
  message: string
}


/* ==========================================================
   HELPERS
========================================================== */

function getString(
  formData: FormData,
  key: string
) {
  return String(
    formData.get(key) ?? ""
  ).trim()
}


/* ==========================================================
   CREATE DEMO REQUEST
========================================================== */

export async function createDemoRequestAction(
  _previousState: DemoRequestActionState,
  formData: FormData
): Promise<DemoRequestActionState> {

  const session = await auth()

  if (!session?.user) {
    return {
      success: false,
      message: "You must be signed in.",
    }
  }


  const companyId =
    getString(
      formData,
      "companyId"
    )


  const marketingEmployeeId =
    getString(
      formData,
      "marketingEmployeeId"
    )


  const meetingDateValue =
    getString(
      formData,
      "meetingDate"
    )


  const meetingLink =
    getString(
      formData,
      "meetingLink"
    )


  const notes =
    getString(
      formData,
      "notes"
    )


  /* --------------------------------------------------------
     VALIDATION
  --------------------------------------------------------- */

  if (!companyId) {

    return {
      success: false,
      message:
        "Please select a company.",
    }

  }


  if (!marketingEmployeeId) {

    return {
      success: false,
      message:
        "Please select a marketing employee.",
    }

  }


  if (!meetingDateValue) {

    return {
      success: false,
      message:
        "Please select the demo meeting date and time.",
    }

  }


  const meetingDate =
    new Date(
      meetingDateValue
    )


  if (
    Number.isNaN(
      meetingDate.getTime()
    )
  ) {

    return {
      success: false,
      message:
        "The selected meeting date is invalid.",
    }

  }


  /* --------------------------------------------------------
     VERIFY COMPANY
  --------------------------------------------------------- */

  const company =
    await prisma.companyLead.findUnique({

      where: {
        id: companyId,
      },

      select: {
        id: true,
      },

    })


  if (!company) {

    return {
      success: false,
      message:
        "The selected company could not be found.",
    }

  }


  /* --------------------------------------------------------
     VERIFY MARKETING EMPLOYEE

     Important:
     marketingEmployeeId references Employee.id,
     not User.id.
  --------------------------------------------------------- */

  const marketer =
    await prisma.employee.findUnique({

      where: {
        id: marketingEmployeeId,
      },

      select: {

        id: true,

        active: true,

        role: {
          select: {
            name: true,
          },
        },

      },

    })


  if (!marketer) {

    return {
      success: false,
      message:
        "The selected marketing employee could not be found.",
    }

  }


  if (!marketer.active) {

    return {
      success: false,
      message:
        "The selected marketing employee is inactive.",
    }

  }


  /* --------------------------------------------------------
     MARKETING ROLE CHECK
  --------------------------------------------------------- */

  const employeeRole =
    marketer.role.name
      .trim()
      .toLowerCase()


  if (
    !employeeRole.includes(
      "marketing"
    )
  ) {

    return {
      success: false,
      message:
        "Demo requests can only be assigned to a marketing employee.",
    }

  }


  /* --------------------------------------------------------
     CREATE DEMO SCHEDULE
  --------------------------------------------------------- */

  try {

    await prisma.demoSchedule.create({

      data: {

        companyId,

        marketingEmployeeId,

        meetingDate,

        meetingLink:
          meetingLink || null,

        notes:
          notes || null,

        status:
          DemoStatus.scheduled,

      },

    })


    revalidatePath(
      "/admin/sales/demo-requests"
    )


    revalidatePath(
      "/admin/sales/dashboard"
    )

  } catch (error) {

    console.error(
      "CREATE DEMO REQUEST ERROR:",
      error
    )


    return {
      success: false,
      message:
        "Unable to create the demo request.",
    }

  }


  redirect(
    "/admin/sales/demo-requests"
  )
}


/* ==========================================================
   UPDATE DEMO REQUEST
========================================================== */

export async function updateDemoRequestAction(
  id: string,
  _previousState: DemoRequestActionState,
  formData: FormData
): Promise<DemoRequestActionState> {

  const session = await auth()

  if (!session?.user) {

    return {
      success: false,
      message:
        "You must be signed in.",
    }

  }


  const marketingEmployeeId =
    getString(
      formData,
      "marketingEmployeeId"
    )


  const meetingDateValue =
    getString(
      formData,
      "meetingDate"
    )


  const meetingLink =
    getString(
      formData,
      "meetingLink"
    )


  const notes =
    getString(
      formData,
      "notes"
    )


  const statusValue =
    getString(
      formData,
      "status"
    )


  /* --------------------------------------------------------
     VALIDATION
  --------------------------------------------------------- */

  if (!marketingEmployeeId) {

    return {
      success: false,
      message:
        "Please select a marketing employee.",
    }

  }


  if (!meetingDateValue) {

    return {
      success: false,
      message:
        "Please select the meeting date.",
    }

  }


  const meetingDate =
    new Date(
      meetingDateValue
    )


  if (
    Number.isNaN(
      meetingDate.getTime()
    )
  ) {

    return {
      success: false,
      message:
        "Invalid meeting date.",
    }

  }


  /* --------------------------------------------------------
     VALIDATE STATUS
  --------------------------------------------------------- */

  const allowedStatuses =
    Object.values(
      DemoStatus
    )


  if (
    !allowedStatuses.includes(
      statusValue as DemoStatus
    )
  ) {

    return {
      success: false,
      message:
        "Invalid demo status.",
    }

  }


  /* --------------------------------------------------------
     VERIFY DEMO EXISTS
  --------------------------------------------------------- */

  const existingDemo =
    await prisma.demoSchedule.findUnique({

      where: {
        id,
      },

      select: {
        id: true,
      },

    })


  if (!existingDemo) {

    return {
      success: false,
      message:
        "Demo request not found.",
    }

  }


  /* --------------------------------------------------------
     VERIFY MARKETER
  --------------------------------------------------------- */

  const marketer =
    await prisma.employee.findUnique({

      where: {
        id: marketingEmployeeId,
      },

      select: {

        id: true,

        active: true,

        role: {
          select: {
            name: true,
          },
        },

      },

    })


  if (!marketer) {

    return {
      success: false,
      message:
        "Marketing employee not found.",
    }

  }


  if (!marketer.active) {

    return {
      success: false,
      message:
        "The selected marketing employee is inactive.",
    }

  }


  const employeeRole =
    marketer.role.name
      .trim()
      .toLowerCase()


  if (
    !employeeRole.includes(
      "marketing"
    )
  ) {

    return {
      success: false,
      message:
        "The selected employee is not part of Marketing.",
    }

  }


  /* --------------------------------------------------------
     UPDATE
  --------------------------------------------------------- */

  try {

    await prisma.demoSchedule.update({

      where: {
        id,
      },

      data: {

        marketingEmployeeId,

        meetingDate,

        meetingLink:
          meetingLink || null,

        notes:
          notes || null,

        status:
          statusValue as DemoStatus,

      },

    })


    revalidatePath(
      "/admin/sales/demo-requests"
    )


    revalidatePath(
      `/admin/sales/demo-requests/${id}`
    )


    revalidatePath(
      "/admin/sales/dashboard"
    )


    return {
      success: true,
      message:
        "Demo request updated successfully.",
    }

  } catch (error) {

    console.error(
      "UPDATE DEMO REQUEST ERROR:",
      error
    )


    return {
      success: false,
      message:
        "Unable to update the demo request.",
    }

  }
}


/* ==========================================================
   UPDATE DEMO STATUS
========================================================== */

export async function updateDemoStatusAction(
  formData: FormData
): Promise<void> {

  const session = await auth()

  if (!session?.user) {
    return
  }


  const id =
    getString(
      formData,
      "id"
    )


  const statusValue =
    getString(
      formData,
      "status"
    )


  if (
    !id ||
    !Object.values(
      DemoStatus
    ).includes(
      statusValue as DemoStatus
    )
  ) {
    return
  }


  await prisma.demoSchedule.update({

    where: {
      id,
    },

    data: {
      status:
        statusValue as DemoStatus,
    },

  })


  revalidatePath(
    "/admin/sales/demo-requests"
  )


  revalidatePath(
    `/admin/sales/demo-requests/${id}`
  )


  revalidatePath(
    "/admin/sales/dashboard"
  )
}


/* ==========================================================
   DELETE DEMO REQUEST
========================================================== */

export async function deleteDemoRequestAction(
  formData: FormData
): Promise<void> {

  const session = await auth()

  if (!session?.user) {
    return
  }


  const id =
    getString(
      formData,
      "id"
    )


  if (!id) {
    return
  }


  const demo =
    await prisma.demoSchedule.findUnique({

      where: {
        id,
      },

      select: {
        id: true,
      },

    })


  if (!demo) {
    return
  }


  await prisma.demoSchedule.delete({

    where: {
      id,
    },

  })


  revalidatePath(
    "/admin/sales/demo-requests"
  )


  revalidatePath(
    "/admin/sales/dashboard"
  )
}