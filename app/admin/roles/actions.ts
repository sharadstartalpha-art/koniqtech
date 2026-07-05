"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

/* =========================================================
   TYPES
========================================================= */

export type RoleActionErrors = {
  name?: string
  description?: string
  permissions?: string
  general?: string
}

export type RoleActionState = {
  success: boolean
  message: string
  roleId?: string
  errors?: RoleActionErrors
}

/* =========================================================
   CONSTANTS
========================================================= */

const ROLE_MANAGEMENT_ROLES = new Set([
  "super_admin"
])

const PROTECTED_ROLE_NAMES = new Set([
  "Super Admin"
])

/* =========================================================
   AUTHORIZATION
========================================================= */

async function requireRoleManagementAccess(): Promise<
  | {
      success: true
      userId: string
      orgId: string
      role: string
    }
  | {
      success: false
      state: RoleActionState
    }
> {
  const session = await auth()

  if (!session?.user) {
    return {
      success: false,

      state: {
        success: false,
        message: "Authentication required.",
        errors: {
          general:
            "You must be signed in to manage employee roles."
        }
      }
    }
  }

  const userId = String(
    session.user.id ?? ""
  )

  const orgId = String(
    session.user.orgId ?? ""
  )

  const role = String(
    session.user.role ?? ""
  )

  if (!userId || !orgId) {
    return {
      success: false,

      state: {
        success: false,
        message:
          "Your session is missing required account information.",
        errors: {
          general:
            "A valid user ID and organization ID are required."
        }
      }
    }
  }

  if (!ROLE_MANAGEMENT_ROLES.has(role)) {
    return {
      success: false,

      state: {
        success: false,
        message:
          "You do not have permission to manage employee roles.",
        errors: {
          general:
            "Only Super Admin can create, update, or delete internal employee roles."
        }
      }
    }
  }

  return {
    success: true,
    userId,
    orgId,
    role
  }
}

/* =========================================================
   HELPERS
========================================================= */

function readString(
  formData: FormData,
  key: string
): string {
  const value = formData.get(key)

  if (typeof value !== "string") {
    return ""
  }

  return value.trim()
}

function readOptionalString(
  formData: FormData,
  key: string
): string | null {
  const value = readString(
    formData,
    key
  )

  return value.length > 0
    ? value
    : null
}

function readBoolean(
  formData: FormData,
  key: string
): boolean {
  const value = formData.get(key)

  if (typeof value !== "string") {
    return false
  }

  return [
    "true",
    "on",
    "1",
    "yes"
  ].includes(
    value.toLowerCase()
  )
}

function normalizeRoleName(
  value: string
): string {
  return value
    .replace(/\s+/g, " ")
    .trim()
}

/* =========================================================
   VALIDATION
========================================================= */

function validateRoleInput(input: {
  name: string
  description: string | null
}): RoleActionErrors {
  const errors: RoleActionErrors = {}

  if (!input.name) {
    errors.name =
      "Role name is required."
  } else if (input.name.length < 2) {
    errors.name =
      "Role name must contain at least 2 characters."
  } else if (input.name.length > 100) {
    errors.name =
      "Role name cannot exceed 100 characters."
  }

  if (
    input.description &&
    input.description.length > 1000
  ) {
    errors.description =
      "Description cannot exceed 1000 characters."
  }

  return errors
}

/* =========================================================
   PARSE FORM
========================================================= */

function parseRoleForm(
  formData: FormData
) {
  return {
    name: normalizeRoleName(
      readString(
        formData,
        "name"
      )
    ),

    description:
      readOptionalString(
        formData,
        "description"
      ),

    canCreate:
      readBoolean(
        formData,
        "canCreate"
      ),

    canEdit:
      readBoolean(
        formData,
        "canEdit"
      ),

    canDelete:
      readBoolean(
        formData,
        "canDelete"
      ),

    canApprove:
      readBoolean(
        formData,
        "canApprove"
      ),

    canAssign:
      readBoolean(
        formData,
        "canAssign"
      ),

    canExport:
      readBoolean(
        formData,
        "canExport"
      )
  }
}

/* =========================================================
   REVALIDATE ROLE ROUTES
========================================================= */

function revalidateRoleRoutes(
  roleId?: string
) {
  revalidatePath(
    "/admin/roles"
  )

  revalidatePath(
    "/admin/employees"
  )

  if (roleId) {
    revalidatePath(
      `/admin/roles/${roleId}`
    )

    revalidatePath(
      `/admin/roles/${roleId}/edit`
    )
  }
}

/* =========================================================
   CREATE ROLE
========================================================= */

export async function createRoleAction(
  formData: FormData
): Promise<RoleActionState> {
  const access =
    await requireRoleManagementAccess()

  if (!access.success) {
    return access.state
  }

  const input =
    parseRoleForm(formData)

  const errors =
    validateRoleInput({
      name: input.name,
      description:
        input.description
    })

  if (
    Object.keys(errors).length > 0
  ) {
    return {
      success: false,
      message:
        "Please correct the highlighted fields.",
      errors
    }
  }

  try {
    /* -----------------------------------------------------
       DUPLICATE CHECK

       EmployeeRole.name is globally unique in your schema.
    ----------------------------------------------------- */

    const existingRole =
      await prisma.employeeRole.findFirst({
        where: {
          name: {
            equals: input.name,
            mode: "insensitive"
          }
        },

        select: {
          id: true
        }
      })

    if (existingRole) {
      return {
        success: false,

        message:
          "An employee role with this name already exists.",

        errors: {
          name:
            "Choose a different role name."
        }
      }
    }

    /* -----------------------------------------------------
       CREATE
    ----------------------------------------------------- */

    const role =
      await prisma.employeeRole.create({
        data: {
          name:
            input.name,

          description:
            input.description,

          canCreate:
            input.canCreate,

          canEdit:
            input.canEdit,

          canDelete:
            input.canDelete,

          canApprove:
            input.canApprove,

          canAssign:
            input.canAssign,

          canExport:
            input.canExport
        },

        select: {
          id: true
        }
      })

    revalidateRoleRoutes(
      role.id
    )

    return {
      success: true,

      message:
        "Employee role created successfully.",

      roleId:
        role.id
    }
  } catch (error) {
    console.error(
      "CREATE_EMPLOYEE_ROLE_ERROR:",
      error
    )

    return {
      success: false,

      message:
        "Unable to create the employee role.",

      errors: {
        general:
          "A database error occurred while creating the role."
      }
    }
  }
}

/* =========================================================
   UPDATE ROLE
========================================================= */

export async function updateRoleAction(
  roleId: string,
  formData: FormData
): Promise<RoleActionState> {
  const access =
    await requireRoleManagementAccess()

  if (!access.success) {
    return access.state
  }

  if (!roleId) {
    return {
      success: false,

      message:
        "Invalid employee role ID.",

      errors: {
        general:
          "A valid role ID is required."
      }
    }
  }

  const input =
    parseRoleForm(formData)

  const errors =
    validateRoleInput({
      name: input.name,
      description:
        input.description
    })

  if (
    Object.keys(errors).length > 0
  ) {
    return {
      success: false,

      message:
        "Please correct the highlighted fields.",

      errors
    }
  }

  try {
    /* -----------------------------------------------------
       EXISTING ROLE
    ----------------------------------------------------- */

    const existingRole =
      await prisma.employeeRole.findUnique({
        where: {
          id: roleId
        },

        select: {
          id: true,
          name: true
        }
      })

    if (!existingRole) {
      return {
        success: false,

        message:
          "Employee role not found.",

        errors: {
          general:
            "The role may have been deleted."
        }
      }
    }

    /* -----------------------------------------------------
       DUPLICATE NAME CHECK
    ----------------------------------------------------- */

    const duplicateRole =
      await prisma.employeeRole.findFirst({
        where: {
          id: {
            not: roleId
          },

          name: {
            equals: input.name,
            mode: "insensitive"
          }
        },

        select: {
          id: true
        }
      })

    if (duplicateRole) {
      return {
        success: false,

        message:
          "Another employee role already uses this name.",

        errors: {
          name:
            "Choose a different role name."
        }
      }
    }

    /* -----------------------------------------------------
       UPDATE
    ----------------------------------------------------- */

    await prisma.employeeRole.update({
      where: {
        id: roleId
      },

      data: {
        name:
          input.name,

        description:
          input.description,

        canCreate:
          input.canCreate,

        canEdit:
          input.canEdit,

        canDelete:
          input.canDelete,

        canApprove:
          input.canApprove,

        canAssign:
          input.canAssign,

        canExport:
          input.canExport
      }
    })

    revalidateRoleRoutes(
      roleId
    )

    return {
      success: true,

      message:
        "Employee role updated successfully.",

      roleId
    }
  } catch (error) {
    console.error(
      "UPDATE_EMPLOYEE_ROLE_ERROR:",
      error
    )

    return {
      success: false,

      message:
        "Unable to update the employee role.",

      errors: {
        general:
          "A database error occurred while updating the role."
      }
    }
  }
}

/* =========================================================
   DELETE ROLE
========================================================= */

export async function deleteRoleAction(
  roleId: string
): Promise<RoleActionState> {
  const access =
    await requireRoleManagementAccess()

  if (!access.success) {
    return access.state
  }

  if (!roleId) {
    return {
      success: false,

      message:
        "Invalid employee role ID.",

      errors: {
        general:
          "A valid role ID is required."
      }
    }
  }

  try {
    /* -----------------------------------------------------
       LOAD ROLE + EMPLOYEE COUNT
    ----------------------------------------------------- */

    const role =
      await prisma.employeeRole.findUnique({
        where: {
          id: roleId
        },

        select: {
          id: true,
          name: true,

          _count: {
            select: {
              employees: true
            }
          }
        }
      })

    if (!role) {
      return {
        success: false,

        message:
          "Employee role not found.",

        errors: {
          general:
            "The role may already have been deleted."
        }
      }
    }

    /* -----------------------------------------------------
       PROTECTED ROLE
    ----------------------------------------------------- */

    if (
      PROTECTED_ROLE_NAMES.has(
        role.name
      )
    ) {
      return {
        success: false,

        message:
          "This system role cannot be deleted.",

        errors: {
          general:
            `${role.name} is a protected internal role.`
        }
      }
    }

    /* -----------------------------------------------------
       EMPLOYEE DEPENDENCY PROTECTION

       Employee.roleId is required, so deleting a role with
       assigned employees must be prevented.
    ----------------------------------------------------- */

    if (
      role._count.employees > 0
    ) {
      return {
        success: false,

        message:
          "This role cannot be deleted while employees are assigned to it.",

        errors: {
          general:
            `Reassign ${role._count.employees} employee${
              role._count.employees === 1
                ? ""
                : "s"
            } before deleting this role.`
        }
      }
    }

    /* -----------------------------------------------------
       DELETE
    ----------------------------------------------------- */

    await prisma.employeeRole.delete({
      where: {
        id: roleId
      }
    })

    revalidateRoleRoutes()

    return {
      success: true,

      message:
        "Employee role deleted successfully."
    }
  } catch (error) {
    console.error(
      "DELETE_EMPLOYEE_ROLE_ERROR:",
      error
    )

    return {
      success: false,

      message:
        "Unable to delete the employee role.",

      errors: {
        general:
          "A database error occurred while deleting the role."
      }
    }
  }
}