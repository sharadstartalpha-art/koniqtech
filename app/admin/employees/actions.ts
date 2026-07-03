"use server"

import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

const EMPLOYEE_PATH = "/admin/employees"

async function requireEmployeeManagementAccess() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const role = String(session.user.role ?? "").toLowerCase()

  if (!["super_admin", "manager"].includes(role)) {
    throw new Error("You do not have permission to manage employees.")
  }

  return {
    session,
    role,
    isSuperAdmin: role === "super_admin"
  }
}

function getOptionalString(
  formData: FormData,
  key: string
): string | null {
  const value = formData.get(key)

  if (typeof value !== "string") {
    return null
  }

  const cleaned = value.trim()

  return cleaned.length > 0 ? cleaned : null
}

function getRequiredString(
  formData: FormData,
  key: string
): string {
  const value = formData.get(key)

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required.`)
  }

  return value.trim()
}

function getOptionalDate(
  formData: FormData,
  key: string
): Date | null {
  const value = getOptionalString(formData, key)

  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid ${key}.`)
  }

  return date
}

export async function createEmployeeAction(
  formData: FormData
) {
  const access = await requireEmployeeManagementAccess()

  if (!access.isSuperAdmin) {
    throw new Error(
      "Only Super Admin can create internal employees."
    )
  }

  const employeeCode = getRequiredString(
    formData,
    "employeeCode"
  )

  const firstName = getRequiredString(
    formData,
    "firstName"
  )

  const lastName = getRequiredString(
    formData,
    "lastName"
  )

  const email = getRequiredString(
    formData,
    "email"
  ).toLowerCase()

  const password = getRequiredString(
    formData,
    "password"
  )

  const departmentId = getRequiredString(
    formData,
    "departmentId"
  )

  const roleId = getRequiredString(
    formData,
    "roleId"
  )

  const managerId = getOptionalString(
    formData,
    "managerId"
  )

  if (password.length < 8) {
    throw new Error(
      "Password must contain at least 8 characters."
    )
  }

  const [existingCode, existingEmail, department, role] =
    await Promise.all([
      prisma.employee.findUnique({
        where: {
          employeeCode
        },
        select: {
          id: true
        }
      }),

      prisma.employee.findUnique({
        where: {
          email
        },
        select: {
          id: true
        }
      }),

      prisma.department.findUnique({
        where: {
          id: departmentId
        },
        select: {
          id: true
        }
      }),

      prisma.employeeRole.findUnique({
        where: {
          id: roleId
        },
        select: {
          id: true
        }
      })
    ])

  if (existingCode) {
    throw new Error(
      "An employee with this employee code already exists."
    )
  }

  if (existingEmail) {
    throw new Error(
      "An employee with this email already exists."
    )
  }

  if (!department) {
    throw new Error("Selected department does not exist.")
  }

  if (!role) {
    throw new Error("Selected employee role does not exist.")
  }

  if (managerId) {
    const manager = await prisma.employee.findUnique({
      where: {
        id: managerId
      },
      select: {
        id: true,
        active: true
      }
    })

    if (!manager || !manager.active) {
      throw new Error(
        "Selected manager does not exist or is inactive."
      )
    }
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.employee.create({
    data: {
      employeeCode,
      firstName,
      lastName,
      email,
      passwordHash,

      phone: getOptionalString(formData, "phone"),

      departmentId,
      roleId,
      managerId,

      designation: getOptionalString(
        formData,
        "designation"
      ),

      joiningDate: getOptionalDate(
        formData,
        "joiningDate"
      ),

      dateOfBirth: getOptionalDate(
        formData,
        "dateOfBirth"
      ),

      gender: getOptionalString(
        formData,
        "gender"
      ),

      employmentType: getOptionalString(
        formData,
        "employmentType"
      ),

      address: getOptionalString(
        formData,
        "address"
      ),

      city: getOptionalString(
        formData,
        "city"
      ),

      state: getOptionalString(
        formData,
        "state"
      ),

      country: getOptionalString(
        formData,
        "country"
      ),

      postalCode: getOptionalString(
        formData,
        "postalCode"
      ),

      emergencyContactName: getOptionalString(
        formData,
        "emergencyContactName"
      ),

      emergencyContactPhone: getOptionalString(
        formData,
        "emergencyContactPhone"
      ),

      active: true
    }
  })

  revalidatePath(EMPLOYEE_PATH)
  redirect(EMPLOYEE_PATH)
}

export async function updateEmployeeAction(
  employeeId: string,
  formData: FormData
) {
  const access = await requireEmployeeManagementAccess()

  const existingEmployee =
    await prisma.employee.findUnique({
      where: {
        id: employeeId
      },
      select: {
        id: true,
        email: true,
        employeeCode: true
      }
    })

  if (!existingEmployee) {
    throw new Error("Employee not found.")
  }

  const employeeCode = getRequiredString(
    formData,
    "employeeCode"
  )

  const firstName = getRequiredString(
    formData,
    "firstName"
  )

  const lastName = getRequiredString(
    formData,
    "lastName"
  )

  const email = getRequiredString(
    formData,
    "email"
  ).toLowerCase()

  const departmentId = getRequiredString(
    formData,
    "departmentId"
  )

  const roleId = getRequiredString(
    formData,
    "roleId"
  )

  const managerId = getOptionalString(
    formData,
    "managerId"
  )

  if (managerId === employeeId) {
    throw new Error(
      "An employee cannot be their own manager."
    )
  }

  const duplicate = await prisma.employee.findFirst({
    where: {
      id: {
        not: employeeId
      },
      OR: [
        {
          employeeCode
        },
        {
          email
        }
      ]
    },
    select: {
      id: true
    }
  })

  if (duplicate) {
    throw new Error(
      "Another employee already uses this email or employee code."
    )
  }

  const password = getOptionalString(
    formData,
    "password"
  )

  let passwordHash: string | undefined

  if (password) {
    if (password.length < 8) {
      throw new Error(
        "Password must contain at least 8 characters."
      )
    }

    passwordHash = await bcrypt.hash(password, 12)
  }

  await prisma.employee.update({
    where: {
      id: employeeId
    },
    data: {
      employeeCode,
      firstName,
      lastName,
      email,

      phone: getOptionalString(formData, "phone"),

      departmentId,
      roleId,
      managerId,

      designation: getOptionalString(
        formData,
        "designation"
      ),

      joiningDate: getOptionalDate(
        formData,
        "joiningDate"
      ),

      dateOfBirth: getOptionalDate(
        formData,
        "dateOfBirth"
      ),

      gender: getOptionalString(
        formData,
        "gender"
      ),

      employmentType: getOptionalString(
        formData,
        "employmentType"
      ),

      address: getOptionalString(
        formData,
        "address"
      ),

      city: getOptionalString(
        formData,
        "city"
      ),

      state: getOptionalString(
        formData,
        "state"
      ),

      country: getOptionalString(
        formData,
        "country"
      ),

      postalCode: getOptionalString(
        formData,
        "postalCode"
      ),

      emergencyContactName: getOptionalString(
        formData,
        "emergencyContactName"
      ),

      emergencyContactPhone: getOptionalString(
        formData,
        "emergencyContactPhone"
      ),

      ...(passwordHash
        ? {
            passwordHash
          }
        : {})
    }
  })

  revalidatePath(EMPLOYEE_PATH)
  revalidatePath(`${EMPLOYEE_PATH}/${employeeId}/edit`)

  redirect(EMPLOYEE_PATH)
}

export async function toggleEmployeeStatusAction(
  employeeId: string
) {
  const access = await requireEmployeeManagementAccess()

  if (!access.isSuperAdmin) {
    throw new Error(
      "Only Super Admin can change employee status."
    )
  }

  const employee = await prisma.employee.findUnique({
    where: {
      id: employeeId
    },
    select: {
      id: true,
      active: true
    }
  })

  if (!employee) {
    throw new Error("Employee not found.")
  }

  await prisma.employee.update({
    where: {
      id: employeeId
    },
    data: {
      active: !employee.active
    }
  })

  revalidatePath(EMPLOYEE_PATH)
}

export async function deleteEmployeeAction(
  employeeId: string
) {
  const access = await requireEmployeeManagementAccess()

  if (!access.isSuperAdmin) {
    throw new Error(
      "Only Super Admin can delete employees."
    )
  }

  const employee = await prisma.employee.findUnique({
    where: {
      id: employeeId
    },
    select: {
      id: true,

      _count: {
        select: {
          subordinates: true,
          tasks: true,
          approvals: true,
          attendances: true,
          salaries: true,
          leaves: true,
          documents: true,
          activities: true,
          EmployeeSession: true
        }
      }
    }
  })

  if (!employee) {
    throw new Error("Employee not found.")
  }

  const hasRelatedRecords = Object.values(
    employee._count
  ).some((count) => count > 0)

  if (hasRelatedRecords) {
    throw new Error(
      "This employee has related operational records. Deactivate the employee instead of deleting them."
    )
  }

  await prisma.employee.delete({
    where: {
      id: employeeId
    }
  })

  revalidatePath(EMPLOYEE_PATH)
}