"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Prisma } from "@prisma/client"

import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"

/* =========================================================
   TYPES
========================================================= */

export type DepartmentActionState = {
  success: boolean
  message: string
  errors?: Record<string, string>
}

/* =========================================================
   HELPERS
========================================================= */

function getString(formData: FormData, key: string) {
  const value = formData.get(key)

  if (typeof value !== "string") {
    return ""
  }

  return value.trim()
}

async function getAdminOrgId() {
  const session = await auth()

  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    throw new Error("Organization not found in session")
  }

  return orgId
}

/* =========================================================
   CREATE DEPARTMENT
========================================================= */

export async function createDepartmentAction(
  formData: FormData
): Promise<DepartmentActionState> {
  const orgId = await getAdminOrgId()

  const name = getString(formData, "name")
  const code = getString(formData, "code")
  const description = getString(formData, "description")
  const color = getString(formData, "color")

  /* -------------------------------------------------------
     VALIDATION
  ------------------------------------------------------- */

  const errors: Record<string, string> = {}

  if (!name) {
    errors.name = "Department name is required"
  }

  if (name.length > 100) {
    errors.name = "Department name must be under 100 characters"
  }

  if (code.length > 30) {
    errors.code = "Department code must be under 30 characters"
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please correct the highlighted fields",
      errors
    }
  }

  /* -------------------------------------------------------
     DUPLICATE CHECK
  ------------------------------------------------------- */

  const existingDepartment =
    await prisma.department.findUnique({
      where: {
        orgId_name: {
          orgId,
          name
        }
      },
      select: {
        id: true
      }
    })

  if (existingDepartment) {
    return {
      success: false,
      message: "A department with this name already exists",
      errors: {
        name: "Department name already exists"
      }
    }
  }

  /* -------------------------------------------------------
     CREATE
  ------------------------------------------------------- */

  try {
    await prisma.department.create({
      data: {
        orgId,
        name,
        code: code || null,
        description: description || null,
        color: color || null,
        active: true
      }
    })

    revalidatePath("/admin/departments")
  } catch (error) {
    console.error("CREATE DEPARTMENT ERROR:", error)

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "A department with this name already exists",
        errors: {
          name: "Department name already exists"
        }
      }
    }

    return {
      success: false,
      message: "Unable to create department"
    }
  }

  return {
    success: true,
    message: "Department created successfully"
  }
}

/* =========================================================
   UPDATE DEPARTMENT
========================================================= */

export async function updateDepartmentAction(
  departmentId: string,
  formData: FormData
): Promise<DepartmentActionState> {
  const orgId = await getAdminOrgId()

  const name = getString(formData, "name")
  const code = getString(formData, "code")
  const description = getString(formData, "description")
  const color = getString(formData, "color")

  const activeValue = getString(formData, "active")

  const active =
    activeValue === "true" ||
    activeValue === "on" ||
    activeValue === "1"

  /* -------------------------------------------------------
     VALIDATION
  ------------------------------------------------------- */

  const errors: Record<string, string> = {}

  if (!departmentId) {
    return {
      success: false,
      message: "Invalid department ID"
    }
  }

  if (!name) {
    errors.name = "Department name is required"
  }

  if (name.length > 100) {
    errors.name = "Department name must be under 100 characters"
  }

  if (code.length > 30) {
    errors.code = "Department code must be under 30 characters"
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please correct the highlighted fields",
      errors
    }
  }

  /* -------------------------------------------------------
     TENANT-SAFE EXISTENCE CHECK
  ------------------------------------------------------- */

  const department = await prisma.department.findFirst({
    where: {
      id: departmentId,
      orgId
    },
    select: {
      id: true
    }
  })

  if (!department) {
    return {
      success: false,
      message: "Department not found"
    }
  }

  /* -------------------------------------------------------
     DUPLICATE NAME CHECK
  ------------------------------------------------------- */

  const duplicate = await prisma.department.findFirst({
    where: {
      orgId,
      name,
      NOT: {
        id: departmentId
      }
    },
    select: {
      id: true
    }
  })

  if (duplicate) {
    return {
      success: false,
      message: "A department with this name already exists",
      errors: {
        name: "Department name already exists"
      }
    }
  }

  /* -------------------------------------------------------
     UPDATE
  ------------------------------------------------------- */

  try {
    await prisma.department.update({
      where: {
        id: departmentId
      },
      data: {
        name,
        code: code || null,
        description: description || null,
        color: color || null,
        active
      }
    })

    revalidatePath("/admin/departments")
    revalidatePath(
      `/admin/departments/${departmentId}`
    )
    revalidatePath(
      `/admin/departments/${departmentId}/edit`
    )
  } catch (error) {
    console.error("UPDATE DEPARTMENT ERROR:", error)

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "A department with this name already exists",
        errors: {
          name: "Department name already exists"
        }
      }
    }

    return {
      success: false,
      message: "Unable to update department"
    }
  }

  return {
    success: true,
    message: "Department updated successfully"
  }
}

/* =========================================================
   DELETE DEPARTMENT
========================================================= */

export async function deleteDepartmentAction(
  departmentId: string
): Promise<DepartmentActionState> {
  const orgId = await getAdminOrgId()

  if (!departmentId) {
    return {
      success: false,
      message: "Invalid department ID"
    }
  }

  /* -------------------------------------------------------
     LOAD DEPARTMENT WITH RELATION COUNTS
  ------------------------------------------------------- */

  const department = await prisma.department.findFirst({
    where: {
      id: departmentId,
      orgId
    },
    select: {
      id: true,
      name: true,

      _count: {
        select: {
          users: true,
          teams: true,
          Employee: true
        }
      }
    }
  })

  if (!department) {
    return {
      success: false,
      message: "Department not found"
    }
  }

  /* -------------------------------------------------------
     PREVENT UNSAFE DELETE
  ------------------------------------------------------- */

  if (department._count.Employee > 0) {
    return {
      success: false,
      message:
        `Cannot delete ${department.name}. ` +
        `${department._count.Employee} employee(s) are assigned to it.`
    }
  }

  if (department._count.users > 0) {
    return {
      success: false,
      message:
        `Cannot delete ${department.name}. ` +
        `${department._count.users} user(s) are assigned to it.`
    }
  }

  if (department._count.teams > 0) {
    return {
      success: false,
      message:
        `Cannot delete ${department.name}. ` +
        `${department._count.teams} team(s) are assigned to it.`
    }
  }

  /* -------------------------------------------------------
     DELETE
  ------------------------------------------------------- */

  try {
    await prisma.department.delete({
      where: {
        id: departmentId
      }
    })

    revalidatePath("/admin/departments")

    return {
      success: true,
      message: "Department deleted successfully"
    }
  } catch (error) {
    console.error("DELETE DEPARTMENT ERROR:", error)

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return {
        success: false,
        message:
          "This department is still connected to other records"
      }
    }

    return {
      success: false,
      message: "Unable to delete department"
    }
  }
}

/* =========================================================
   TOGGLE DEPARTMENT STATUS
========================================================= */

export async function toggleDepartmentStatusAction(
  departmentId: string
): Promise<DepartmentActionState> {
  const orgId = await getAdminOrgId()

  const department = await prisma.department.findFirst({
    where: {
      id: departmentId,
      orgId
    },
    select: {
      id: true,
      active: true
    }
  })

  if (!department) {
    return {
      success: false,
      message: "Department not found"
    }
  }

  try {
    await prisma.department.update({
      where: {
        id: departmentId
      },
      data: {
        active: !department.active
      }
    })

    revalidatePath("/admin/departments")

    return {
      success: true,
      message: department.active
        ? "Department deactivated successfully"
        : "Department activated successfully"
    }
  } catch (error) {
    console.error(
      "TOGGLE DEPARTMENT STATUS ERROR:",
      error
    )

    return {
      success: false,
      message: "Unable to change department status"
    }
  }
}